import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { fetchAllProjects, fetchAllBlogPosts } from './cms.js';
import { formatListingPrice } from './src/utils/priceFormat.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SITE_URL = 'https://www.arcadea.com.au';

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
 * Static, crawlable body content placed inside #root. Without it every
 * prerendered page ships an empty <div id="root"></div> and search engines
 * see no content until they get round to executing the JS bundle.
 * main.jsx uses createRoot (not hydrateRoot), so React simply replaces this
 * on load — it only needs to be accurate, not match the app's markup.
 */
const SHELL_STYLE = 'max-width:960px;margin:0 auto;padding:120px 24px 64px;font-family:Urbanist,system-ui,sans-serif;line-height:1.6';

function injectBody(html, bodyHTML) {
    return html.replace('<div id="root"></div>', `<div id="root"><main style="${SHELL_STYLE}">${bodyHTML}</main></div>`);
}

/**
 * Plain text → escaped <p> paragraphs (pt::text joins blocks with blank lines).
 */
function paragraphs(text) {
    return String(text || '')
        .split(/\n\s*\n/)
        .map(p => p.trim())
        .filter(Boolean)
        .map(p => `<p>${escapeAttr(p)}</p>`)
        .join('\n');
}

function projectBodyHTML(project) {
    const stats = [
        project.bedrooms != null && `${project.bedrooms} bed`,
        project.bathrooms != null && `${project.bathrooms} bath`,
        project.carSpaces != null && `${project.carSpaces} car`,
    ].filter(Boolean).join(' · ');
    const features = Array.isArray(project.features) && project.features.length
        ? `<ul>${project.features.map(f => `<li>${escapeAttr(f)}</li>`).join('')}</ul>`
        : '';

    return `
      <nav><a href="/">Home</a> / <a href="/properties">Our Collections</a></nav>
      <h1>${escapeAttr(project.title || 'Project')}</h1>
      ${project.location ? `<p>${escapeAttr(project.location)}</p>` : ''}
      <p>${escapeAttr(formatListingPrice(project.price))}${stats ? ` · ${stats}` : ''}</p>
      ${project.image ? `<img src="${escapeAttr(project.image)}" alt="${escapeAttr(project.title || '')}" width="960" height="640" style="max-width:100%;height:auto">` : ''}
      ${paragraphs(project.description)}
      ${features}`;
}

function blogPostBodyHTML(post) {
    return `
      <nav><a href="/">Home</a> / <a href="/news">News &amp; Insights</a></nav>
      <h1>${escapeAttr(post.title || 'Article')}</h1>
      ${post.image ? `<img src="${escapeAttr(post.image)}" alt="${escapeAttr(post.title || '')}" style="max-width:100%;height:auto">` : ''}
      ${paragraphs(post.excerpt)}`;
}

function staticPageBodyHTML(routeObj, listLinks = []) {
    const list = listLinks.length
        ? `<ul>${listLinks.map(l => `<li><a href="${escapeAttr(l.href)}">${escapeAttr(l.label)}</a></li>`).join('')}</ul>`
        : '';
    return `
      <h1>${escapeAttr(routeObj.title || 'Arcadea Property')}</h1>
      ${routeObj.description ? `<p>${escapeAttr(routeObj.description)}</p>` : ''}
      ${list}`;
}

/**
 * Serialize one or more JSON-LD objects into <script type="application/ld+json">
 * tags. Escapes "<" so CMS copy containing "</script>" can't break out of the tag.
 */
function jsonLdTags(...objects) {
    return objects
        .filter(Boolean)
        .map(obj => `<script type="application/ld+json">${JSON.stringify(obj).replace(/</g, '\\u003c')}</script>`)
        .join('\n');
}

/**
 * schema.org BreadcrumbList from an ordered [{ name, url }, ...] trail.
 */
function breadcrumbJSONLD(items) {
    return {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: items.map((item, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: item.name,
            item: item.url,
        })),
    };
}

/**
 * schema.org RealEstateListing for a property page. Real estate isn't one of
 * Google's supported rich-result types, so this won't produce a special SERP
 * snippet — it's still valid structured data that helps search engines
 * understand what the page is about (name, images, price when known, and
 * address/geo once those are filled in on the property in Studio).
 */
function propertyJSONLD(project, url) {
    // price is { enquiryOnly, prefix, amount } (legacy docs may hold a string
    // like "POA"). Only publish an amount the site itself shows publicly.
    const price = project.price && typeof project.price === 'object' ? project.price : null;
    const numericPrice = Number(price?.amount);
    const hasPrice = price && !price.enquiryOnly && Number.isFinite(numericPrice) && numericPrice > 0;

    return {
        '@context': 'https://schema.org',
        '@type': 'RealEstateListing',
        name: project.title,
        description: truncate(project.description, 500) || DEFAULT_DESCRIPTION,
        url,
        image: project.image || `${SITE_URL}/og-image.jpg`,
        about: {
            '@type': 'Residence',
            name: project.title,
            address: project.address ? { '@type': 'PostalAddress', streetAddress: project.address } : undefined,
            geo: (project.map && project.map.lat != null && project.map.lng != null) ? {
                '@type': 'GeoCoordinates',
                latitude: project.map.lat,
                longitude: project.map.lng,
            } : undefined,
        },
        // NOTE: currency assumes AUD. Revisit if a Bali/IDR-priced listing ever
        // gets a real numeric price instead of "POA".
        offers: hasPrice ? {
            '@type': 'Offer',
            price: numericPrice,
            priceCurrency: 'AUD',
            availability: 'https://schema.org/InStock',
        } : undefined,
    };
}

/**
 * schema.org BlogPosting for an article page.
 */
function blogPostJSONLD(post, url) {
    return {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: post.title,
        description: truncate(post.excerpt, 300) || DEFAULT_DESCRIPTION,
        image: post.image || `${SITE_URL}/og-image.jpg`,
        url,
        datePublished: post.publishedAt || undefined,
        author: post.authorName ? { '@type': 'Person', name: post.authorName } : { '@type': 'Organization', name: 'Arcadea Property' },
        publisher: {
            '@type': 'Organization',
            name: 'Arcadea Property',
            logo: { '@type': 'ImageObject', url: `${SITE_URL}/brand-logo-white.png` },
        },
        mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    };
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

    const structuredData = jsonLdTags(
        breadcrumbJSONLD([
            { name: 'Home', url: `${SITE_URL}/` },
            { name: 'Our Collections', url: `${SITE_URL}/properties` },
            ...(project.collectionTitle ? [{ name: project.collectionTitle, url: `${SITE_URL}/properties` }] : []),
            { name: project.title || 'Project', url },
        ]),
        propertyJSONLD(project, url)
    );

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
    ${structuredData}
`;

    return injectBody(
        stripBaseMetaTags(baseHTML).replace('</head>', `${metaTags}\n  </head>`),
        projectBodyHTML(project)
    );
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

    const structuredData = jsonLdTags(
        breadcrumbJSONLD([
            { name: 'Home', url: `${SITE_URL}/` },
            { name: 'News & Insights', url: `${SITE_URL}/news` },
            { name: post.title || 'Article', url },
        ]),
        blogPostJSONLD(post, url)
    );

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
    ${structuredData}
`;

    return injectBody(
        stripBaseMetaTags(baseHTML).replace('</head>', `${metaTags}\n  </head>`),
        blogPostBodyHTML(post)
    );
}

/**
 * Generate SEO-friendly HTML for static routes. `listLinks` lets index pages
 * (e.g. /properties, /news) carry plain <a href> links to every child page.
 */
function generateStaticPageHTML(routeObj, baseHTML, listLinks = []) {
    const url = `${SITE_URL}${routeObj.path}`;
    const pageTitle = escapeAttr(routeObj.title ? `${routeObj.title} | Arcadea Property` : 'Arcadea Property | Exquisite Living, Refined Investments');
    const description = escapeAttr(routeObj.description || DEFAULT_DESCRIPTION);
    const image = `${SITE_URL}/og-image.jpg`;

    const structuredData = jsonLdTags(
        breadcrumbJSONLD([
            { name: 'Home', url: `${SITE_URL}/` },
            { name: routeObj.title || routeObj.path, url },
        ])
    );

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
    ${structuredData}
`;

    return injectBody(
        stripBaseMetaTags(baseHTML).replace('</head>', `${metaTags}\n  </head>`),
        staticPageBodyHTML(routeObj, listLinks)
    );
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
    // Index pages link out to every listing / article so crawlers can reach
    // them from the HTML alone, not just via the sitemap.
    const listLinksByPath = {
        '/properties': projects.map(p => ({ href: `/project/${p.slug}`, label: p.location ? `${p.title} — ${p.location}` : p.title })),
        '/news': blogPosts.map(p => ({ href: `/news/${p.slug}`, label: p.title })),
    };

    for (const route of staticRoutes) {
        const routeHTML = generateStaticPageHTML(route, baseHTML, listLinksByPath[route.path]);
        
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
