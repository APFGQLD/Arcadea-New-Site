import { createClient } from '@sanity/client';
import fetch from 'node-fetch';
import axios from 'axios';

const token = process.env.VITE_SANITY_WRITE_TOKEN;
if (!token) {
  console.error("Please set VITE_SANITY_WRITE_TOKEN");
  process.exit(1);
}

const client = createClient({
  projectId: 'b6pkfjxp',
  dataset: 'production',
  useCdn: false,
  token,
  apiVersion: '2024-01-01'
});

const PAT = process.env.VITE_AIRTABLE_PAT;
const BASE_ID = process.env.VITE_AIRTABLE_BASE_ID;
const BASE_URL = 'https://api.airtable.com/v0';
const TABLES = {
  PROJECTS: process.env.VITE_AIRTABLE_TABLE_PROJECTS || 'tblKz1Fe46iHrYnz5',
  UNITS: process.env.VITE_AIRTABLE_TABLE_UNITS || 'tbl7yTEyfnOPeJ9uv',
  HOTSPOTS: 'tblcTTNvfRkwPZqjg',
  GALLERY: 'tblJx9nmpXuFiEMd7',
  RESOURCES: 'tblAzUDH46eh9ZPwy',
  QUICK_FACTS: 'Quick Facts'
};

const getHeaders = () => ({
  'Authorization': `Bearer ${PAT}`,
  'Content-Type': 'application/json',
});

async function fetchAllRecords(table) {
  let allRecords = [];
  let offset = null;
  try {
    do {
      let url = `${BASE_URL}/${BASE_ID}/${encodeURIComponent(table)}?pageSize=100`;
      if (offset) url += `&offset=${offset}`;
      
      const response = await fetch(url, { headers: getHeaders() });
      if (!response.ok) throw new Error(`Airtable Error: ${response.statusText}`);
      
      const data = await response.json();
      allRecords = [...allRecords, ...data.records];
      offset = data.offset;
    } while (offset);
  } catch (error) {
    console.error(`Error fetching ${table}:`, error);
  }
  return allRecords;
}

const getField = (fields, ...keys) => {
  for (const key of keys) {
      if (fields[key] !== undefined && fields[key] !== null) return fields[key];
  }
  return undefined;
};

const getImageUrl = (fields, ...keys) => {
  const field = getField(fields, ...keys);
  if (Array.isArray(field) && field.length > 0) return field[0].url;
  return undefined;
};

async function uploadImageFromUrl(imageUrl) {
  if (!imageUrl) return null;
  console.log(`Uploading image: ${imageUrl}`);
  try {
    const response = await fetch(imageUrl);
    const buffer = await response.arrayBuffer();
    const asset = await client.assets.upload('image', Buffer.from(buffer), {
      filename: imageUrl.split('/').pop() || 'image.jpg'
    });
    return {
      _type: 'image',
      asset: { _type: "reference", _ref: asset._id }
    };
  } catch (error) {
    console.error(`Failed to upload image ${imageUrl}:`, error.message);
    return null;
  }
}

async function run() {
  console.log('Fetching all Airtable data...');
  const [projects, units, gallery, hotspots, resources, quickFacts] = await Promise.all([
    fetchAllRecords(TABLES.PROJECTS),
    fetchAllRecords(TABLES.UNITS),
    fetchAllRecords(TABLES.GALLERY),
    fetchAllRecords(TABLES.HOTSPOTS),
    fetchAllRecords(TABLES.RESOURCES),
    fetchAllRecords(TABLES.QUICK_FACTS)
  ]);

  console.log(`Found ${projects.length} projects.`);

  for (const p of projects) {
    const f = p.fields;
    console.log(`Migrating project: ${f.Name || f.Title}`);

    const projectUnits = units.filter(u => {
      const linked = getField(u.fields, 'Project', 'Projects', 'Linked Project', 'Project Link');
      return Array.isArray(linked) && linked.includes(p.id);
    });

    const projectGallery = gallery.filter(g => {
      const linked = getField(g.fields, 'Project', 'Projects', 'Linked Project', 'Project Link');
      return Array.isArray(linked) && linked.includes(p.id);
    });

    const projectHotspots = hotspots.filter(h => {
      const linked = getField(h.fields, 'Project', 'Projects', 'Linked Project', 'Project Link');
      return Array.isArray(linked) && linked.includes(p.id);
    });

    // Upload hero image
    const heroImageUrl = getImageUrl(f, 'Hero Image', 'Image', 'Cover Image');
    const sanityHeroImage = await uploadImageFromUrl(heroImageUrl);

    // Map units
    const mappedUnits = [];
    for (const u of projectUnits) {
      const uf = u.fields;
      const unitImage = await uploadImageFromUrl(getImageUrl(uf, 'Unit Type Image', 'Image', 'Unit Image', 'Photo'));
      const unitFloorPlan = await uploadImageFromUrl(getImageUrl(uf, 'Floor Plan', 'Plan'));
      
      mappedUnits.push({
        _key: u.id,
        config: getField(uf, 'Unit Configuration', 'Name', 'Config', 'Unit Type') || 'Unit',
        totalUnits: getField(uf, 'Units Total', 'Total Units', 'Count', 'Number of Units') || 0,
        soldUnits: getField(uf, 'Units Sold', 'Sold Units', 'Sold') || 0,
        price: getField(uf, 'Price', 'Sale Price', 'Price Display'),
        minPrice: getField(uf, 'Min Price', 'Minimum Price'),
        description: getField(uf, 'Description', 'Notes'),
        image: unitImage,
        floorPlan: unitFloorPlan,
        percentage: getField(uf, 'Percentage', 'Share Percentage', 'Share') || 0,
        salesLink: getField(uf, 'Sales Link', 'Reserve Link', 'External Link')
      });
    }

    // Map gallery
    const mappedGallery = [];
    for (const g of projectGallery) {
      const gf = g.fields;
      const gImage = await uploadImageFromUrl(getImageUrl(gf, 'Image', 'Photo', 'File', 'Gallery Image'));
      if (gImage) {
        mappedGallery.push({
          _key: g.id,
          image: gImage,
          caption: getField(gf, 'Name', 'Caption', 'Description') || ''
        });
      }
    }

    // Map hotspots
    const mappedHotspots = projectHotspots.map(h => ({
      _key: h.id,
      name: getField(h.fields, 'Name', 'Place', 'Hotspot Name'),
      distance: getField(h.fields, 'Distance', 'Dist'),
      time: getField(h.fields, 'Time', 'Duration'),
      category: getField(h.fields, 'Type', 'Category')
    }));

    // Create Sanity property document
    await client.create({
      _type: 'property',
      title: getField(f, 'Name', 'Title', 'Project Name'),
      propertyId: p.id,
      location: getField(f, 'Location', 'Address') || '',
      price: getField(f, 'Price Display', 'Price', 'Price Range') || 'POA',
      image: sanityHeroImage,
      tag: getField(f, 'Status Tag', 'Status', 'Tag') || '',
      description: getField(f, 'Overview Blurb', 'Description', 'Overview'),
      features: [
        getField(f, 'Bedrooms', 'Beds') ? `${getField(f, 'Bedrooms', 'Beds')} Bed` : '',
        getField(f, 'Bathrooms', 'Baths') ? `${getField(f, 'Bathrooms', 'Baths')} Bath` : '',
        getField(f, 'Unit Sizes', 'Size')
      ].filter(Boolean),
      units: mappedUnits.length > 0 ? mappedUnits : undefined,
      gallery: mappedGallery.length > 0 ? mappedGallery : undefined,
      hotspots: mappedHotspots.length > 0 ? mappedHotspots : undefined
    });
    console.log(`Created Sanity document for ${p.id}`);
  }
  
  console.log('Airtable migration complete!');
}

run().catch(console.error);
