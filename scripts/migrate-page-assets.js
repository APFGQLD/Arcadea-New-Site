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

const pageAssetsToMigrate = [
  { id: 'fly-bg', url: 'https://cms.arcadea.com.au/wp-content/uploads/2026/02/foundry-fly-869595_1920.jpg' },
  { id: 'fly-exterior', url: 'https://cms.arcadea.com.au/wp-content/uploads/2026/02/EXTERIOR-VIEW-2-scaled.png' },
  { id: 'services-hero', url: 'https://cms.arcadea.com.au/wp-content/uploads/2026/07/caleb-mKwBMtDSZes-unsplash-2-scaled.jpg' },
  { id: 'services-secondary', url: 'https://cms.arcadea.com.au/wp-content/uploads/2026/07/259qM.jpg' },
  { id: 'oneparklane-v03', url: 'https://cms.arcadea.com.au/wp-content/uploads/2026/02/V03_FINAL_lowres.jpeg' },
  { id: 'oneparklane-v04', url: 'https://cms.arcadea.com.au/wp-content/uploads/2026/02/V04_FINAL_lowres.jpeg' },
  { id: 'oneparklane-v07', url: 'https://cms.arcadea.com.au/wp-content/uploads/2026/07/V07_FINAL_lowres.jpeg' },
  { id: 'oneparklane-v11', url: 'https://cms.arcadea.com.au/wp-content/uploads/2026/07/V11_FINAL_lowres.jpeg' },
  { id: 'luc-pool', url: 'https://cms.arcadea.com.au/wp-content/uploads/2026/04/ACC_AC133190918-TB-Berawa_Infinity-Pool_Details-105-scaled.jpg' },
  { id: 'luc-bedroom', url: 'https://cms.arcadea.com.au/wp-content/uploads/2026/04/ACC_AC133190918-TB-Berawa_3BedroomVilla_Bedroom1-009-scaled.jpg' },
];

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
  console.log('Migrating page assets to Sanity...');
  for (const asset of pageAssetsToMigrate) {
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
  console.log('Page asset migration complete!');
}

run().catch(console.error);
