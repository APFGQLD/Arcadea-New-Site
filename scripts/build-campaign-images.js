/**
 * Builds the responsive images for the commercial & industrial campaign page
 * (/campaigns/commercial-industrial) from the designer handoff's assets folder.
 *
 *   node scripts/build-campaign-images.js "<path to handoff>/assets"
 *
 * Writes AVIF, WebP and JPEG at a few widths (never wider than the source)
 * to public/images/campaigns/commercial-industrial/, and copies the research
 * logos to public/images/campaigns/logos/. The page's srcsets are built from
 * the same width lists in src/data/campaigns/commercialIndustrial.js, so keep
 * the two in step.
 */
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const src = process.argv[2];
if (!src || !fs.existsSync(src)) {
    console.error('Usage: node scripts/build-campaign-images.js <handoff assets folder>');
    process.exit(1);
}

const OUT = path.resolve('public/images/campaigns/commercial-industrial');
const LOGOS_OUT = path.resolve('public/images/campaigns/logos');
fs.mkdirSync(OUT, { recursive: true });
fs.mkdirSync(LOGOS_OUT, { recursive: true });

const PHOTO = [640, 1024, 1600];
const TILE = [480, 800];

// [source (relative to assets), output name, widths]
const JOBS = [
    ['photos/hero-industrial-corridor.jpg', 'hero', [800, 1200, 1536]],
    ['photos/residential-townhouses.jpg', 'residential-townhouses', PHOTO],
    ['photos/residential-for-sale-sign.jpg', 'residential-for-sale', PHOTO],
    ['photos/business-owner-warehouse.jpg', 'business-owner', PHOTO],
    ['photos/use-online-retail-packing.jpg', 'use-online-retail', TILE],
    ['photos/use-light-manufacturing.jpg', 'use-light-manufacturing', TILE],
    ['photos/use-admin-office.jpg', 'use-admin-office', TILE],
    // AI-generated placeholders: replace with real project photography before launch
    ['photos/warehouse-ai/estate-14-15.jpg', 'use-fulfilment-PLACEHOLDER', TILE],
    ['photos/warehouse-ai/int-workshop.jpg', 'use-trade-PLACEHOLDER', TILE],
    ['photos/warehouse-ai/int-showroom.jpg', 'use-showroom-PLACEHOLDER', TILE],
    ...['townsville-qld', 'moreton-bay-qld', 'albury-nsw', 'warnervale-nsw', 'newcastle-nsw',
        'warrnambool-vic', 'bendigo-vic', 'ballarat-vic', 'dandenong-vic']
        .map((slug) => [`photos/locations/${slug}.jpg`, `loc-${slug}`, TILE]),
];

let written = 0;
for (const [rel, name, widths] of JOBS) {
    const file = path.join(src, rel);
    const { width: srcW } = await sharp(file).metadata();
    // Keep only the widths the source can supply, plus the source width itself
    // when every requested width is larger than it
    const usable = widths.filter((w) => w <= srcW);
    const targets = usable.length ? usable : [srcW];
    for (const w of targets) {
        const base = sharp(file).rotate().resize({ width: w, withoutEnlargement: true });
        await base.clone().avif({ quality: 50, effort: 6 }).toFile(path.join(OUT, `${name}-${w}.avif`));
        await base.clone().webp({ quality: 72 }).toFile(path.join(OUT, `${name}-${w}.webp`));
        await base.clone().jpeg({ quality: 76, mozjpeg: true }).toFile(path.join(OUT, `${name}-${w}.jpg`));
        written += 3;
    }
    console.log(`  ${name}: ${targets.join(', ')}`);
}

// Open Graph share image: 1200×630 crop of the hero
await sharp(path.join(src, 'photos/hero-industrial-corridor.jpg'))
    .resize(1200, 630, { fit: 'cover' })
    .jpeg({ quality: 80, mozjpeg: true })
    .toFile(path.join(OUT, 'og.jpg'));

const logoDir = path.join(src, 'logos/press-and-research');
for (const f of fs.readdirSync(logoDir)) {
    if (f.endsWith('.webp')) {
        // news.com.au ships as WebP; the PNG keeps older toolchains happy
        await sharp(path.join(logoDir, f)).png().toFile(path.join(LOGOS_OUT, f.replace(/\.webp$/, '.png')));
    } else {
        fs.copyFileSync(path.join(logoDir, f), path.join(LOGOS_OUT, f));
    }
}

console.log(`\nWrote ${written} photos, the share image and the logos.`);
