/**
 * Search titles and meta descriptions for project pages, shared by the
 * prerender (build time) and usePageTitle (client) so both emit the same tags.
 *
 * House-and-land listings are titled after their estate in Sanity, so several
 * packages in one estate (e.g. three at "Taylors Ridge Estate") would share a
 * title, and their descriptions all open with the same estate blurb. Google
 * then folds them together as duplicates. For those, lead with the home
 * design (statusTag, e.g. "Brixton 161") and build the description from the
 * listing's own facts.
 */

/**
 * Trim copy to a search-snippet-friendly length, cutting on a word boundary
 * rather than mid-word. Returns '' for empty/missing input so callers can
 * fall back rather than emitting an empty description tag.
 */
export function truncate(text, maxLength) {
    const clean = String(text || '').replace(/\s+/g, ' ').trim();
    if (!clean) return '';
    if (clean.length <= maxLength) return clean;
    const cut = clean.slice(0, maxLength);
    const lastSpace = cut.lastIndexOf(' ');
    return `${(lastSpace > 0 ? cut.slice(0, lastSpace) : cut).replace(/[,;:.\s]+$/, '')}…`;
}

// statusTag holds the design name ("Brixton 161", "Keilor 219 (Dual Key)") on
// house-and-land packages, but a status ("Under Construction") on some others.
// Only a design name has a number in it.
function designName({ tag, statusTag }) {
    if (tag !== 'House And Land' || !/\d/.test(statusTag || '')) return null;
    return statusTag.replace(/\s+\)/g, ')').trim();
}

/**
 * `name` is the Sanity title (the estate, for house and land).
 */
export function projectSeoTitle({ name, tag, statusTag, location }) {
    const estate = (name || '').trim();
    const design = designName({ tag, statusTag });
    if (!design) return estate;
    return `${design} at ${estate}${location ? `, ${location}` : ''}`;
}

/**
 * Listings for one lot/unit in a development ("The Mill Residences - Lot 121")
 * open with the development's shared intro, then a paragraph about that lot.
 * Returns that lot's paragraph — the first one naming it that is more than
 * just its heading — or null.
 */
function unitParagraph(name, text) {
    const m = (name || '').match(/\b(Lot|Unit)\s*(\d+)\b/i);
    if (!m) return null;
    const names = new RegExp(`\\b${m[1]}\\s*${m[2]}\\b`, 'i');
    return String(text || '')
        .split(/\n\s*\n/)
        .map(p => p.trim())
        .find(p => names.test(p) && p.length > 60) || null;
}

/**
 * `fallbackText` is the plain-text description (blocks separated by blank
 * lines), used as-is when nothing more specific applies.
 */
export function projectSeoDescription({ name, tag, statusTag, location, features }, fallbackText) {
    const design = designName({ tag, statusTag });
    const facts = (features || []).filter(Boolean);
    if (design && facts.length) {
        const where = `${(name || '').trim()}${location ? `, ${location}` : ''}`;
        return truncate(`${design} house and land package at ${where}. ${facts.join(' · ')}.`, 160);
    }
    return truncate(unitParagraph(name, fallbackText) || fallbackText, 160);
}
