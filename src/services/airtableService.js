const BASE_URL = 'https://api.airtable.com/v0';
const PAT = import.meta.env.VITE_AIRTABLE_PAT;
const BASE_ID = import.meta.env.VITE_AIRTABLE_BASE_ID;

import { oneParkLaneProject } from '../data/oneParkLaneData';

const TABLES = {
    PROJECTS: import.meta.env.VITE_AIRTABLE_TABLE_PROJECTS || 'Projects',
    UNITS: import.meta.env.VITE_AIRTABLE_TABLE_UNITS || 'Units',
    HOTSPOTS: import.meta.env.VITE_AIRTABLE_TABLE_HOTSPOTS || 'Hotspots',
    GALLERY: import.meta.env.VITE_AIRTABLE_TABLE_GALLERY || 'Gallery',
    RESOURCES: import.meta.env.VITE_AIRTABLE_TABLE_RESOURCES || 'Resources',
};

const headers = {
    'Authorization': `Bearer ${PAT}`,
    'Content-Type': 'application/json',
};

// Simple in-memory cache with TTL
const cache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes in milliseconds

/**
 * Get data from cache if available and not expired
 */
const getFromCache = (key) => {
    const cached = cache.get(key);
    if (!cached) return null;

    const now = Date.now();
    if (now - cached.timestamp > CACHE_TTL) {
        cache.delete(key);
        return null;
    }

    return cached.data;
};

/**
 * Store data in cache with current timestamp
 */
const setCache = (key, data) => {
    cache.set(key, {
        data,
        timestamp: Date.now()
    });

};

/**
 * Clear all cached data (useful for manual refresh)
 */
export const clearCache = () => {
    cache.clear();

};

/**
 * Fetch all projects for a specific collection
 */
export const fetchProjectsByCollection = async (collectionName) => {
    // 1. Prepare static projects if any
    let staticProjects = [];
    // Check for both 'Coastal' (Airtable value) and 'coastal' (ID value)
    if (collectionName === 'Coastal' || collectionName === 'coastal') {
        staticProjects.push({
            id: oneParkLaneProject.id,
            title: oneParkLaneProject.name,
            location: oneParkLaneProject.location,
            price: oneParkLaneProject.price,
            image: oneParkLaneProject.heroImage,
            tag: oneParkLaneProject.tag,
            features: [
                oneParkLaneProject.stats.beds + ' Bed',
                oneParkLaneProject.stats.baths + ' Bath',
                oneParkLaneProject.stats.size
            ],
            collection: 'Coastal', // Normalize to Coastal for display
            slug: oneParkLaneProject.slug,
        });
    }

    // Return static projects immediately if no API configuration
    if (!BASE_ID || BASE_ID === 'your_base_id_here' || !PAT) {
        return staticProjects;
    }

    // Check cache first
    const cacheKey = `projects_${collectionName}`;
    const cached = getFromCache(cacheKey);
    if (cached) {
        // We assume the cached version already includes the static projects if the cache logic is consistent
        // However, to be safe, we could check if the static project is there. 
        // For simplicity, let's just use the cached data which should be correct after the first fetch.
        return cached;
    }

    try {
        const filter = encodeURIComponent(`{Collection} = '${collectionName}'`);
        const url = `${BASE_URL}/${BASE_ID}/${TABLES.PROJECTS}?filterByFormula=${filter}`;

        const response = await fetch(url, { headers });

        if (!response.ok) {
            const errorBody = await response.json();
            console.error('Airtable Error Response:', errorBody);
            // Fallback to static projects on error, but log it
            if (staticProjects.length > 0) return staticProjects;
            throw new Error(`Airtable Error: ${errorBody.error?.message || response.statusText}`);
        }

        const data = await response.json();
        const airtableProjects = data.records.map(record => {
            const f = record.fields;
            // Combine bedrooms, bathrooms, and size into a list of "features" for the card preview
            const features = [
                f['Bedrooms'],
                f['Bathrooms'],
                f['Unit Sizes']
            ].filter(Boolean);

            return {
                id: record.id,
                title: f['Name'],
                location: f['Location'] || '',
                price: f['Price Display'] || 'POA',
                image: f['Hero Image']?.[0]?.url || '',
                tag: f['Status Tag'] || '',
                features: features.length > 0 ? features : [],
                collection: f['Collection'],
                slug: f['Slug'] || '',
            };
        });

        // Combine static and dynamic projects
        // Place static projects FIRST as requested ("most important project")
        const allProjects = [...staticProjects, ...airtableProjects];

        // Store in cache
        setCache(cacheKey, allProjects);
        return allProjects;
    } catch (error) {
        console.error('Airtable Fetch Error:', error);
        // Fallback to static projects if available
        if (staticProjects.length > 0) return staticProjects;
        throw error;
    }
};

/**
 * Fetch a single project with all its linked data
 */
export const fetchProjectDetail = async (projectIdOrSlug) => {
    // 1. Check for Static Project first
    if (projectIdOrSlug === oneParkLaneProject.id || projectIdOrSlug === oneParkLaneProject.slug) {
        return oneParkLaneProject;
    }

    if (!BASE_ID) throw new Error('Airtable Base ID not configured');

    // Check cache first
    const cacheKey = `project_detail_${projectIdOrSlug}`;
    const cached = getFromCache(cacheKey);
    if (cached) return cached;

    try {
        let projectId = projectIdOrSlug;
        let projectRecord;

        // 1. Resolve Slug to ID if necessary
        // Airtable IDs start with 'rec' and are alphanumeric. Slugs are human-readable.
        if (!projectIdOrSlug.startsWith('rec')) {

            const slugFilter = encodeURIComponent(`{Slug} = '${projectIdOrSlug}'`);
            const slugResponse = await fetch(`${BASE_URL}/${BASE_ID}/${TABLES.PROJECTS}?filterByFormula=${slugFilter}`, { headers });

            if (!slugResponse.ok) throw new Error('Failed to resolve project slug');

            const slugData = await slugResponse.json();
            if (slugData.records.length === 0) throw new Error('Project not found');

            projectRecord = slugData.records[0];
            projectId = projectRecord.id;
        } else {
            // 1b. Fetch the main project record directly by ID
            const projectResponse = await fetch(`${BASE_URL}/${BASE_ID}/${TABLES.PROJECTS}/${projectId}`, {
                headers,
            });
            if (!projectResponse.ok) throw new Error('Failed to fetch project detail');
            projectRecord = await projectResponse.json();
        }

        const p = projectRecord.fields;
        const projectName = p['Name'];

        // Helper to build a robust SEARCH filter for linked records
        const buildRobustFilter = (id, name) =>
            encodeURIComponent(`OR(SEARCH("${id}", {Project} & ""), SEARCH("${name}", {Project} & ""))`);

        // 2. Fetch linked units
        const unitsFilter = buildRobustFilter(projectId, projectName);
        const unitsResponse = await fetch(`${BASE_URL}/${BASE_ID}/${TABLES.UNITS}?filterByFormula=${unitsFilter}`, { headers });
        const unitsData = unitsResponse.ok ? await unitsResponse.json() : { records: [] };

        if (unitsData.records.length > 0) {

        }

        // 3. Fetch linked hotspots
        const hotspotsFilter = buildRobustFilter(projectId, projectName);
        const hotspotsResponse = await fetch(`${BASE_URL}/${BASE_ID}/${TABLES.HOTSPOTS}?filterByFormula=${hotspotsFilter}`, { headers });
        const hotspotsData = hotspotsResponse.ok ? await hotspotsResponse.json() : { records: [] };

        // 4. Fetch linked gallery images
        const galleryFilter = buildRobustFilter(projectId, projectName);
        const galleryUrl = `${BASE_URL}/${BASE_ID}/${TABLES.GALLERY}?filterByFormula=${galleryFilter}&sort%5B0%5D%5Bfield%5D=Display+Order`;
        const galleryResponse = await fetch(galleryUrl, { headers });
        const galleryData = galleryResponse.ok ? await galleryResponse.json() : { records: [] };


        // 5. Fetch linked resources
        const resourcesFilter = buildRobustFilter(projectId, projectName);
        const resourcesUrl = `${BASE_URL}/${BASE_ID}/${TABLES.RESOURCES}?filterByFormula=${resourcesFilter}`;
        const resourcesResponse = await fetch(resourcesUrl, { headers });
        const resourcesData = resourcesResponse.ok ? await resourcesResponse.json() : { records: [] };

        const projectDetail = {
            id: projectRecord.id,
            name: p['Name'],
            description: p['Overview Blurb'],
            statusTag: p['Status'],
            heroImage: p['Hero Image']?.[0]?.url,
            stats: {
                beds: p['Bedrooms'],
                baths: p['Bathrooms'],
                size: p['Unit Sizes'],
                ipdc: p['IPDC']
            },
            developer: {
                name: p['Dev Name'],
                description: p['Dev Bio'],
                image: p['Dev Image']?.[0]?.url
            },
            map: {
                lat: p['Latitude'],
                lng: p['Longitude']
            },
            units: unitsData.records.map(u => ({
                id: u.id,
                config: u.fields['Unit Configuration'],
                price: u.fields['Price'],
                area: u.fields['Area'],
                status: u.fields['Status'],
                floorPlan: u.fields['Floor Plan']?.[0]?.url || u.fields['Floorplan']?.[0]?.url || u.fields['Attachments']?.[0]?.url,
                image: u.fields['Unit Type Image']?.[0]?.url || u.fields['Unit Image']?.[0]?.url || u.fields['Image']?.[0]?.url || u.fields['Render']?.[0]?.url || u.fields['Photo']?.[0]?.url,
                description: u.fields['Description'],
                totalUnits: u.fields['Units Total'],
                soldUnits: u.fields['Units Sold'],
                minPrice: u.fields['Min Price'],
                percentage: u.fields['Percentage'] || u.fields['Share'] || u.fields['Fraction'] || u.fields['Ownership Display']
            })),
            hotspots: hotspotsData.records.map(h => ({
                id: h.id,
                name: h.fields['Place Name'],
                category: h.fields['Category'],
                distance: h.fields['Distance'],
                time: h.fields['Time']
            })),
            gallery: galleryData.records.map(g => ({
                id: g.id,
                url: g.fields['Image']?.[0]?.url || g.fields['Attachments']?.[0]?.url,
                caption: g.fields['Caption']
            })),
            resources: resourcesData.records.map(r => {
                const f = r.fields;
                // Check URL field first, then fall back to Attachments
                const link = f['URL'] || f['Link/File'] || f['Attachments']?.[0]?.url;
                // Check for image source: Image field -> Attachments thumbnail -> Attachments URL
                const image = f['Image']?.[0]?.url ||
                    f['Attachments']?.[0]?.thumbnails?.large?.url ||
                    (f['Attachments']?.[0]?.type?.startsWith('image') ? f['Attachments']?.[0]?.url : null);

                return {
                    id: r.id,
                    label: f['Label'],
                    type: f['Type'],
                    link: link,
                    image: image
                };
            })
        };

        // Store in cache
        setCache(cacheKey, projectDetail);
        return projectDetail;
    } catch (error) {
        console.error('Airtable Detail Fetch Error:', error);
        throw error;
    }
};
