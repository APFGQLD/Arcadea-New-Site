import { createClient } from '@sanity/client';
import fetch from 'node-fetch';

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

async function uploadImage(url, filename) {
  if (!url) return null;
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Failed to fetch image: ${res.statusText}`);
    const buffer = await res.buffer();
    
    console.log(`Uploading ${filename}...`);
    const asset = await client.assets.upload('image', buffer, {
      filename: filename
    });
    return asset._id;
  } catch (error) {
    console.error(`Error uploading ${filename}:`, error);
    return null;
  }
}

async function migrateCollections() {
  console.log('Starting collections migration...');
  
  // First get all existing properties
  const properties = await client.fetch('*[_type == "property"]{_id, title}');
  console.log('Found properties:', properties.map(p => p.title));
  
  const islandProps = properties.filter(p => p.title === 'The Luc Villas' || p.title.includes('Uluwatu') || p.title.includes('Seminyak') || p.title.includes('Canggu') || p.title.includes('Luc'));
  const coastalProps = properties.filter(p => p.title === 'Eve Residences' || p.title.includes('Sydney') || p.title.includes('Gold Coast') || p.title.includes('Byron'));
  
  console.log('Island properties:', islandProps.map(p => p.title));
  console.log('Coastal properties:', coastalProps.map(p => p.title));

  const collections = [
    {
      _type: 'propertyCollection',
      _id: 'collection-island',
      title: 'The Island Collection',
      collectionId: 'island',
      location: 'Bali, Indonesia',
      description: 'Exclusive investment properties and luxury hotels in the heart of paradise.',
      logoLightUrl: 'https://cms.arcadea.com.au/wp-content/uploads/2026/02/island-logo-white.png',
      logoDarkUrl: 'https://cms.arcadea.com.au/wp-content/uploads/2026/02/island-logo-black.png',
      imageUrl: 'https://images.unsplash.com/photo-1573790387438-4da905039392?auto=format&fit=crop&q=80&w=1000',
      refs: islandProps.map(p => ({ _type: 'reference', _key: p._id, _ref: p._id }))
    },
    {
      _type: 'propertyCollection',
      _id: 'collection-coastal',
      title: 'The Coastal Collection',
      collectionId: 'coastal',
      location: 'Australia',
      description: "Premium curated residences in Australia's most sought-after coastal markets.",
      logoLightUrl: 'https://cms.arcadea.com.au/wp-content/uploads/2026/02/coastal-logo-white.png',
      logoDarkUrl: 'https://cms.arcadea.com.au/wp-content/uploads/2026/02/coastal-logo-black.png',
      imageUrl: 'https://cms.arcadea.com.au/wp-content/uploads/2026/07/caleb-mKwBMtDSZes-unsplash-2-scaled.jpg',
      refs: coastalProps.map(p => ({ _type: 'reference', _key: p._id, _ref: p._id }))
    }
  ];

  for (const coll of collections) {
    console.log(`Processing collection: ${coll.title}`);
    
    const imageAssetId = await uploadImage(coll.imageUrl, `${coll.collectionId}-hero.jpg`);
    const logoLightAssetId = await uploadImage(coll.logoLightUrl, `${coll.collectionId}-logo-light.png`);
    const logoDarkAssetId = await uploadImage(coll.logoDarkUrl, `${coll.collectionId}-logo-dark.png`);
    
    const doc = {
      _type: 'propertyCollection',
      _id: coll._id,
      title: coll.title,
      collectionId: coll.collectionId,
      location: coll.location,
      description: coll.description,
      properties: coll.refs
    };
    
    if (imageAssetId) doc.image = { _type: 'image', asset: { _type: 'reference', _ref: imageAssetId } };
    if (logoLightAssetId) doc.logoLight = { _type: 'image', asset: { _type: 'reference', _ref: logoLightAssetId } };
    if (logoDarkAssetId) doc.logoDark = { _type: 'image', asset: { _type: 'reference', _ref: logoDarkAssetId } };
    
    await client.createOrReplace(doc);
    console.log(`Created/updated collection: ${coll.title}`);
    
    // Update the properties themselves to have the collection string
    for (const ref of coll.refs) {
      await client.patch(ref._ref).set({ collection: coll.title }).commit();
    }
  }
  
  console.log('Migration complete!');
}

migrateCollections().catch(console.error);
