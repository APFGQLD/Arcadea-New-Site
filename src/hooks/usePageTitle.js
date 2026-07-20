import { useEffect } from 'react';

const BASE_TITLE = 'Arcadea Property';
const DEFAULT_TITLE = `${BASE_TITLE} | Exquisite Living, Refined Investments`;
const DEFAULT_DESCRIPTION = "Discover premium off-plan investment properties in Bali and Australia. Arcadea Property offers curated coastal and island collections with guaranteed returns and expert guidance.";
const SITE_URL = 'https://arcadea.com.au';

/**
 * Sets the document title, canonical URL, meta description, and robots tag
 * for the current page.
 *
 * usePageTitle('About Us')                              → "About Us | Arcadea Property"
 * usePageTitle('About Us', { description: '...' })      → custom meta description
 * usePageTitle('Page Not Found', { noindex: true })     → adds <meta name="robots" content="noindex">
 *
 * Pass no title (or undefined while data loads) to keep the default site title.
 * The canonical always reflects the current route, so every page identifies
 * itself instead of pointing search engines back at the homepage.
 */
const usePageTitle = (title, { description, noindex = false } = {}) => {
    useEffect(() => {
        document.title = title ? `${title} | ${BASE_TITLE}` : DEFAULT_TITLE;

        // Canonical: current path, no query/hash
        const path = window.location.pathname;
        const canonicalHref = path === '/' ? `${SITE_URL}/` : `${SITE_URL}${path.replace(/\/$/, '')}`;
        let canonical = document.querySelector('link[rel="canonical"]');
        if (!canonical) {
            canonical = document.createElement('link');
            canonical.setAttribute('rel', 'canonical');
            document.head.appendChild(canonical);
        }
        canonical.setAttribute('href', canonicalHref);

        // Meta description (reset to default when a page doesn't provide one,
        // so a previous page's description never leaks across routes)
        const desc = document.querySelector('meta[name="description"]');
        if (desc) {
            desc.setAttribute('content', description || DEFAULT_DESCRIPTION);
        }

        // Robots: only render the tag when a page opts out of indexing
        let robots = document.querySelector('meta[name="robots"]');
        if (noindex) {
            if (!robots) {
                robots = document.createElement('meta');
                robots.setAttribute('name', 'robots');
                document.head.appendChild(robots);
            }
            robots.setAttribute('content', 'noindex');
        } else if (robots) {
            robots.remove();
        }
    }, [title, description, noindex]);
};

export default usePageTitle;
