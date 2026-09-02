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
 * Fetch all blog posts with pagination, optionally scoped to a category slug
 */
export const fetchBlogPosts = async (page = 1, perPage = 9, categorySlug = null) => {
  const start = (page - 1) * perPage;
  const end = start + perPage;
  const filter = categorySlug
    ? `_type == "post" && $categorySlug in categories[]->slug.current`
    : `_type == "post"`;

  try {
    const query = `
      {
        "posts": *[${filter}] | order(publishedAt desc) [$start...$end] {
          _id,
          "id": _id,
          "slug": slug.current,
          title,
          excerpt,
          content,
          "date": publishedAt,
          "author": author->name,
          "featuredImage": featuredImage.asset->url,
          "featuredImageAlt": featuredImage.alt,
          "categories": categories[]->{name, "slug": slug.current}
        },
        "total": count(*[${filter}])
      }
    `;

    const result = await client.fetch(query, { start, end, categorySlug });
    
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
        excerpt,
        content,
        "date": publishedAt,
        "author": author->name,
        "authorAvatar": author->image.asset->url,
        "featuredImage": featuredImage.asset->url,
        "featuredImageAlt": featuredImage.alt,
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
 * Fetch posts related to the given one — prioritises posts sharing a
 * category, falling back to the most recent other posts to fill the list.
 */
export const fetchRelatedPosts = async (currentSlug, categorySlugs = [], limit = 3) => {
  try {
    const query = `
      *[_type == "post" && slug.current != $currentSlug && defined(slug.current)] {
        _id,
        "id": _id,
        "slug": slug.current,
        title,
        excerpt,
        "date": publishedAt,
        "author": author->name,
        "featuredImage": featuredImage.asset->url,
        "featuredImageAlt": featuredImage.alt,
        "sharesCategory": count((categories[]->slug.current)[@ in $categorySlugs]) > 0
      } | order(sharesCategory desc, publishedAt desc) [0...$limit]
    `;

    const result = await client.fetch(query, { currentSlug, categorySlugs, limit });

    return result.map(post => ({
      ...post,
      featuredImage: post.featuredImage || DEFAULT_FEATURED_IMAGE,
    }));
  } catch (error) {
    console.error('Error fetching related posts from Sanity:', error);
    return [];
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
          price {
            enquiryOnly,
            prefix,
            amount
          },
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
        price {
          enquiryOnly,
          prefix,
          amount
        },
        status,
        ctaLabel,
        ctaLink,
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