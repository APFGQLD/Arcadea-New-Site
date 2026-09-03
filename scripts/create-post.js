import { randomUUID } from 'crypto';
import fs from 'fs';
import { writeClient } from './sanityWriteClient.js';

/**
 * Creates a draft "post" document in Sanity from a JSON brief, ready for a
 * human to add the featured image and hit publish in Studio.
 *
 * Usage: node scripts/create-post.js path/to/article.json
 *
 * JSON shape:
 * {
 *   "title": "string (required)",
 *   "slug": "optional-kebab-case — derived from title if omitted",
 *   "excerpt": "string, <=200 chars (required)",
 *   "categorySlug": "optional — matched against existing categories, or created if categoryName is also given",
 *   "categoryName": "optional — display name used only when creating a new category",
 *   "authorName": "optional — matched against existing authors (case-insensitive), defaults to the first author found",
 *   "publishedAt": "optional ISO datetime, defaults to now",
 *   "body": [
 *     { "type": "h2" | "h3" | "p", "text": "string" },
 *     // OR, for a paragraph with an inline link, use "parts" instead of "text":
 *     { "type": "p", "parts": [
 *         { "text": "See our " },
 *         { "text": "One Park Lane listing", "href": "/project/one-park-lane" },
 *         { "text": " for current availability." }
 *     ] }
 *   ]
 * }
 */

const slugify = (text) =>
    text
        .toLowerCase()
        .trim()
        .replace(/['’]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');

const toChildrenAndMarkDefs = (block) => {
    if (Array.isArray(block.parts)) {
        const markDefs = [];
        const children = block.parts.map((part) => {
            if (!part.href) {
                return { _type: 'span', _key: randomUUID(), text: part.text, marks: [] };
            }
            const linkKey = randomUUID();
            markDefs.push({ _type: 'link', _key: linkKey, href: part.href });
            return { _type: 'span', _key: randomUUID(), text: part.text, marks: [linkKey] };
        });
        return { children, markDefs };
    }
    return {
        children: [{ _type: 'span', _key: randomUUID(), text: block.text, marks: [] }],
        markDefs: [],
    };
};

const toPortableText = (body) => {
    if (!Array.isArray(body) || body.length === 0) {
        throw new Error('"body" must be a non-empty array of { type, text } blocks.');
    }
    return body.map((block) => {
        const { children, markDefs } = toChildrenAndMarkDefs(block);
        return {
            _type: 'block',
            _key: randomUUID(),
            style: block.type === 'h2' || block.type === 'h3' ? block.type : 'normal',
            markDefs,
            children,
        };
    });
};

const resolveAuthor = async (authorName) => {
    const authors = await writeClient.fetch('*[_type == "author"]{_id, name}');
    if (authors.length === 0) {
        throw new Error('No author documents exist in Sanity yet. Create one in Studio first (Author needs a name, and ideally a photo/bio).');
    }
    if (!authorName) return authors[0];
    const match = authors.find((a) => a.name.toLowerCase() === authorName.toLowerCase());
    if (!match) {
        throw new Error(`No author named "${authorName}" found. Existing authors: ${authors.map((a) => a.name).join(', ')}`);
    }
    return match;
};

const resolveCategory = async (categorySlug, categoryName) => {
    if (!categorySlug) return null;
    const existing = await writeClient.fetch('*[_type == "category" && slug.current == $slug][0]{_id, name}', { slug: categorySlug });
    if (existing) return existing;

    if (!categoryName) {
        throw new Error(`No category with slug "${categorySlug}" exists, and no "categoryName" was given to create one.`);
    }
    console.log(`Category "${categorySlug}" not found — creating it as "${categoryName}".`);
    return writeClient.create({
        _type: 'category',
        name: categoryName,
        slug: { _type: 'slug', current: categorySlug },
    });
};

async function main() {
    const filePath = process.argv[2];
    if (!filePath) {
        console.error('Usage: node scripts/create-post.js path/to/article.json');
        process.exit(1);
    }

    const brief = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

    if (!brief.title) throw new Error('"title" is required.');
    if (!brief.excerpt) throw new Error('"excerpt" is required.');
    if (brief.excerpt.length > 200) {
        console.warn(`⚠️  Excerpt is ${brief.excerpt.length} chars — Studio's validation caps it at 200.`);
    }

    const slug = brief.slug ? slugify(brief.slug) : slugify(brief.title);
    const content = toPortableText(brief.body);
    const author = await resolveAuthor(brief.authorName);
    const category = await resolveCategory(brief.categorySlug, brief.categoryName);

    const doc = {
        _id: `drafts.${randomUUID()}`,
        _type: 'post',
        title: brief.title,
        slug: { _type: 'slug', current: slug },
        excerpt: brief.excerpt,
        content,
        author: { _type: 'reference', _ref: author._id },
        publishedAt: brief.publishedAt || new Date().toISOString(),
        ...(category ? { categories: [{ _type: 'reference', _ref: category._id, _key: randomUUID() }] } : {}),
    };

    const result = await writeClient.create(doc);

    console.log(`\n✅ Draft created: "${brief.title}"`);
    console.log(`   Slug: /news/${slug}`);
    console.log(`   Document ID: ${result._id}`);
    console.log('\nNext: open Studio (npm run dev in studio/, http://localhost:3333) → Blog Post → find it,');
    console.log('add a featured image, review the copy, then Publish.');
}

main().catch((error) => {
    console.error('❌ Failed to create post:', error.message);
    process.exit(1);
});
