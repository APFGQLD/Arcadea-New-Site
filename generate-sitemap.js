import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { fetchAllProjects, fetchAllBlogPosts, EXCLUDED_ROUTES } from './cms.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SITE_URL = 'https://arcadea.com.au'; // Update with your actual domain

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
            // Exclude dynamic routes, wildcards, and any internal-only routes
            const isExcluded = EXCLUDED_ROUTES.some(
                (excluded) => routePath === excluded || routePath.startsWith(`${excluded}/`)
            );
            if (!routePath.includes(':') && !routePath.includes('*') && !isExcluded) {
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

    // 2. Dynamic project pages (Sanity)
    projects.forEach(project => {
        addUrl(`/project/${project.slug}`, '0.8', 'monthly');
    });

    // 3. Dynamic blog pages (Sanity)
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
    console.log('📡 Fetching projects from Sanity...');
    const projects = await fetchAllProjects();
    console.log(`✅ Found ${projects.length} projects\n`);

    // Fetch all blog posts
    console.log('📡 Fetching blog posts from Sanity...');
    const blogPosts = await fetchAllBlogPosts();
    console.log(`✅ Found ${blogPosts.length} blog posts\n`);

    // Generate sitemap XML
    const sitemapXML = generateSitemapXML(projects, blogPosts);

    // Write sitemap.xml to public/ (the source of truth for the next build).
    const sitemapPath = path.join(publicPath, 'sitemap.xml');
    fs.writeFileSync(sitemapPath, sitemapXML);
    console.log('✅ Sitemap generated successfully!');
    console.log(`📄 Location: ${sitemapPath}`);

    // Also write straight into dist/. Vite copies public/ into dist/ during
    // `vite build`, which has already finished by the time this script runs —
    // so without this the deployed sitemap is always one build out of date.
    const distPath = path.join(__dirname, 'dist');
    if (fs.existsSync(distPath)) {
        const distSitemapPath = path.join(distPath, 'sitemap.xml');
        fs.writeFileSync(distSitemapPath, sitemapXML);
        console.log(`📄 Location: ${distSitemapPath}`);
    }

    // Count what was actually written rather than estimating
    const totalUrls = (sitemapXML.match(/<loc>/g) || []).length;
    console.log(`📊 Total URLs: ${totalUrls}\n`);
}

// Run the sitemap generation
generateSitemap().catch(error => {
    console.error('❌ Sitemap generation failed:', error);
    process.exit(1);
});
