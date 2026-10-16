import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import puppeteer from 'puppeteer';
import sharp from 'sharp';
import QRCode from 'qrcode';
import { client } from '../cms.js';

// Public base URL the "scan to view" QR code on page 2 points at.
const SITE_URL = 'https://www.arcadea.com.au';

/**
 * Generates a 2-page PDF brochure for a property, straight from its Sanity
 * fields (title, price, description, quickFacts, features, gallery, agents),
 * laid out to match the existing hand-made brochures.
 *
 * Usage: npm run brochure -- <propertyId|_id> [--upload]
 * Output: brochures/<propertyId>.pdf
 *
 * --upload additionally uploads the PDF to Sanity and attaches it to that
 * property's Resources field (replacing any brochure this script uploaded
 * before), so Studio shows it the same as a manual upload would. This is
 * what the Sanity-publish GitHub Action runs — see .github/workflows/
 * sanity-rebuild.yml and docs/sanity-auto-rebuild.md. It needs
 * VITE_SANITY_WRITE_TOKEN (see scripts/sanityWriteClient.js).
 */

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

// Shown on every brochure. Not stored in Sanity (it's the same for every
// listing) — edit here if the agency's own details change.
const AGENCY = {
  name: 'ARCADEA PROPERTY',
  phone: '07 5560 8617',
  email: 'admin@arcadea.com.au',
};

// Fixed _key for the Resources array entry this script writes, so a rerun
// (next publish) replaces its own prior upload instead of piling up
// duplicates — a human's manually-added resources keep their own keys and
// are left untouched.
const AUTO_BROCHURE_KEY = 'auto-generated-brochure';

// The webhook that triggers automatic generation hands us the Sanity
// document _id, not the propertyId slug used everywhere else — accept
// either so the same command works for a manual `npm run brochure` and CI.
const QUERY = `*[_type == "property" && (propertyId == $slug || _id == $slug)][0]{
  _id,
  title,
  propertyId,
  location,
  address,
  "heroImage": image.asset->url + "?w=1800&auto=format&q=80",
  bedrooms,
  bathrooms,
  carSpaces,
  price,
  status,
  tag,
  "description": pt::text(description),
  features,
  quickFacts[]{ label, value, order },
  gallery[]{ "url": image.asset->url + "?w=1400&auto=format&q=80", caption },
  agents[]->{ name, jobTitle, phone, email }
}`;

// Split so the template can show the dollar amount large and any prefix
// ("House & Land", "Offers Over") as small subtext beneath it, instead of
// both run together at the same size.
function formatPriceParts(price) {
  if (!price) return { amount: '', subtext: '' };
  if (price.enquiryOnly) return { amount: 'Price By Enquiry', subtext: '' };
  if (price.amount == null) return { amount: '', subtext: '' };
  return {
    amount: `$${Number(price.amount).toLocaleString('en-US')}`,
    subtext: price.prefix || '',
  };
}

function toDataUri(relativePath) {
  const buf = fs.readFileSync(path.join(ROOT, relativePath));
  const ext = path.extname(relativePath).slice(1);
  return `data:image/${ext};base64,${buf.toString('base64')}`;
}

// Brochure copy is a short teaser, not the full listing description — and
// page 1 is a fixed A4 layout, so unbounded text would silently overflow
// past the page edge. Cut at the last word boundary within the budget.
function truncateText(text, maxChars) {
  if (text.length <= maxChars) return text;
  const cut = text.slice(0, maxChars);
  const lastSpace = cut.lastIndexOf(' ');
  return `${cut.slice(0, lastSpace > 0 ? lastSpace : maxChars).trim()}…`;
}

// The hero photo's top band sits directly behind the overlaid topbar text
// and logo, and real estate photos vary wildly there (bright sky vs a dark
// roofline). Sample that band's average brightness — matching the same
// cover-fit crop CSS `background-size: cover` would produce — and pick
// white-on-dark or dark-on-light so the overlay stays legible either way.
const HERO_BOX_PX = { width: 793, height: 627 }; // 210mm x 166mm @ 96dpi
const TOPBAR_BAND_PX = 110;
const LIGHT_BG_LUMA_THRESHOLD = 150; // 0-255

async function sampleHeroTopIsLight(imageUrl) {
  try {
    const res = await fetch(imageUrl);
    const buf = Buffer.from(await res.arrayBuffer());

    const { data, info } = await sharp(buf)
      .resize(HERO_BOX_PX.width, HERO_BOX_PX.height, { fit: 'cover', position: 'centre' })
      .extract({ left: 0, top: 0, width: HERO_BOX_PX.width, height: TOPBAR_BAND_PX })
      .raw()
      .toBuffer({ resolveWithObject: true });

    let sum = 0;
    let count = 0;
    for (let i = 0; i < data.length; i += info.channels) {
      sum += 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
      count += 1;
    }
    // The gradient overlay sitting on this band darkens it by ~10% (black @ 0.1 opacity).
    const avgLuma = (sum / count) * 0.9;
    return avgLuma > LIGHT_BG_LUMA_THRESHOLD;
  } catch (err) {
    console.warn(`Could not sample hero brightness, defaulting to light text: ${err.message}`);
    return false;
  }
}

function escapeHtml(str = '') {
  return String(str).replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  }[c]));
}

function renderHtml({ property, particulars, descriptionParagraphs, galleryImages, agent, logoWhite, logoBlack, heroTopIsLight, qrDataUri }) {
  const stats = [
    { label: 'Bedrooms', value: property.bedrooms },
    { label: 'Bathrooms', value: property.bathrooms },
    { label: 'Car Spaces', value: property.carSpaces },
  ].filter((s) => s.value != null);

  const priceParts = formatPriceParts(property.price);

  // Cover uses the property's dedicated hero/listing image (same one used
  // elsewhere on the site) — the gallery is reserved for page 2's supporting
  // photos, so the cover shot never doubles up with them.
  const heroPhoto = property.heroImage || galleryImages[0]?.url;
  const page2Photos = galleryImages;
  const sidePhotos = page2Photos.slice(1, 3);

  return `<!doctype html>
<html>
<head>
<meta charset="utf-8" />
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Josefin+Sans:wght@400;600;700&family=Urbanist:wght@400;500;600&display=swap" rel="stylesheet">
<style>
  @page { size: A4; margin: 0; }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Urbanist', sans-serif; color: #1a1a1a; }
  .page { width: 210mm; height: 297mm; position: relative; overflow: hidden; background: #fff; page-break-after: always; }
  .page:last-child { page-break-after: auto; }
  .eyebrow { color: #85714d; font-size: 11px; letter-spacing: 3px; text-transform: uppercase; font-weight: 600; }
  .bar { display: flex; justify-content: space-between; align-items: center; padding: 0 12mm; height: 14mm; font-size: 9px; letter-spacing: 2px; text-transform: uppercase; color: #555; }
  .bar img { height: 16px; }
  .footer { position: absolute; left: 12mm; right: 12mm; bottom: 9mm; display: flex; justify-content: space-between; align-items: center; font-size: 9px; letter-spacing: 2px; text-transform: uppercase; color: #999; }
  .footer img { height: 34px; }

  /* --- Page 1 --- */
  .hero { position: relative; height: 166mm; background-image: url('${heroPhoto}'); background-size: cover; background-position: center; }
  .hero-overlay { position: absolute; inset: 0; background: linear-gradient(to bottom, rgba(10,10,10,.1) 0%, rgba(10,10,10,.05) 30%, rgba(10,10,10,.85) 100%); }
  .hero-topbar { position: absolute; top: 0; left: 0; right: 0; z-index: 2; display: flex; justify-content: space-between; align-items: center; padding: 9mm 12mm 0; font-size: 10px; letter-spacing: 2.5px; text-transform: uppercase; }
  .hero-topbar.on-dark { color: #fff; }
  .hero-topbar.on-light { color: #1a1a1a; }
  .hero-topbar img { height: 96px; }
  .hero-location { position: absolute; left: 12mm; bottom: 46mm; color: #fff; font-size: 11px; letter-spacing: 3px; text-transform: uppercase; display: flex; align-items: center; gap: 10px; }
  .hero-location::before { content: ''; width: 24px; height: 1px; background: #fff; display: inline-block; }
  .hero-title { position: absolute; left: 12mm; bottom: 26mm; color: #fff; font-family: 'Josefin Sans', sans-serif; font-weight: 600; font-size: 38px; max-width: 160mm; }
  .hero-stats { position: absolute; left: 0; right: 0; bottom: 0; height: 26mm; background: linear-gradient(to bottom, rgba(10,10,10,0) 0%, rgba(10,10,10,.9) 100%); display: flex; color: #fff; }
  .hero-stats .cell { flex: 1; border-right: 1px solid rgba(255,255,255,.18); padding: 7mm 8mm 0; }
  .hero-stats .cell:last-child { border-right: none; flex: 1.4; }
  .hero-stats .cell .value { font-size: 26px; font-family: 'Josefin Sans', sans-serif; margin-top: 5px; }
  .hero-stats .cell .label { font-size: 9px; letter-spacing: 2px; text-transform: uppercase; color: #b8ab8f; font-weight: 700; margin-top: 4px; }
  .hero-stats .cell .label.price-label { color: #a68d60; }
  .hero-stats .cell .price-subtext { font-size: 11px; color: #d8d0c0; margin-top: 4px; }

  .intro { display: grid; grid-template-columns: 1fr 1fr; gap: 16mm; padding: 14mm 12mm 0; }
  .intro h2 { font-family: 'Josefin Sans', sans-serif; font-weight: 600; font-size: 26px; margin-top: 6px; line-height: 1.2; }
  .intro p { font-size: 12.5px; line-height: 1.75; color: #333; margin-bottom: 10px; }

  /* --- Page 2 --- */
  .photo-hero { width: 100%; height: 72mm; object-fit: cover; margin-top: 2mm; }
  .photo-row { display: flex; gap: 6mm; padding: 6mm 12mm 0; }
  .photo-row img { flex: 1; height: 50mm; object-fit: cover; }

  .columns { display: grid; grid-template-columns: 1fr 1fr; gap: 16mm; padding: 10mm 12mm 0; }
  .columns ul { list-style: none; }
  .columns li, .p-row { display: flex; justify-content: space-between; align-items: baseline; padding: 7px 0; border-bottom: 1px solid #e8e8e8; font-size: 12px; }
  .p-row span:first-child { color: #777; text-transform: uppercase; font-size: 10px; letter-spacing: 1px; }
  .p-row span:last-child { color: #1a1a1a; font-weight: 500; text-align: right; }
  .columns h3 { margin-bottom: 6px; }

  .enquiries { display: grid; grid-template-columns: 1.1fr 1fr 1fr; gap: 10mm; padding: 10mm 12mm 0; border-top: 1px solid #e8e8e8; margin: 8mm 12mm 0; }
  .enquiries h3 { font-family: 'Josefin Sans', sans-serif; font-weight: 600; font-size: 19px; margin-top: 4px; line-height: 1.25; }
  .contact-block .name { font-weight: 600; font-size: 13px; }
  .contact-block .role { font-size: 9px; letter-spacing: 1.5px; text-transform: uppercase; color: #999; margin: 3px 0 6px; }
  .contact-block div.line { font-size: 11.5px; color: #333; margin-top: 2px; }

  .disclaimer { font-size: 8px; color: #999; line-height: 1.6; padding: 7mm 12mm 0; max-width: 170mm; }

  .page-qr { position: absolute; right: 12mm; bottom: 22mm; display: flex; flex-direction: column; align-items: flex-end; gap: 10px; }
  .page-qr span { font-size: 8px; letter-spacing: 1.5px; text-transform: uppercase; color: #999; }
  .page-qr img { width: 22mm; height: 22mm; }
</style>
</head>
<body>

  <div class="page">
    <div class="hero">
      <div class="hero-overlay"></div>
      <div class="hero-topbar ${heroTopIsLight ? 'on-light' : 'on-dark'}">
        <span>${escapeHtml(property.tag || 'Exclusive Offering')}</span>
        <img src="${heroTopIsLight ? logoBlack : logoWhite}" alt="Arcadea" />
        <span>${escapeHtml(property.status || 'Off-Plan')}</span>
      </div>
      <div class="hero-location">${escapeHtml(property.location || '')}</div>
      <div class="hero-title">${escapeHtml(property.title)}</div>
      <div class="hero-stats">
        ${stats.map((s) => `<div class="cell"><div class="value">${escapeHtml(String(s.value))}</div><div class="label">${escapeHtml(s.label)}</div></div>`).join('')}
        <div class="cell"><div class="label price-label">${property.price?.enquiryOnly ? '' : 'Starting From'}</div><div class="value">${escapeHtml(priceParts.amount)}</div>${priceParts.subtext ? `<div class="price-subtext">${escapeHtml(priceParts.subtext)}</div>` : ''}</div>
      </div>
    </div>
    <div class="intro">
      <div>
        <div class="eyebrow">The Residence</div>
        <h2>Welcome to<br/>${escapeHtml(property.title)}.</h2>
      </div>
      <div>
        ${descriptionParagraphs.map((p) => `<p>${escapeHtml(p)}</p>`).join('')}
      </div>
    </div>
    <div class="footer">
      <img src="${logoBlack}" alt="Arcadea" />
      <span>01 / 02</span>
    </div>
  </div>

  <div class="page">
    <div class="bar">
      <span>${escapeHtml(property.title)}${property.address ? ` / ${escapeHtml(property.address)}` : ''}</span>
      <span>${escapeHtml(property.location || '')}</span>
    </div>

    ${page2Photos[0] ? `<img class="photo-hero" src="${page2Photos[0].url}" />` : ''}
    ${sidePhotos.length ? `<div class="photo-row">${sidePhotos.map((g) => `<img src="${g.url}" />`).join('')}</div>` : ''}

    <div class="columns">
      <div>
        <div class="eyebrow">Features</div>
        <ul>
          ${(property.features || []).map((f) => `<li>${escapeHtml(f)}</li>`).join('')}
        </ul>
      </div>
      <div>
        <div class="eyebrow">Particulars</div>
        ${particulars.map((f) => `<div class="p-row"><span>${escapeHtml(f.label)}</span><span>${escapeHtml(f.value)}</span></div>`).join('')}
      </div>
    </div>

    <div class="enquiries">
      <div>
        <div class="eyebrow">Enquiries</div>
        <h3>${escapeHtml(property.ctaLabel || 'Private Viewings by Appointment')}</h3>
      </div>
      ${agent ? `
      <div class="contact-block">
        <div class="name">${escapeHtml(agent.name)}</div>
        <div class="role">Agent</div>
        ${agent.phone ? `<div class="line">${escapeHtml(agent.phone)}</div>` : ''}
        ${agent.email ? `<div class="line">${escapeHtml(agent.email)}</div>` : ''}
      </div>` : '<div></div>'}
      <div class="contact-block">
        <div class="name">${escapeHtml(AGENCY.name)}</div>
        <div class="role">Agency</div>
        <div class="line">${escapeHtml(AGENCY.phone)}</div>
        <div class="line">${escapeHtml(AGENCY.email)}</div>
      </div>
    </div>

    <div class="disclaimer">Disclaimer: Images are artist impressions and indicative only. Information is provided in good faith and does not form part of any contract.</div>

    ${qrDataUri ? `
    <div class="page-qr">
      <span>Scan to View Listing</span>
      <img src="${qrDataUri}" alt="QR code to the listing page" />
    </div>` : ''}

    <div class="footer">
      <img src="${logoBlack}" alt="Arcadea" />
      <span>ARCADEA.COM.AU &middot; 02 / 02</span>
    </div>
  </div>

</body>
</html>`;
}

async function main() {
  const slug = process.argv[2];
  if (!slug) {
    console.error('Usage: npm run brochure -- <propertyId|_id> [--upload]');
    process.exit(1);
  }

  const property = await client.fetch(QUERY, { slug });
  if (!property) {
    console.error(`No published property found with propertyId or _id "${slug}"`);
    process.exit(1);
  }

  const logoWhite = toDataUri('src/assets/brand-logo-white.png');
  const logoBlack = toDataUri('src/assets/brand-logo-black.png');

  const particulars = (property.quickFacts || [])
    .filter((f) => f.label && f.value)
    .map((f, i) => ({ ...f, order: f.order ?? i }))
    .sort((a, b) => a.order - b.order);

  const fullDescription = (property.description || '').trim();
  const descriptionParagraphs = truncateText(fullDescription, 620)
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);

  const galleryImages = (property.gallery || []).filter((g) => g.url);
  const agent = (property.agents || [])[0];

  const heroPhoto = property.heroImage || galleryImages[0]?.url;
  const heroTopIsLight = await sampleHeroTopIsLight(heroPhoto);

  const qrDataUri = await QRCode.toDataURL(`${SITE_URL}/project/${property.propertyId}`, {
    margin: 0,
    width: 300,
    color: { dark: '#1a1a1a', light: '#ffffff' },
  });

  const html = renderHtml({ property, particulars, descriptionParagraphs, galleryImages, agent, logoWhite, logoBlack, heroTopIsLight, qrDataUri });

  const outDir = path.join(ROOT, 'brochures');
  fs.mkdirSync(outDir, { recursive: true });
  const outPath = path.join(outDir, `${property.propertyId}.pdf`);

  // --no-sandbox is required on GitHub-hosted runners, which don't support
  // Chrome's unprivileged-namespace sandbox out of the box (it refuses to
  // launch at all otherwise: "No usable sandbox!"). The runner is a
  // disposable container rendering our own known-good HTML — not a
  // meaningful attack surface — so this is the standard, documented
  // workaround rather than a real security tradeoff.
  const browser = await puppeteer.launch({
    headless: true,
    args: process.env.CI ? ['--no-sandbox', '--disable-setuid-sandbox'] : [],
  });
  try {
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });
    await page.pdf({ path: outPath, format: 'A4', printBackground: true });
    console.log(`Brochure generated: ${outPath}`);
  } finally {
    await browser.close();
  }

  if (process.argv.includes('--upload')) {
    await uploadBrochureToSanity(property, outPath);
  }
}

// Uploads the PDF to Sanity and attaches it to the property's Resources
// field under a fixed key, so re-running on the next publish replaces this
// script's own prior upload instead of accumulating duplicates — any
// resource a human added by hand keeps its own key and is left alone.
// Dynamic import so a plain `npm run brochure` (no --upload) never requires
// a write token — sanityWriteClient.js exits the process if one is missing.
async function uploadBrochureToSanity(property, pdfPath) {
  const { writeClient } = await import('./sanityWriteClient.js');

  const asset = await writeClient.assets.upload('file', fs.readFileSync(pdfPath), {
    filename: `${property.propertyId}-brochure.pdf`,
    contentType: 'application/pdf',
  });

  const existingResources = (await writeClient.fetch(`*[_id == $id][0].resources`, { id: property._id })) || [];
  const keptResources = existingResources.filter((r) => r._key !== AUTO_BROCHURE_KEY);

  await writeClient
    .patch(property._id)
    .set({
      resources: [
        ...keptResources,
        {
          _key: AUTO_BROCHURE_KEY,
          _type: 'object',
          label: 'Brochure',
          file: { _type: 'file', asset: { _type: 'reference', _ref: asset._id } },
        },
      ],
    })
    .commit();

  console.log(`Brochure uploaded to Sanity and attached to "${property.title}" (${property._id}).`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
