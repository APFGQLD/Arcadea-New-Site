import { oneParkLaneProject } from '../data/oneParkLaneData';

const BASE_URL = 'https://api.airtable.com/v0';
const PAT = import.meta.env.VITE_AIRTABLE_PAT;
const BASE_ID = import.meta.env.VITE_AIRTABLE_BASE_ID;
const TABLES = {
    PROJECTS: import.meta.env.VITE_AIRTABLE_TABLE_PROJECTS || 'tblKz1Fe46iHrYnz5',
    UNITS: import.meta.env.VITE_AIRTABLE_TABLE_UNITS || 'tbl7yTEyfnOPeJ9uv',
    HOTSPOTS: 'tblcTTNvfRkwPZqjg',
    GALLERY: 'tblJx9nmpXuFiEMd7',
    RESOURCES: 'tblAzUDH46eh9ZPwy',
    QUICK_FACTS: 'Quick Facts', // Using table name is more reliable for users
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

// Helper to fetch linked records from any table
async function fetchLinkedRecords(table, projectId) {
    try {
        const records = await fetchAllRecords(table);
        return records.filter(r => {
            const linked = getField(r.fields, 'Project', 'Projects', 'Linked Project', 'Project Link');
            // Check if linked field contains the Project ID (it's an array of IDs)
            return Array.isArray(linked) && linked.includes(projectId);
        });
    } catch (err) {
        console.error(`Error fetching linked table ${table}:`, err);
        return [];
    }
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
            features: oneParkLaneProject.quickFacts.map(f => f.value),
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
        const filteredRecords = airtableRecords.filter(p => {
            const col = getField(p.fields, 'Collection', 'Category');
            return col && col.toLowerCase() === collectionName.toLowerCase();
        });
        const mappedProjects = mapAirtableToApp(filteredRecords);

        return [...staticProjects, ...mappedProjects];

    } catch (error) {
        console.error('Fetch Error:', error);
        // Fallback to static projects if available
        if (staticProjects.length > 0) return staticProjects;
        throw error;
    }
};

// Helper to safely get field values from multiple potential key names
const getField = (fields, ...keys) => {
    for (const key of keys) {
        if (fields[key] !== undefined && fields[key] !== null) return fields[key];
    }
    return undefined;
};

// Helper to safely get image URL
const getImageUrl = (fields, ...keys) => {
    const field = getField(fields, ...keys);
    if (Array.isArray(field) && field.length > 0) return field[0].url;
    return undefined;
};

// Helper to safely get optimized image URL (prefer large thumbnail)
const getOptimizedImageUrl = (fields, ...keys) => {
    const field = getField(fields, ...keys);
    if (Array.isArray(field) && field.length > 0) {
        // Try large, then small, then just the URL if it's an image
        if (field[0].thumbnails?.large?.url) return field[0].thumbnails.large.url;
        if (field[0].thumbnails?.small?.url) return field[0].thumbnails.small.url;
        return field[0].url;
    }
    return undefined;
};

// Helper to get thumbnail from an attachment field (e.g. PDF cover)
const getAttachmentThumbnail = (fields, ...keys) => {
    const field = getField(fields, ...keys);
    if (Array.isArray(field) && field.length > 0) {
        // Try large, then small, then just the URL if it's an image
        if (field[0].thumbnails?.large?.url) return field[0].thumbnails.large.url;
        if (field[0].thumbnails?.small?.url) return field[0].thumbnails.small.url;
        // If it's an image file itself, use the main url
        if (field[0].type?.startsWith('image/')) return field[0].url;
    }
    return undefined;
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
            // Fetch specific record if not in cache
            const formula = `OR(RECORD_ID()='${projectIdOrSlug}', {Slug}='${projectIdOrSlug}')`;
            const records = await fetchAllRecords(TABLES.PROJECTS, formula);
            projectRecord = records[0];
        }

        if (!projectRecord) throw new Error('Project not found');

        console.log('Debug: Project Record Found:', projectRecord.fields);

        // Fetch ALL linked data in parallel
        // Use a safe catch for QUICK_FACTS to avoid breakage if the table id is invalid/missing
        const [units, hotspots, gallery, resources, quickFacts] = await Promise.all([
            fetchLinkedRecords(TABLES.UNITS, projectRecord.id),
            fetchLinkedRecords(TABLES.HOTSPOTS, projectRecord.id),
            fetchLinkedRecords(TABLES.GALLERY, projectRecord.id),
            fetchLinkedRecords(TABLES.RESOURCES, projectRecord.id),
            fetchLinkedRecords(TABLES.QUICK_FACTS, projectRecord.id).catch(() => [])
        ]);

        console.log(`Debug: Fetched ${units.length} units, ${gallery.length} gallery items, ${resources.length} resources`);

        // Debug Resources to check field names if still failing
        if (resources.length > 0) {
            console.log('Debug: Sample Resource Fields:', Object.keys(resources[0].fields));
        }

        return mapAirtableRecordToDetail(projectRecord, units, hotspots, gallery, resources, quickFacts);

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
            title: getField(f, 'Name', 'Title', 'Project Name'),
            location: getField(f, 'Location', 'Address') || '',
            price: getField(f, 'Price Display', 'Price', 'Price Range') || 'POA',
            image: getOptimizedImageUrl(f, 'Hero Image', 'Image', 'Cover Image') || '',
            tag: getField(f, 'Status Tag', 'Status', 'Tag') || '',
            collection: getField(f, 'Collection', 'Category'),
            slug: getField(f, 'Slug', 'slug') || '',
            features: [
                getField(f, 'Bedrooms', 'Beds') ? `${getField(f, 'Bedrooms', 'Beds')} Bed` : '',
                getField(f, 'Bathrooms', 'Baths') ? `${getField(f, 'Bathrooms', 'Baths')} Bath` : '',
                getField(f, 'Unit Sizes', 'Size')
            ].filter(Boolean)
        };
    });
}



// Helper to map Airtable Record to Full Detail View
function mapAirtableRecordToDetail(record, units = [], hotspots = [], gallery = [], resources = [], quickFacts = []) {
    const f = record.fields;

    // Debug helper for images
    if (!getImageUrl(f, 'Hero Image', 'Image')) console.warn('Missing Hero Image for', f['Name']);

    const mappedUnits = units.map(u => {
        const uf = u.fields;
        return {
            id: u.id,
            config: getField(uf, 'Unit Configuration', 'Name', 'Config', 'Unit Type') || 'Unit',
            totalUnits: getField(uf, 'Units Total', 'Total Units', 'Count', 'Number of Units') || 0,
            soldUnits: getField(uf, 'Units Sold', 'Sold Units', 'Sold') || 0,
            price: getField(uf, 'Price', 'Sale Price', 'Price Display'),
            minPrice: getField(uf, 'Min Price', 'Minimum Price'),
            description: getField(uf, 'Description', 'Notes'),
            image: getOptimizedImageUrl(uf, 'Unit Type Image', 'Image', 'Unit Image', 'Photo'),
            floorPlan: getImageUrl(uf, 'Floor Plan', 'Plan'),
            percentage: getField(uf, 'Percentage', 'Share Percentage', 'Share') || 0,
            salesLink: getField(uf, 'Sales Link', 'Reserve Link', 'External Link')
        };
    });

    const mappedGallery = gallery.map(g => ({
        id: g.id,
        url: getImageUrl(g.fields, 'Image', 'Photo', 'File', 'Gallery Image'),
        thumbnail: getOptimizedImageUrl(g.fields, 'Image', 'Photo', 'File', 'Gallery Image'),
        caption: getField(g.fields, 'Name', 'Caption', 'Description') || ''
    })).filter(g => g.url);

    // If gallery table empty, fallback to hero (or empty)
    if (mappedGallery.length === 0 && getImageUrl(f, 'Hero Image')) {
        mappedGallery.push({
            url: getImageUrl(f, 'Hero Image'),
            thumbnail: getOptimizedImageUrl(f, 'Hero Image'),
            caption: 'Main View'
        });
    }

    const mappedResources = resources.map(r => {
        const type = getField(r.fields, 'Type', 'Category', 'Resource Type') || '';
        const isWebsite = type.toLowerCase().includes('website') || type.toLowerCase().includes('link') || type.toLowerCase().includes('url');

        // Determine link source based on Type
        let linkUrl;
        if (isWebsite) {
            linkUrl = getField(r.fields, 'URL', 'Url', 'Link', 'External Link');
        } else {
            // Assume file attachment
            linkUrl = getImageUrl(r.fields, 'Attachments', 'attachments', 'File', 'Document');
        }

        // Fallback if specific type lookup failed
        if (!linkUrl) {
            linkUrl = getImageUrl(r.fields, 'Attachments', 'attachments', 'File', 'Document') || getField(r.fields, 'URL', 'Url', 'Link');
        }

        // Thumbnail logic: Try explicit image, then attachment thumbnail
        let thumbUrl = getOptimizedImageUrl(r.fields, 'Image', 'Thumbnail', 'Cover');
        if (!thumbUrl) {
            thumbUrl = getAttachmentThumbnail(r.fields, 'Attachments', 'attachments', 'File', 'Document');
        }

        return {
            id: r.id,
            label: getField(r.fields, 'Name', 'Label', 'Title', 'Resource Name'),
            type: type,
            link: linkUrl,
            image: thumbUrl
        };
    });

    const mappedHotspots = hotspots.map(h => ({
        id: h.id,
        name: getField(h.fields, 'Name', 'Place', 'Hotspot Name'),
        distance: getField(h.fields, 'Distance', 'Dist'),
        time: getField(h.fields, 'Time', 'Duration'),
        category: getField(h.fields, 'Type', 'Category')
    }));
    
    const mappedQuickFacts = quickFacts.map(q => ({
        id: q.id,
        icon: getField(q.fields, 'Icon', 'icon', 'Icon Name', 'Fact Icon') || 'ChartBarIcon',
        label: getField(q.fields, 'Label', 'Title', 'label', 'Fact Label', 'Name'),
        value: getField(q.fields, 'Value', 'Text', 'value', 'Fact Value'),
        order: getField(q.fields, 'Order', 'order', 'Sequence', 'Sort') || 0
    })).sort((a, b) => a.order - b.order);

    return {
        id: record.id,
        name: getField(f, 'Name', 'Title'),
        description: getField(f, 'Overview Blurb', 'Description', 'Overview'),
        statusTag: getField(f, 'Status', 'Status Tag'),
        collection: getField(f, 'Collection', 'Category'),
        heroImage: getImageUrl(f, 'Hero Image', 'Image', 'Cover Image'),
        quickFacts: mappedQuickFacts.length > 0 ? mappedQuickFacts : [
            { id: 'beds', icon: 'MoonIcon', label: 'Bedrooms', value: getField(f, 'Bedrooms', 'Beds') },
            { id: 'baths', icon: 'SparklesIcon', label: 'Bathrooms', value: getField(f, 'Bathrooms', 'Baths') },
            { id: 'size', icon: 'ArrowsPointingOutIcon', label: 'Unit Sizes', value: getField(f, 'Unit Sizes', 'Size', 'Area') },
            getField(f, 'IPDC', 'Yield') ? { id: 'ipdc', icon: 'PresentationChartLineIcon', label: 'IPDC', value: `${getField(f, 'IPDC', 'Yield')}%` } : null
        ].filter(Boolean),
        // Keep stats for backward compatibility with components like ComparisonTable
        stats: {
            beds: getField(f, 'Bedrooms', 'Beds'),
            baths: getField(f, 'Bathrooms', 'Baths'),
            size: getField(f, 'Unit Sizes', 'Size', 'Area'),
            ipdc: getField(f, 'IPDC', 'Yield')
        },
        developer: {
            name: getField(f, 'Dev Name', 'Developer'),
            description: getField(f, 'Dev Bio', 'Developer Bio'),
            image: getImageUrl(f, 'Dev Image', 'Developer Logo')
        },
        map: {
            lat: getField(f, 'Latitude', 'Lat'),
            lng: getField(f, 'Longitude', 'Lng', 'Long')
        },
        units: mappedUnits,
        hotspots: mappedHotspots,
        gallery: mappedGallery,
        resources: mappedResources
    };
}

export const syncProperties = async () => {
    // Client-side "Sync" is just clearing the cache to force a re-fetch
    CACHE.projects = null;
    CACHE.timestamp = 0;
    return { success: true, message: 'Cache cleared' };
};

