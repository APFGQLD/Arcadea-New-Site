import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { fetchAllProjects, fetchAllBlogPosts } from './cms.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

const DEFAULT_DESCRIPTION = 'Discover premium off-plan investment properties in Bali and Australia. Arcadea Property offers curated coastal and island collections with expert guidance.';

/**
 * Trim CMS copy to a search-snippet-friendly length, cutting on a word
 * boundary rather than mid-word. Returns '' for empty/missing input so
 * callers can fall back rather than emitting an empty description tag.
 */
function truncate(text, maxLength) {
    const clean = String(text || '').replace(/\s+/g, ' ').trim();
    if (!clean) return '';
    if (clean.length <= maxLength) return clean;
    const cut = clean.slice(0, maxLength);
    const lastSpace = cut.lastIndexOf(' ');
    return `${(lastSpace > 0 ? cut.slice(0, lastSpace) : cut).replace(/[,;:.\s]+$/, '')}…`;
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
    const slug = project.slug;
    const title = escapeAttr(project.title || 'Project');
    const description = escapeAttr(truncate(project.description, 160) || DEFAULT_DESCRIPTION);
    const image = project.image || `${SITE_URL}/og-image.jpg`;
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
    const title = escapeAttr(post.title || 'Article');
    const description = escapeAttr(truncate(post.excerpt, 160) || DEFAULT_DESCRIPTION);
    const image = post.image || `${SITE_URL}/og-image.jpg`;
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
 * Generate SEO-friendly HTML for static routes
 */
function generateStaticPageHTML(routeObj, baseHTML) {
    const url = `${SITE_URL}${routeObj.path}`;
    const pageTitle = escapeAttr(routeObj.title ? `${routeObj.title} | Arcadea Property` : 'Arcadea Property | Exquisite Living, Refined Investments');
    const description = escapeAttr(routeObj.description || DEFAULT_DESCRIPTION);
    const image = `${SITE_URL}/og-image.jpg`;

    const metaTags = `
    <title>${pageTitle}</title>
    <meta name="description" content="${description}">
    <meta property="og:title" content="${pageTitle}">
    <meta property="og:description" content="${description}">
    <meta property="og:image" content="${image}">
    <meta property="og:url" content="${url}">
    <meta property="og:type" content="website">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${pageTitle}">
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
    console.log('📡 Fetching projects from Sanity...');
    const projects = await fetchAllProjects();
    console.log(`✅ Found ${projects.length} projects\n`);

    // Fetch all blog posts
    console.log('📡 Fetching blog posts from Sanity...');
    const blogPosts = await fetchAllBlogPosts();
    console.log(`✅ Found ${blogPosts.length} blog posts\n`);

    // Generate HTML for each project
    let generated = 0;
    for (const project of projects) {
        const slug = project.slug;
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

    // Generate HTML for static routes
    const staticRoutes = [
        { 
            path: '/properties', 
            title: 'Our Collections', 
            description: 'Explore the Coastal Collection in Australia and the Island Collection in Bali — curated off-plan residences and investment properties in sought-after locations.' 
        },
        { 
            path: '/about', 
            title: 'About Us', 
            description: 'Arcadea Property curates exceptional coastal and island real estate, bridging high-yield accessibility and ultra-luxury living across Australia and Bali.' 
        },
        { 
            path: '/services', 
            title: 'Our Services', 
            description: 'End-to-end property and financial solutions: Australian property, hotel and resort investments, and financial service partnerships through trusted advisors.' 
        },
        {
            path: '/services/ipdc',
            title: 'IPDC Program',
            description: 'Interest Paid During Construction explained: how IPDC arrangements can pay a return on your capital while an off-plan property is still being built.'
        },
        { 
            path: '/news', 
            title: 'News & Insights', 
            description: 'Expert insights on luxury property investment, market trends, and lifestyle destinations across Australia and Bali from the Arcadea Property team.' 
        },
        // NOTE: /join is deliberately excluded. It is an internal Zoom room
        // selector that displays the shared meeting password on the page, so
        // it is marked noindex and kept out of the sitemap.
        {
            path: '/privacy-policy',
            title: 'Privacy Policy',
            description: 'How Arcadea Property collects, uses, stores and protects your personal information, and how to contact us about your data.'
        },
        {
            path: '/project/one-park-lane',
            title: 'One Park Lane',
            description: 'One Park Lane, Southport — a 101 storey residential tower joined to a 60 storey commercial tower by a skybridge at level 22, in the heart of the Gold Coast.'
        },
        {
            path: '/project/luc/reviews',
            title: 'The Luc Reviews',
            description: 'Guest reviews and first-hand experiences from visitors to The Luc.'
        },
        {
            path: '/project/luc/private-sales',
            title: 'The Luc Private Sales',
            description: 'Private resale listings at The Luc. Share your unit preferences and our team will match you with current availability.'
        }
    ];

    console.log('\n📡 Generating static routes...');
    for (const route of staticRoutes) {
        const routeHTML = generateStaticPageHTML(route, baseHTML);
        
        // Create directory
        // Remove leading slash to make it relative to distPath
        const relativePath = route.path.startsWith('/') ? route.path.slice(1) : route.path;
        const routeDir = path.join(distPath, relativePath);
        fs.mkdirSync(routeDir, { recursive: true });

        // Write HTML file
        const htmlPath = path.join(routeDir, 'index.html');
        fs.writeFileSync(htmlPath, routeHTML);

        generated++;
        console.log(`  ✓ Generated: ${route.path}/index.html`);
    }

    console.log(`\n✅ Pre-rendering complete! Generated ${generated} pages (Projects + Blog Posts + Static Routes).`);
    console.log('📦 Your site is ready for deployment with SEO-friendly HTML!\n');
}

// Run the pre-rendering
prerender().catch(error => {
    console.error('❌ Pre-rendering failed:', error);
    process.exit(1);
});
