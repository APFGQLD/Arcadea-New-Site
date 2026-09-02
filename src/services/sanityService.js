import { createClient } from '@sanity/client';
import { createImageUrlBuilder } from '@sanity/image-url';

// Configure the Sanity client
export const client = createClient({
  projectId: import.meta.env.VITE_SANITY_PROJECT_ID || 'b6pkfjxp',
  dataset: import.meta.env.VITE_SANITY_DATASET || 'production',
  useCdn: false, // Fetch directly from the live API so published edits show up immediately
  apiVersion: '2024-01-01', // Use current date
});

// Configure the image builder
const builder = createImageUrlBuilder(client);

// Helper to generate image URLs
export const urlFor = (source) => {
  return builder.image(source);
};

// Default image fallback
const DEFAULT_FEATURED_IMAGE = 'https://cms.arcadea.com.au/wp-content/uploads/2026/02/V04_FINAL_lowres.jpeg';

/**
 * Fetch all blog posts with pagination
 */
export const fetchBlogPosts = async (page = 1, perPage = 9) => {
  const start = (page - 1) * perPage;
  const end = start + perPage;
  
  try {
    const query = `
      {
        "posts": *[_type == "post"] | order(publishedAt desc) [$start...$end] {
          _id,
          "id": _id,
          "slug": slug.current,
          title,
          excerpt,
          content,
          "date": publishedAt,
          "author": author->name,
          "featuredImage": featuredImage.asset->url,
          "categories": categories[]->{name, "slug": slug.current}
        },
        "total": count(*[_type == "post"])
      }
    `;
    
    const result = await client.fetch(query, { start, end });
    
    return {
      posts: result.posts.map(post => ({
        ...post,
        featuredImage: post.featuredImage || DEFAULT_FEATURED_IMAGE,
      })),
      totalPages: Math.ceil(result.total / perPage) || 1,
      total: result.total || 0
    };
  } catch (error) {
    console.error('Error fetching blog posts from Sanity:', error);
    throw error;
  }
};

/**
 * Fetch single blog post by slug
 */
export const fetchBlogPost = async (slug) => {
  try {
    const query = `
      *[_type == "post" && slug.current == $slug][0] {
        _id,
        "id": _id,
        "slug": slug.current,
        title,
        content,
        "date": publishedAt,
        "author": author->name,
        "authorAvatar": author->image.asset->url,
        "featuredImage": featuredImage.asset->url,
        "categories": categories[]->{name, "slug": slug.current}
      }
    `;
    
    const post = await client.fetch(query, { slug });
    
    if (!post) throw new Error('Post not found');
    
    return {
      ...post,
      featuredImage: post.featuredImage || DEFAULT_FEATURED_IMAGE,
    };
  } catch (error) {
    console.error('Error fetching blog post from Sanity:', error);
    throw error;
  }
};

/**
 * Fetch blog categories
 */
export const fetchCategories = async () => {
  try {
    const query = `*[_type == "category"] | order(name asc) {
      _id,
      "id": _id,
      name,
      "slug": slug.current
    }`;
    
    return await client.fetch(query);
  } catch (error) {
    console.error('Error fetching categories from Sanity:', error);
    return [];
  }
};

/**
 * Fetch all property collections
 */
export const fetchPropertyCollections = async () => {
  try {
    const query = `
      *[_type == "propertyCollection" && !(_id in path("drafts.**"))] | order(title asc) {
        title,
        "id": collectionId,
        "logoLight": logoLight.asset->url,
        "logoDark": logoDark.asset->url,
        location,
        description,
        "image": image.asset->url
      }
    `;
    return await client.fetch(query);
  } catch (error) {
    console.error('Error fetching property collections from Sanity:', error);
    return [];
  }
};

/**
 * Fetch properties by collection ID
 */
export const fetchProperties = async (collectionId) => {
  try {
    const query = `
      *[_type == "propertyCollection" && collectionId == $collectionId && !(_id in path("drafts.**"))][0] {
        title,
        collectionId,
        "logoLight": logoLight.asset->url,
        "logoDark": logoDark.asset->url,
        location,
        description,
        "image": image.asset->url,
        properties[]-> {
          "id": propertyId,
          title,
          location,
          price,
          "image": image.asset->url,
          tag,
          features
        }
      }
    `;
    return await client.fetch(query, { collectionId });
  } catch (error) {
    console.error('Error fetching properties from Sanity:', error);
    return null;
  }
};

export const fetchPageAssets = async (identifiers) => {
    const query = `*[_type == "pageAsset" && identifier in $identifiers] {
        identifier,
        "url": image.asset->url
    }`;
    return client.fetch(query, { identifiers });
};

/**
 * Fetch a single property project detail by ID or Slug
 */
export const fetchProjectDetail = async (idOrSlug) => {
  try {
    const query = `
      *[_type == "property" && (propertyId == $idOrSlug || title match $idOrSlug || _id == $idOrSlug)][0] {
        "id": propertyId,
        "name": title,
        description,
        statusTag,
        "collection": *[_type == "propertyCollection" && references(^._id)][0].collectionId,
        "heroImage": image.asset->url,
        videoUrl,
        stats,
        agents[]-> {
          "id": _id,
          name,
          jobTitle,
          "photo": photo.asset->url,
          phone,
          email,
          bio
        },
        map,
        address,
        quickFacts[] {
          "id": _key,
          icon,
          label,
          value,
          order
        },
        units[] {
          "id": _key,
          config,
          totalUnits,
          soldUnits,
          "price": price,
          minPrice,
          description,
          "image": image.asset->url,
          "floorPlan": floorPlan.asset->url,
          percentage,
          salesLink
        },
        gallery[] {
          "id": _key,
          "url": image.asset->url,
          "thumbSmall": image.asset->url,
          "thumbMedium": image.asset->url,
          caption
        },
        resources[] {
          "id": _key,
          label,
          type,
          link,
          "image": image.asset->url
        }
      }
    `;
    const result = await client.fetch(query, { idOrSlug });
    if (!result) throw new Error('Project not found');
    return result;
  } catch (error) {
    console.error('Error fetching project detail from Sanity:', error);
    throw error;
  }
};