import { createClient } from '@sanity/client';
import fetch from 'node-fetch';
import axios from 'axios';
import { propertyCollections } from '../src/data/properties.js';

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

async function uploadImageFromUrl(imageUrl) {
  if (!imageUrl) return null;
  console.log(`Uploading image: ${imageUrl}`);
  try {
    const response = await fetch(imageUrl);
    const buffer = await response.buffer();
    const asset = await client.assets.upload('image', buffer, {
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

async function migrateProperties() {
  console.log('Migrating property collections...');
  for (const collection of Object.values(propertyCollections)) {
    const propertiesRefs = [];
    
    // Upload properties
    for (const prop of collection.properties) {
      console.log(`Migrating property: ${prop.title}`);
      const imageAsset = await uploadImageFromUrl(prop.image);
      const sanityProp = await client.create({
        _type: 'property',
        title: prop.title,
        propertyId: prop.id,
        location: prop.location,
        price: prop.price,
        tag: prop.tag,
        features: prop.features,
        image: imageAsset
      });
      propertiesRefs.push({
        _key: sanityProp._id,
        _type: 'reference',
        _ref: sanityProp._id
      });
    }

    console.log(`Migrating collection: ${collection.title}`);
    const logoLight = await uploadImageFromUrl(collection.logoLight);
    const logoDark = await uploadImageFromUrl(collection.logoDark);
    const bgImage = await uploadImageFromUrl(collection.image);

    await client.create({
      _type: 'propertyCollection',
      title: collection.title,
      collectionId: collection.id,
      location: collection.location,
      description: collection.description,
      logoLight,
      logoDark,
      image: bgImage,
      properties: propertiesRefs
    });
  }
}

async function migrateBlogPosts() {
  console.log('Migrating blog posts...');
  try {
    const WP_USER = 'apfgqld@gmail.com';
    const WP_APP_PASS = 'MAEv 6GEI WLIZ OKLc V5Fd rUT8';
    const token = Buffer.from(`${WP_USER}:${WP_APP_PASS}`).toString('base64');
    
    const response = await axios.get('https://cms.arcadea.com.au/wp-json/wp/v2/posts?_embed=true&per_page=100', {
      headers: {
        'Authorization': `Basic ${token}`
      }
    });
    const posts = response.data;
    
    for (const post of posts) {
      console.log(`Migrating post: ${post.title.rendered}`);
      const featuredImageUrl = post._embedded?.['wp:featuredmedia']?.[0]?.source_url;
      const imageAsset = featuredImageUrl ? await uploadImageFromUrl(featuredImageUrl) : null;
      
      const authorName = post._embedded?.author?.[0]?.name || 'Arcadea';
      
      // Simple block creation for content
      const contentBlocks = [{
        _type: 'block',
        _key: 'block1',
        children: [{
          _type: 'span',
          _key: 'span1',
          text: post.content.rendered.replace(/<[^>]+>/g, ' ')
        }]
      }];

      await client.create({
        _type: 'post',
        title: post.title.rendered,
        slug: { _type: 'slug', current: post.slug },
        excerpt: post.excerpt.rendered.replace(/<[^>]+>/g, ' '),
        content: contentBlocks,
        publishedAt: post.date,
        featuredImage: imageAsset
      });
    }
  } catch (error) {
    console.error('Error fetching from WordPress:', error.message);
  }
}

async function run() {
  // await migrateProperties(); // Already completed
  await migrateBlogPosts();
  console.log('Migration complete!');
}

run().catch(console.error);
