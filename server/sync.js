import { getDb } from './db.js';
import fetch from 'node-fetch';

const BASE_URL = 'https://api.airtable.com/v0';

const getTables = () => ({
    PROJECTS: process.env.VITE_AIRTABLE_TABLE_PROJECTS || 'Projects',
    UNITS: process.env.VITE_AIRTABLE_TABLE_UNITS || 'Units',
    HOTSPOTS: process.env.VITE_AIRTABLE_TABLE_HOTSPOTS || 'Hotspots',
    GALLERY: process.env.VITE_AIRTABLE_TABLE_GALLERY || 'Gallery',
    RESOURCES: process.env.VITE_AIRTABLE_TABLE_RESOURCES || 'Resources',
});

const getHeaders = () => ({
    'Authorization': `Bearer ${process.env.VITE_AIRTABLE_PAT}`,
    'Content-Type': 'application/json',
});

async function fetchAllRecords(table, filterFormula = '') {
    const BASE_ID = process.env.VITE_AIRTABLE_BASE_ID;
    const headers = getHeaders();
    let allRecords = [];
    let offset = null;

    do {
        let url = `${BASE_URL}/${BASE_ID}/${table}?pageSize=100`;
        if (filterFormula) {
            url += `&filterByFormula=${encodeURIComponent(filterFormula)}`;
        }
        if (offset) {
            url += `&offset=${offset}`;
        }

        const response = await fetch(url, { headers });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(`Airtable Error (${table}): ${error.error?.message || response.statusText}`);
        }

        const data = await response.json();
        allRecords = [...allRecords, ...data.records];
        offset = data.offset;
    } while (offset);

    return allRecords;
}

export async function syncAirtable() {
    console.log('Starting Airtable sync...');

    const PAT = process.env.VITE_AIRTABLE_PAT;
    const BASE_ID = process.env.VITE_AIRTABLE_BASE_ID;
    const TABLES = getTables();

    if (!PAT || !BASE_ID) {
        console.error('Missing Airtable configuration (PAT or BASE_ID)');
        return { success: false, error: 'Missing Configuration' };
    }

    const db = await getDb();

    try {
        // 1. Fetch Projects
        const projects = await fetchAllRecords(TABLES.PROJECTS);
        console.log(`Fetched ${projects.length} projects`);

        await db.run('BEGIN TRANSACTION');

        // Clear existing Airtable data (preserve local data)
        // Delete dependent records for airtable projects first
        await db.run("DELETE FROM units WHERE project_id IN (SELECT id FROM projects WHERE source = 'airtable')");
        await db.run("DELETE FROM hotspots WHERE project_id IN (SELECT id FROM projects WHERE source = 'airtable')");
        await db.run("DELETE FROM gallery WHERE project_id IN (SELECT id FROM projects WHERE source = 'airtable')");
        await db.run("DELETE FROM resources WHERE project_id IN (SELECT id FROM projects WHERE source = 'airtable')");

        // Delete airtable projects
        await db.run("DELETE FROM projects WHERE source = 'airtable'");

        for (const record of projects) {
            const f = record.fields;
            const features = JSON.stringify([
                f['Bedrooms'],
                f['Bathrooms'],
                f['Unit Sizes']
            ].filter(Boolean));

            const details = JSON.stringify({
                description: f['Overview Blurb'],
                statusTag: f['Status'],
                heroImage: f['Hero Image']?.[0]?.url,
                stats: {
                    beds: f['Bedrooms'],
                    baths: f['Bathrooms'],
                    size: f['Unit Sizes'],
                    ipdc: f['IPDC']
                },
                developer: {
                    name: f['Dev Name'],
                    description: f['Dev Bio'],
                    image: f['Dev Image']?.[0]?.url
                },
                map: {
                    lat: f['Latitude'],
                    lng: f['Longitude']
                }
            });

            await db.run(`INSERT INTO projects (id, title, location, price, image, tag, collection, slug, features, details, last_synced) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    record.id,
                    f['Name'],
                    f['Location'] || '',
                    f['Price Display'] || 'POA',
                    f['Hero Image']?.[0]?.url || '',
                    f['Status Tag'] || '',
                    f['Collection'],
                    f['Slug'] || '',
                    features,
                    details,
                    Date.now()
                ]
            );
        }

        // 2. Fetch ALL Units
        console.log('Fetching units...');
        const units = await fetchAllRecords(TABLES.UNITS);
        for (const u of units) {
            const f = u.fields;
            const projectIds = f['Project'];
            if (projectIds && projectIds.length > 0) {
                const projectId = projectIds[0];

                await db.run(`INSERT INTO units (
                    id, project_id, config, price, area, status, floorPlan, image, description, totalUnits, soldUnits, minPrice, percentage
                 ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [
                    u.id,
                    projectId,
                    f['Unit Configuration'],
                    f['Price'],
                    f['Area'],
                    f['Status'],
                    f['Floor Plan']?.[0]?.url || f['Floorplan']?.[0]?.url || f['Attachments']?.[0]?.url,
                    f['Unit Type Image']?.[0]?.url || f['Unit Image']?.[0]?.url || f['Image']?.[0]?.url || f['Render']?.[0]?.url || f['Photo']?.[0]?.url,
                    f['Description'],
                    f['Units Total'],
                    f['Units Sold'],
                    f['Min Price'],
                    f['Percentage'] || f['Share'] || f['Fraction'] || f['Ownership Display']
                ]);
            }
        }

        // 3. Hotspots
        console.log('Fetching hotspots...');
        const hotspots = await fetchAllRecords(TABLES.HOTSPOTS);
        for (const h of hotspots) {
            const f = h.fields;
            const projectIds = f['Project'];
            if (projectIds && projectIds.length > 0) {
                await db.run(`INSERT INTO hotspots (id, project_id, name, category, distance, time) VALUES (?, ?, ?, ?, ?, ?)`, [
                    h.id, projectIds[0], f['Place Name'], f['Category'], f['Distance'], f['Time']
                ]);
            }
        }

        // 4. Gallery
        console.log('Fetching gallery...');
        const gallery = await fetchAllRecords(TABLES.GALLERY);
        for (const g of gallery) {
            const f = g.fields;
            const projectIds = f['Project'];
            if (projectIds && projectIds.length > 0) {
                await db.run(`INSERT INTO gallery (id, project_id, url, caption) VALUES (?, ?, ?, ?)`, [
                    g.id, projectIds[0], f['Image']?.[0]?.url || f['Attachments']?.[0]?.url, f['Caption']
                ]);
            }
        }

        // 5. Resources
        console.log('Fetching resources...');
        const resources = await fetchAllRecords(TABLES.RESOURCES);
        for (const r of resources) {
            const f = r.fields;
            const projectIds = f['Project'];
            if (projectIds && projectIds.length > 0) {
                const link = f['URL'] || f['Link/File'] || f['Attachments']?.[0]?.url;
                const image = f['Image']?.[0]?.url ||
                    f['Attachments']?.[0]?.thumbnails?.large?.url ||
                    (f['Attachments']?.[0]?.type?.startsWith('image') ? f['Attachments']?.[0]?.url : null);

                await db.run(`INSERT INTO resources (id, project_id, label, type, link, image) VALUES (?, ?, ?, ?, ?, ?)`, [
                    r.id, projectIds[0], f['Label'], f['Type'], link, image
                ]);
            }
        }

        await db.run('COMMIT');
        console.log('Sync complete.');
        return { success: true };

    } catch (error) {
        await db.run('ROLLBACK');
        console.error('Sync failed:', error);
        return { success: false, error: error.message };
    }
}
