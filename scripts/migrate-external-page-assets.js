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

const externalPageAssets = [
  { id: 'about-1', url: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&h=600&auto=format&fit=crop&q=80' },
  { id: 'about-2', url: 'https://images.pexels.com/photos/4618495/pexels-photo-4618495.jpeg?_gl=1*uqo9nj*_ga*MTEwMDQxNjI0OS4xNzY5MDQxNzMx*_ga_8JE65Q40S6*czE3NzAwOTc0MTEkbzMkZzEkdDE3NzAwOTc1OTYkajIxJGwwJGgw' },
  { id: 'about-3', url: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=600&auto=format&fit=crop&q=80' },
  { id: 'about-hero', url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1920&h=1080&auto=format&fit=crop&q=75' },
  { id: 'services-3', url: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&h=600&auto=format&fit=crop&q=80' },
  { id: 'services-hero-bg', url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1920&h=1080&auto=format&fit=crop&q=75' },
  { id: 'luc-reviews-bg', url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1600&auto=format&fit=crop&q=80' },
  { id: 'luc-fly-padel', url: 'https://thelucnews.com/wp-content/uploads/2026/04/Bachelor-Padel-celebration-for-Ben-Ana-%F0%9F%8E%BE%E2%9C%A8Fun-rallies-great-laughs-and-unforgettable-moments.jpg' },
  { id: 'luc-fly-atlas', url: 'https://atlasbeachfest.com/images/about/highlight.jpg' },
  { id: 'luc-fly-hero', url: 'https://images.unsplash.com/photo-1544124499-58912cbddaad?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80' },
  { id: 'fly-voucher', url: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80' }
];

async function uploadImageFromUrl(imageUrl) {
  if (!imageUrl) return null;
  console.log(`Uploading image: ${imageUrl}`);
  try {
    const response = await fetch(imageUrl);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const buffer = await response.arrayBuffer();
    const asset = await client.assets.upload('image', Buffer.from(buffer), {
      filename: `external-asset-${Math.floor(Math.random()*10000)}.jpg`
    });
    return {
      _type: 'image',
      asset: {
        _type: "reference",
        _ref: asset._id
      }
    };
  } catch (error) {
    console.error(`Failed to upload image ${imageUrl}:`, error.message);
    return null;
  }
}

async function run() {
  console.log('Migrating external page assets to Sanity...');
  for (const asset of externalPageAssets) {
    console.log(`Processing ${asset.id}...`);
    
    // Check if it already exists
    const existing = await client.fetch(`*[_type == "pageAsset" && identifier == $id][0]`, { id: asset.id });
    if (existing) {
      console.log(`Asset ${asset.id} already exists, skipping.`);
      continue;
    }

    const imageAsset = await uploadImageFromUrl(asset.url);
    if (imageAsset) {
      await client.create({
        _type: 'pageAsset',
        identifier: asset.id,
        image: imageAsset
      });
      console.log(`Successfully created pageAsset: ${asset.id}`);
    }
  }
  console.log('External page asset migration complete!');
}

run().catch(console.error);
