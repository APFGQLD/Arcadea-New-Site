/*
 * Attribution and analytics hooks for campaign landing pages.
 *
 * UTM parameters are captured on arrival and kept for the browser session,
 * so a visitor who lands from an ad, reads for a while and then enquires is
 * still attributed to that ad. Storage can be unavailable (private windows,
 * blocked site data), so every read and write is guarded and the page works
 * without it.
 */

const KEY = 'arcadea_campaign_attribution';
const PARAMS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'gclid', 'fbclid'];

const readStored = () => {
    try {
        return JSON.parse(window.sessionStorage.getItem(KEY)) || {};
    } catch {
        return {};
    }
};

/**
 * Reads UTM / click IDs from the current URL. First touch wins within a
 * session: a later visit without UTMs doesn't wipe the original source.
 * `variant` comes from ?variant= so A/B versions can share one route.
 */
export function captureAttribution(defaultVariant) {
    const stored = readStored();
    const query = new URLSearchParams(window.location.search);
    const fresh = {};
    PARAMS.forEach((p) => {
        const v = query.get(p);
        if (v) fresh[p] = v.slice(0, 200);
    });
    const variant = query.get('variant') || stored.landing_variant || defaultVariant;
    const merged = Object.keys(fresh).length && !stored.utm_source
        ? { ...fresh, landing_variant: variant }
        : { ...stored, landing_variant: variant };
    try {
        window.sessionStorage.setItem(KEY, JSON.stringify(merged));
    } catch {
        /* storage blocked: attribution still travels in memory below */
    }
    return merged;
}

export function getAttribution(defaultVariant) {
    const stored = readStored();
    return Object.keys(stored).length ? stored : captureAttribution(defaultVariant);
}

/**
 * Sends a named event to whichever trackers are on the page. GA4 (gtag) is
 * loaded site-wide from index.html. The Meta and Google Ads pixels aren't
 * installed yet: once their IDs and the consent approach are confirmed, add
 * them to index.html and these calls start reporting with no page changes.
 */
export function trackEvent(name, params = {}) {
    try {
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({ event: name, ...params });
        if (typeof window.gtag === 'function') window.gtag('event', name, params);
        if (typeof window.fbq === 'function') {
            if (name === 'generate_lead') window.fbq('track', 'Lead', params);
            else window.fbq('trackCustom', name, params);
        }
    } catch {
        /* analytics must never break the page */
    }
}
