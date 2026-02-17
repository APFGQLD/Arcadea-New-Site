import { oneParkLaneProject } from '../data/oneParkLaneData';

const BASE_URL = 'https://api.airtable.com/v0';
const PAT = import.meta.env.VITE_AIRTABLE_PAT;
const BASE_ID = import.meta.env.VITE_AIRTABLE_BASE_ID;
const TABLES = {
    PROJECTS: import.meta.env.VITE_AIRTABLE_TABLE_PROJECTS || 'Projects',
    UNITS: import.meta.env.VITE_AIRTABLE_TABLE_UNITS || 'Units',
};

// Simple in-memory cache
const CACHE = {
    projects: null,
    timestamp: 0
};
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

const getHeaders = () => ({
    'Authorization': `Bearer ${PAT}`,
    'Content-Type': 'application/json',
});

/**
 * Fetch all records from a table (handling pagination)
 */
async function fetchAllRecords(table, filterFormula = '') {
    if (!PAT || !BASE_ID) {
        console.error('Missing Airtable credentials');
        return [];
    }

    let allRecords = [];
    let offset = null;

    try {
        do {
            let url = `${BASE_URL}/${BASE_ID}/${table}?pageSize=100`;
            if (filterFormula) {
                url += `&filterByFormula=${encodeURIComponent(filterFormula)}`;
            }
            if (offset) {
                url += `&offset=${offset}`;
            }

            const response = await fetch(url, { headers: getHeaders() });
            if (!response.ok) throw new Error(`Airtable Error: ${response.statusText}`);

            const data = await response.json();
            allRecords = [...allRecords, ...data.records];
            offset = data.offset;
        } while (offset);
    } catch (error) {
        console.error(`Error fetching ${table}:`, error);
        throw error;
    }

    return allRecords;
}

/**
 * Fetch all projects for a specific collection
 */
export const fetchProjectsByCollection = async (collectionName) => {
    // 1. Prepare static projects
    let staticProjects = [];
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
            collection: 'Coastal',
            slug: oneParkLaneProject.slug,
        });
    }

    try {
        // Check Cache
        const now = Date.now();
        if (CACHE.projects && (now - CACHE.timestamp < CACHE_DURATION)) {
            const cachedFiltered = CACHE.projects.filter(p => p.fields['Collection'] === collectionName);
            return [...staticProjects, ...mapAirtableToApp(cachedFiltered)];
        }

        // Fetch Fresh Data
        // We fetch ALL projects and cache them to avoid multiple requests
        const airtableRecords = await fetchAllRecords(TABLES.PROJECTS);

        // Update Cache
        CACHE.projects = airtableRecords;
        CACHE.timestamp = now;

        // Filter and Map
        const filteredRecords = airtableRecords.filter(p => p.fields['Collection'] === collectionName);
        const mappedProjects = mapAirtableToApp(filteredRecords);

        return [...staticProjects, ...mappedProjects];

    } catch (error) {
        console.error('Fetch Error:', error);
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

    try {
        // We need the project record first
        // If we have cache, try to find it there
        let projectRecord = CACHE.projects?.find(p => p.id === projectIdOrSlug || p.fields['Slug'] === projectIdOrSlug);

        if (!projectRecord) {
            // Fetch specific record if not in cache (by formula)
            const formula = `OR(RECORD_ID()='${projectIdOrSlug}', {Slug}='${projectIdOrSlug}')`;
            const records = await fetchAllRecords(TABLES.PROJECTS, formula);
            projectRecord = records[0];
        }

        if (!projectRecord) throw new Error('Project not found');

        // Now fetch linked data (Units, etc.) - This requires separate calls
        // For simplicity in this client-side version, we might skip complex relational fetching 
        // OR we implement it if needed. 
        // LET'S IMPLEMENT BASIC MAPPING for the Detail View

        return mapAirtableRecordToDetail(projectRecord);

    } catch (error) {
        console.error('Detail Fetch Error:', error);
        throw error;
    }
};


// Helper to map Airtable Project to App Format (Card View)
function mapAirtableToApp(records) {
    return records.map(record => {
        const f = record.fields;
        return {
            id: record.id,
            title: f['Name'],
            location: f['Location'] || '',
            price: f['Price Display'] || 'POA',
            image: f['Hero Image']?.[0]?.url || '',
            tag: f['Status Tag'] || '',
            collection: f['Collection'],
            slug: f['Slug'] || '',
            features: [
                f['Bedrooms'] ? `${f['Bedrooms']} Bed` : '',
                f['Bathrooms'] ? `${f['Bathrooms']} Bath` : '',
                f['Unit Sizes']
            ].filter(Boolean)
        };
    });
}

// Helper to map Airtable Record to Full Detail View
function mapAirtableRecordToDetail(record) {
    const f = record.fields;
    return {
        id: record.id,
        name: f['Name'],
        description: f['Overview Blurb'], // Using Overview Blurb as description for now
        statusTag: f['Status Tag'],
        collection: f['Collection'],
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
        },
        // Linked data would normally be fetched here. 
        // For a client-side "light" version, we assume basic details are enough 
        // unless we want to make 4 more API calls per project load.
        units: [],
        hotspots: [],
        gallery: (f['Gallery Images'] || []).map(img => ({ url: img.url, caption: '' })),
        resources: []
    };
}

export const syncProperties = async () => {
    // Client-side "Sync" is just clearing the cache to force a re-fetch
    CACHE.projects = null;
    CACHE.timestamp = 0;
    return { success: true, message: 'Cache cleared' };
};

