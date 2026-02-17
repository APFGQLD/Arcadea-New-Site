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
const SITE_URL = 'https://arcadea.com.au'; // Update with your actual domain

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
/**
 * Parse App.jsx to find static routes
 */
function getStaticRoutesFromApp() {
    try {
        const appPath = path.join(__dirname, 'src', 'App.jsx');
        const appContent = fs.readFileSync(appPath, 'utf8');

        // Match all path="..." definitions
        const routeRegex = /<Route\s+path=["']([^"']+)["']/g;
        const matches = [];
        let match;

        while ((match = routeRegex.exec(appContent)) !== null) {
            const routePath = match[1];
            // Exclude dynamic routes, wildcards, and admin routes
            if (!routePath.includes(':') && !routePath.includes('*') && !routePath.startsWith('/admin')) {
                matches.push(routePath);
            }
        }

        console.log(`✅ Found ${matches.length} static routes in App.jsx`);
        return matches;
    } catch (error) {
        console.error('⚠️  Failed to parse App.jsx:', error.message);
        return []; // Fallback to empty if file not found
    }
}

/**
 * Generate XML sitemap
 */
function generateSitemapXML(projects, blogPosts) {
    const now = new Date().toISOString();
    const urls = new Map(); // Use Map to deduplicate by URL

    // Helper to add URL if not exists
    const addUrl = (url, priority, changefreq) => {
        if (!urls.has(url)) {
            urls.set(url, { url, priority, changefreq });
        }
    };

    // 1. Scrape static pages from App.jsx
    const staticRoutes = getStaticRoutesFromApp();
    staticRoutes.forEach(route => {
        // Assign priorities based on depth/importance
        let priority = '0.8';
        let changefreq = 'weekly';

        if (route === '/') {
            priority = '1.0';
            changefreq = 'daily';
        } else if (route.includes('/campaign')) {
            priority = '0.9'; // Campaigns are important
        } else if (route === '/contact' || route === '/about') {
            priority = '0.7';
            changefreq = 'monthly';
        }

        addUrl(route, priority, changefreq);
    });

    // 2. Dynamic project pages (Airtable)
    projects.forEach(project => {
        const slug = project.fields['Slug'] || project.id;
        addUrl(`/project/${slug}`, '0.8', 'monthly');
    });

    // 3. Dynamic blog pages (WordPress)
    blogPosts.forEach(post => {
        addUrl(`/news/${post.slug}`, '0.7', 'weekly');
    });

    // Build XML
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

    for (const page of urls.values()) {
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

    // Check if public folder exists (it should in a Vite project)
    const publicPath = path.join(__dirname, 'public');
    if (!fs.existsSync(publicPath)) {
        console.warn('⚠️  public folder not found. Creating it...');
        fs.mkdirSync(publicPath);
    }

    // Fetch all projects
    console.log('📡 Fetching projects from Airtable...');
    const projects = await fetchAllProjects();
    console.log(`✅ Found ${projects.length} projects\n`);

    // Fetch all blog posts
    const blogPosts = await fetchAllBlogPosts();

    // Generate sitemap XML
    const sitemapXML = generateSitemapXML(projects, blogPosts);

    // Write sitemap.xml to public folder
    const sitemapPath = path.join(publicPath, 'sitemap.xml');
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
