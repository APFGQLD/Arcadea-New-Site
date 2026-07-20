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
            const response = await fetch(`${WP_API_URL}/posts?page=${page}&per_page=100&_embed=true`);

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

const SITE_URL = 'https://arcadea.com.au';

/**
 * Remove the base template's title, description, canonical, and social meta
 * tags so the page-specific set injected below is the ONLY set. Duplicate
 * titles/canonicals make search engines ignore both.
 */
function stripBaseMetaTags(html) {
    return html
        .replace(/<title>[\s\S]*?<\/title>\s*/i, '')
        .replace(/<meta\s+name="(?:title|description)"[\s\S]*?\/>\s*/gi, '')
        .replace(/<meta\s+property="(?:og|twitter):[^"]*"[\s\S]*?\/>\s*/gi, '')
        .replace(/<link\s+rel="canonical"[^>]*\/>\s*/gi, '');
}

/**
 * Escape text destined for HTML attribute values
 */
function escapeAttr(text) {
    return String(text)
        .replace(/&/g, '&amp;')
        .replace(/"/g, '&quot;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}

/**
 * Generate SEO-friendly HTML for a project
 */
function generateProjectHTML(project, baseHTML) {
    const fields = project.fields;
    const slug = fields['Slug'] || project.id;
    const title = escapeAttr(fields['Name'] || 'Project');
    const description = escapeAttr((fields['Description'] || '').substring(0, 160));
    const image = fields['Hero Image']?.[0]?.url || `${SITE_URL}/og-image.jpg`;
    const url = `${SITE_URL}/project/${slug}`;

    const metaTags = `
    <title>${title} | Arcadea Property</title>
    <meta name="description" content="${description}">
    <meta property="og:title" content="${title}">
    <meta property="og:description" content="${description}">
    <meta property="og:image" content="${image}">
    <meta property="og:url" content="${url}">
    <meta property="og:type" content="website">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${title}">
    <meta name="twitter:description" content="${description}">
    <meta name="twitter:image" content="${image}">
    <link rel="canonical" href="${url}">
`;

    return stripBaseMetaTags(baseHTML).replace('</head>', `${metaTags}\n  </head>`);
}

/**
 * Generate SEO-friendly HTML for a blog post
 */
function generateBlogPostHTML(post, baseHTML) {
    const slug = post.slug;
    const title = escapeAttr(post.title.rendered);
    // Strip HTML tags from excerpt for description
    const excerptRaw = post.excerpt.rendered || '';
    const description = escapeAttr(excerptRaw.replace(/<[^>]*>?/gm, '').substring(0, 160));
    const image = post._embedded?.['wp:featuredmedia']?.[0]?.source_url || `${SITE_URL}/og-image.jpg`;
    const url = `${SITE_URL}/news/${slug}`;

    const metaTags = `
    <title>${title} | Arcadea Property</title>
    <meta name="description" content="${description}">
    <meta property="og:title" content="${title}">
    <meta property="og:description" content="${description}">
    <meta property="og:image" content="${image}">
    <meta property="og:url" content="${url}">
    <meta property="og:type" content="article">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${title}">
    <meta name="twitter:description" content="${description}">
    <meta name="twitter:image" content="${image}">
    <link rel="canonical" href="${url}">
`;

    return stripBaseMetaTags(baseHTML).replace('</head>', `${metaTags}\n  </head>`);
}

/**
 * Main pre-rendering function
 */
async function prerender() {
    console.log('🚀 Starting pre-rendering process...\n');

    // Check if dist folder exists
    const distPath = path.join(__dirname, 'dist');
    if (!fs.existsSync(distPath)) {
        console.error('❌ dist folder not found. Please run "npm run build" first.');
        process.exit(1);
    }

    // Read the base index.html
    const indexPath = path.join(distPath, 'index.html');
    if (!fs.existsSync(indexPath)) {
        console.error('❌ index.html not found in dist folder.');
        process.exit(1);
    }

    const baseHTML = fs.readFileSync(indexPath, 'utf-8');
    console.log('✅ Loaded base HTML template\n');

    // Fetch all projects
    console.log('📡 Fetching projects from Airtable...');
    const projects = await fetchAllProjects();
    console.log(`✅ Found ${projects.length} projects\n`);

    // Fetch all blog posts
    const blogPosts = await fetchAllBlogPosts();

    // Generate HTML for each project
    let generated = 0;
    for (const project of projects) {
        const slug = project.fields['Slug'] || project.id;
        const projectHTML = generateProjectHTML(project, baseHTML);

        // Create project directory
        const projectDir = path.join(distPath, 'project', slug);
        fs.mkdirSync(projectDir, { recursive: true });

        // Write HTML file
        const htmlPath = path.join(projectDir, 'index.html');
        fs.writeFileSync(htmlPath, projectHTML);

        generated++;
        console.log(`  ✓ Generated: /project/${slug}/index.html`);
    }

    // Generate HTML for each blog post
    for (const post of blogPosts) {
        const slug = post.slug;
        const postHTML = generateBlogPostHTML(post, baseHTML);

        // Create blog directory
        const postDir = path.join(distPath, 'news', slug);
        fs.mkdirSync(postDir, { recursive: true });

        // Write HTML file
        const htmlPath = path.join(postDir, 'index.html');
        fs.writeFileSync(htmlPath, postHTML);

        generated++;
        console.log(`  ✓ Generated: /news/${slug}/index.html`);
    }

    console.log(`\n✅ Pre-rendering complete! Generated ${generated} pages (Projects + Blog Posts).`);
    console.log('📦 Your site is ready for deployment with SEO-friendly HTML!\n');
}

// Run the pre-rendering
prerender().catch(error => {
    console.error('❌ Pre-rendering failed:', error);
    process.exit(1);
});
