import dotenv from 'dotenv';
import { createClient } from '@sanity/client';

dotenv.config();

/**
 * Shared build-time CMS access for prerender.js and generate-sitemap.js.
 *
 * Both build scripts previously kept their own copies of this logic, which is
 * how they both ended up still pointing at Airtable and WordPress long after
 * the site moved to Sanity. Keep this the single source of truth.
 *
 * Defaults mirror src/services/sanityService.js so builds work without a .env.
 */
export const client = createClient({
    projectId: process.env.VITE_SANITY_PROJECT_ID || 'b6pkfjxp',
    dataset: process.env.VITE_SANITY_DATASET || 'production',
    apiVersion: '2024-01-01',
    useCdn: false, // always build against fresh content
});

/**
 * A CMS fetch that fails must fail the build. Returning [] on error silently
 * ships a site with no prerendered project or blog pages while still reporting
 * success — the exact failure mode that hid the WordPress outage.
 */
async function fetchOrFail(label, query) {
    try {
        return await client.fetch(query);
    } catch (error) {
        console.error(`\n❌ Failed to fetch ${label} from Sanity: ${error.message}`);
        console.error('   Aborting so a partial build is never deployed.\n');
        process.exit(1);
    }
}

/**
 * All published projects. `propertyId` is the slug used by /project/:id.
 * Extra fields feed the meta tags, JSON-LD and static body content generated
 * in prerender.js, and `updatedAt` gives the sitemap a real <lastmod>.
 *
 * `description` is Portable Text in Studio — pt::text() flattens it to plain
 * text (paragraphs joined by blank lines). The coalesce keeps any legacy
 * plain-string descriptions working.
 */
export async function fetchAllProjects() {
    return fetchOrFail('projects', `
        *[_type == "property" && defined(propertyId) && !(_id in path("drafts.**"))] {
            "slug": propertyId,
            title,
            "description": coalesce(pt::text(description), description),
            location,
            price,
            bedrooms,
            bathrooms,
            carSpaces,
            features,
            address,
            map,
            "image": image.asset->url,
            "collectionTitle": *[_type == "propertyCollection" && references(^._id)][0].title,
            "updatedAt": _updatedAt
        }
    `);
}

/**
 * All published blog posts. Extra fields (publishedAt, authorName) feed the
 * JSON-LD structured data generated in prerender.js.
 */
export async function fetchAllBlogPosts() {
    return fetchOrFail('blog posts', `
        *[_type == "post" && defined(slug.current) && !(_id in path("drafts.**"))] {
            "slug": slug.current,
            title,
            excerpt,
            "image": featuredImage.asset->url,
            publishedAt,
            "authorName": author->name,
            "updatedAt": _updatedAt
        }
    `);
}

/**
 * Routes that must never enter the sitemap or be prerendered.
 * /admin  — internal tooling.
 * /join   — internal Zoom room selector; displays the shared meeting password.
 * /tools  — hidden calculators/tools, shared by direct backlink only.
 * /insights — every insight page awaits claims and Australian Consumer Law
 *   sign-off. As each is approved, list the others here individually instead
 *   and drop `noindex` in that page (InsightPage / NewVsEstablishedPage).
 */
export const EXCLUDED_ROUTES = ['/admin', '/join', '/tools', '/insights'];
