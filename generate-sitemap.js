import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const BASE_URL = 'https://api.airtable.com/v0';
const PAT = process.env.VITE_AIRTABLE_PAT;
const BASE_ID = process.env.VITE_AIRTABLE_BASE_ID;
const PROJECTS_TABLE = process.env.VITE_AIRTABLE_TABLE_PROJECTS || 'Projects';
const WP_API_URL = process.env.VITE_WP_API_URL || 'https://cms.arcadea.com.au/wp-json/wp/v2';
const SITE_URL = 'https://arcadeaproperty.com'; // Update with your actual domain

/**
 * Fetch all projects from Airtable
 */
async function fetchAllProjects() {
    if (!BASE_ID || !PAT) {
        console.warn('⚠️  Airtable credentials not configured.');
        return [];
    }

    try {
        const headers = {
            'Authorization': `Bearer ${PAT}`,
            'Content-Type': 'application/json',
        };

        const response = await fetch(`${BASE_URL}/${BASE_ID}/${PROJECTS_TABLE}`, { headers });

        if (!response.ok) {
            console.error('Failed to fetch projects');
            return [];
        }

        const data = await response.json();
        return data.records;
    } catch (error) {
        console.error('Error fetching projects:', error);
        return [];
    }
}

/**
 * Fetch all blog posts from WordPress
 */
async function fetchAllBlogPosts() {
    try {
        let allPosts = [];
        let page = 1;
        let totalPages = 1;

        console.log('📡 Fetching blog posts from WordPress...');

        // Loop to fetch all pages of posts
        while (page <= totalPages) {
            const response = await fetch(`${WP_API_URL}/posts?page=${page}&per_page=100&_embed=false`);

            if (!response.ok) {
                console.error(`Failed to fetch blog posts page ${page}`);
                break;
            }

            // Get total pages from headers on first request
            if (page === 1) {
                const totalPagesHeader = response.headers.get('x-wp-totalpages');
                if (totalPagesHeader) {
                    totalPages = parseInt(totalPagesHeader, 10);
                }
            }

            const posts = await response.json();
            allPosts = [...allPosts, ...posts];
            page++;
        }

        console.log(`✅ Found ${allPosts.length} blog posts`);
        return allPosts;
    } catch (error) {
        console.error('Error fetching blog posts:', error);
        return [];
    }
}

/**
 * Generate XML sitemap
 */
function generateSitemapXML(projects, blogPosts) {
    const now = new Date().toISOString();

    // Static pages
    const staticPages = [
        { url: '/', priority: '1.0', changefreq: 'weekly' },
        { url: '/properties', priority: '0.9', changefreq: 'weekly' },
        { url: '/news', priority: '0.8', changefreq: 'daily' },
        { url: '/privacy-policy', priority: '0.5', changefreq: 'yearly' },
    ];

    // Hardcoded project pages
    const hardcodedProjects = [
        { url: '/project/one-park-lane', priority: '0.9', changefreq: 'monthly' }
    ];

    // Dynamic project pages
    const projectPages = projects.map(project => {
        const slug = project.fields['Slug'] || project.id;
        return {
            url: `/project/${slug}`,
            priority: '0.8',
            changefreq: 'monthly'
        };
    });

    // Dynamic blog pages
    const blogPages = blogPosts.map(post => {
        return {
            url: `/news/${post.slug}`,
            priority: '0.7',
            changefreq: 'weekly'
        };
    });

    const allPages = [...staticPages, ...hardcodedProjects, ...projectPages, ...blogPages];

    // Build XML
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

    for (const page of allPages) {
        xml += '  <url>\n';
        xml += `    <loc>${SITE_URL}${page.url}</loc>\n`;
        xml += `    <lastmod>${now}</lastmod>\n`;
        xml += `    <changefreq>${page.changefreq}</changefreq>\n`;
        xml += `    <priority>${page.priority}</priority>\n`;
        xml += '  </url>\n';
    }

    xml += '</urlset>';
    return xml;
}

/**
 * Main sitemap generation function
 */
async function generateSitemap() {
    console.log('🗺️  Generating XML sitemap...\n');

    // Check if dist folder exists
    const distPath = path.join(__dirname, 'dist');
    if (!fs.existsSync(distPath)) {
        console.error('❌ dist folder not found. Please run "npm run build" first.');
        process.exit(1);
    }

    // Fetch all projects
    console.log('📡 Fetching projects from Airtable...');
    const projects = await fetchAllProjects();
    console.log(`✅ Found ${projects.length} projects\n`);

    // Fetch all blog posts
    const blogPosts = await fetchAllBlogPosts();

    // Generate sitemap XML
    const sitemapXML = generateSitemapXML(projects, blogPosts);

    // Write sitemap.xml to dist folder
    const sitemapPath = path.join(distPath, 'sitemap.xml');
    fs.writeFileSync(sitemapPath, sitemapXML);

    console.log('✅ Sitemap generated successfully!');
    console.log(`📄 Location: ${sitemapPath}`);
    console.log(`📊 Total URLs: ${projects.length + blogPosts.length + 3}\n`);
}

// Run the sitemap generation
generateSitemap().catch(error => {
    console.error('❌ Sitemap generation failed:', error);
    process.exit(1);
});
