# Arcadea Property: Visual Style Guide (for video / Remotion)

This guide describes the visual language of arcadea.com.au so other work, especially Remotion videos, looks like it came from the same brand. Every value here is taken from the live website code. The source files are listed at the end.

---

## 1. The feel in one paragraph

Quiet luxury. A near-black canvas, generous empty space, large photography with rounded corners, and **thin, light headings** set in sentence case. Gold is used sparingly, as an accent rather than a fill: small letter-spaced labels, hairline rules, outlines and the odd highlighted word. Motion is slow and smooth, never bouncy: things fade up gently, photos drift and zoom slightly, and heroes ease from full-bleed into rounded cards. Nothing shouts. If a frame feels busy, loud or bold, it isn't on-brand.

---

## 2. Colour

Dark is the default and primary theme. Use it for video unless there's a specific reason not to.

### Core palette (dark theme)
| Role | Hex | Notes |
|---|---|---|
| Background | `#0a0a0a` | The main canvas. Never pure `#000`. |
| Surface (cards, panels) | `#141414` | One step up from the background |
| Surface 2 | `#1f1f1f` | Rarely used |
| Hairline / border | `#2a2a2a` | 1px dividers and card outlines |
| Text, primary | `#ffffff` | Headings and key text |
| Text, secondary | `#a0a0a0` | Body copy, descriptions |
| Text, muted | `#666666` | Fine print and footnotes |

### Gold (the only brand accent)
| Name | Hex | Use |
|---|---|---|
| Gold | `#85714d` (rgb 133, 113, 77) | Fills on hover, outline borders, light-theme accents |
| Gold light | `#a68d60` | **Default gold on dark backgrounds**: eyebrows, rules, underlines, icons |
| Gold on photos | `#d6c08a` | Brighter gold for text that sits **on photography** (dark scrim behind) |
| Gold dark | `#66573b` | Rare; gradient end-stop |

Gold rules:
- Use it for accents only: eyebrow labels, 1px rules and underlines, outline borders, a single highlighted word or phrase in a title, and small icons.
- **Never** use it for large solid fills, big bold gold headlines, or gradients across the whole frame.
- **Gold wash panel**, the one "filled" gold treatment: `linear-gradient(135deg, rgba(133,113,77,0.12) 0%, #141414 60%)` with a `1px solid rgba(133,113,77,0.35)` border. It's used for feature panels and stat callouts.
- **Soft gold button fill:** `rgba(133,113,77,0.35)` with backdrop blur, on primary buttons over photos.

### Secondary accents (sparingly, never on their own)
| Name | Hex | Where it appears |
|---|---|---|
| Slate blue | `#4d6185` (rgb 77, 97, 133) | Wave layers, the One Park Lane intro glow |
| Teal | `#4d7d85` (rgb 77, 125, 133) | Wave layers, the One Park Lane intro glow |

These only ever appear **together with gold** as translucent, blurred layers (the "waves" and the "glows", see §6). They are never used for text or buttons.

### Light theme (if ever needed)
Background `#ffffff`, surface `#f5f5f5`, borders `#dcdcdc`, text `#0a0a0a` / `#444444` / `#888888`. On light backgrounds gold text uses `#85714d`, not the light variant. Photography keeps its **dark** scrim in both themes, with white text on photos.

---

## 3. Typography

Two Google Fonts:

| Role | Font | Weights in use |
|---|---|---|
| Headings, display, big numbers | **Josefin Sans** | **300 (light)** for almost everything; 200 for giant decorative numerals; 400 occasionally for small subheads |
| Body, UI, labels, buttons | **Urbanist** | 400 body, 500 nav and links, 600 labels and buttons |

### The type system
| Element | Font | Size (desktop → small) | Weight | Case | Tracking |
|---|---|---|---|---|---|
| Hero title | Josefin Sans | 72–120px (clamp ~4.5–7.5rem) | 300 | Sentence case | -0.01 to -0.02em |
| Section title | Josefin Sans | 36–48px | 300 | Sentence case | normal |
| Card title | Josefin Sans | 24–26px | 300 | Sentence/Title case | normal |
| Big stat number | Josefin Sans | 56–96px | 300 | n/a | tabular numbers |
| **Eyebrow** (small label above titles) | Urbanist | 12–13px | 600 | **UPPERCASE** | **0.35–0.4em** (very wide) |
| Body | Urbanist | 16–18px | 400 | Sentence case | normal, line-height 1.7–1.85 |
| Button / text-link label | Urbanist | 13–14px | 600 | UPPERCASE | 0.15em |
| Meta line ("29 September 2026 · 4 min read") | Urbanist | 11–12px | 500–600 | UPPERCASE | 0.2em, in gold |

Rules:
- **Headings are thin (300) and in sentence case.** Never bold, never ALL CAPS. All-caps belongs only to small, widely letter-spaced labels.
- The classic hierarchy is: **gold eyebrow** (tiny, uppercase, wide tracking) → **thin large title** (white) → **grey body** (`#a0a0a0`).
- Titles are short and often end with a full stop, like statements: *"Two collections. One standard."*, *"This page has moved on."*, *"Let's find your next address."*
- To highlight, put **one word or phrase in gold** at the same thin weight: *"The Architect of **Wealth & Lifestyle**"*, *"The Luc **Private Sales**"*.
- Keep title line length short (max ~14–20 characters per line on hero titles, wrapping onto 2–3 lines).

---

## 4. Layout and spacing

- **Content width:** 85% of the frame width (90% on narrow formats), capped at 1600px, centred. Text, cards and the logo all share this left edge, which is a strong alignment line.
- **Generous whitespace:** sections are separated by 100–130px of empty space, not by lines or background bands.
- **Alignment:** heroes are either centred (feature titles) or left-aligned to the content edge (home, projects, editorial). Section headers above grids are centred; long-form content is left-aligned.
- **Grids:** 3 columns for cards; 2 columns for panels; 60/40 split for paired feature images.
- **Thin rules:** 1px hairlines (`#2a2a2a`, or gold at 35–50% opacity) separate list items and stat columns.

---

## 5. Shapes, surfaces and imagery

**Corner radii:**
- 40px on large photo cards, feature panels and banners
- 24px on medium cards (listings, gallery images, stat cards, video frames)
- 20px on smaller tiles
- 999px (full pill) on tags and filter chips

**Buttons are square-cornered**, which contrasts with the rounded cards.

**Cards on photography:** a photo with a dark scrim, `rgba(0,0,0,0.6)` flat or a directional gradient, with white text on top. The photo starts at `scale(1.05)` and eases to `scale(1)` (or 1.03 → 1.08) on hover. That slow zoom is a signature move.

**Scrims for legibility over photos:**
- Centre vignette: `radial-gradient(circle at center, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.7) 100%)`
- Text bottom-left: `linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.25) 55%, transparent 80%)` plus `linear-gradient(90deg, rgba(0,0,0,0.45) 0%, transparent 65%)`
- Text on the left: `linear-gradient(90deg, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.45) 55%, rgba(0,0,0,0.25) 100%)`
- Thin text over bright skies: add `text-shadow: 0 2px 18px rgba(0,0,0,0.55)`

**Pills and tags:** a 1px border (`#2a2a2a`, or gold for the active one), transparent background, uppercase 11px Urbanist 600, 0.15em tracking. A tag on a photo is a frosted glass pill: `rgba(10,10,10,0.45)` with blur(10px) and a `rgba(255,255,255,0.2)` border.

**Photography subjects:** Gold Coast skylines and beaches, Bali villas and pools, luxury interiors, aerials. Warm, golden-hour light. The photos live in Sanity CMS (see §9).

---

## 6. Signature motifs (use these to make videos feel unmistakably Arcadea)

1. **The cinematic shrink.** A full-bleed photo or video eases into a rounded card: scale 1 → 0.85, corner radius 0 → 40px. Its text fades out (opacity 1 → 0 over the first half) and lifts 100px. This is the hero on almost every page. It makes a perfect video opener or transition.
2. **Eyebrow → thin title → grey line.** The three-tier text block above (§3). Use it for every title card.
3. **Gold hairlines.** 1px gold rules under active items, between stat columns, as list bullets (a 12px gold dash), and as the underline on text links.
4. **Text links with an arrow:** `VIEW PROPERTIES →` in uppercase Urbanist 600, tracking 0.15em, with a 1px gold underline about 6px below.
5. **Waves (Coastal/Island collections):** three to five translucent SVG wave layers drifting horizontally at different speeds (7s, 10s, 13s, 20s loops). The colours are gold `rgba(133,113,77,0.55)`, slate `rgba(77,97,133,0.5)`, teal `rgba(77,125,133,0.45)` and gold `rgba(133,113,77,0.35)`. They lap along the bottom edge of a photo banner. Wave path: `M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z` (viewBox `0 24 150 28`).
6. **Glows:** large blurred radial blobs (blur 80px) in gold, teal and slate drifting slowly over `#08090c`, with a frosted glass layer on top. Used as the One Park Lane intro background.
7. **Giant faint wordmark:** the ARCADEA wordmark (or "404"-style numerals) spanning the full content width at **7–10% opacity**. Use it as an end-card or background signature.
8. **Count-up stats:** large thin numbers that ease from 0 to the value over about 2s with an ease-out cubic. They sit between gold hairline dividers, with an uppercase grey label below.

---

## 7. Motion

The site's motion is **slow, smooth and confident**. There are no bounces, overshoot, spins or flashy wipes.

| Motion | Values from the site |
|---|---|
| Reveal on scroll (default entrance) | opacity 0 → 1 and translateY 40px → 0 over **1s**, easing `cubic-bezier(0.16, 1, 0.3, 1)` (expo-out) |
| Stagger between siblings | **100ms** steps (100, 200, 300…) |
| Photo zoom | scale 1.05 → 1.0 (or 1.03 → 1.08) over **1.2s**, easing `cubic-bezier(0.2, 0.8, 0.2, 1)` |
| Hover and colour changes | 0.3s ease |
| Card text reveal | opacity 0 → 1 and translateY 20px → 0 over 0.6s, `cubic-bezier(0.2, 0.8, 0.2, 1)` |
| Hero shrink | linear with scroll progress over the first ~600px, mapped as in §6.1 |
| Count-up | 2s, ease-out cubic `1 - (1 - t)^3` |
| Crossfade (lightbox) | opacity over 0.45s, ease |
| Title sequence (One Park Lane) | words fade up one at a time: opacity 0 → 1 and translateY 30px → 0, each word starting about 15% of the timeline after the previous |
| Waves | continuous horizontal drift, `cubic-bezier(.55,.5,.45,.5)`, 7–20s loops |

Rhythm: hold title cards long enough to read comfortably (2.5–4s). Let things settle before the next element arrives. Generally one idea per scene.

---

## 8. Voice (for any on-screen copy)

- **Calm, confident and understated.** Short declarative statements. For example: *"Curated coastal and island property across Australia and Bali."*
- Sentence case with full stops for titles. No exclamation marks and no hype words ("AMAZING", "DON'T MISS").
- **Brand tagline:** *Exquisite Living, Refined Investments.*
- **Collections:** *The Coastal Collection* (Gold Coast, "Lifestyle, Legacy, Prestige") and *The Island Collection* (Bali, "Paradise that Pays").
- **Compliance:** any investment figures need the same care as the website, e.g. "Illustrative only. Not financial advice." Arcadea Property's licence line is "Licensed Real Estate Agent No. 4857148".

---

## 9. Assets

All of these are in the website repo at `src/assets/`:

| File | Size | Notes |
|---|---|---|
| `brand-logo-white.png` / `brand-logo-black.png` | 3125×1875 | ARCADEA wordmark. **Mostly empty space:** the lettering spans **x 104–3020, y 800–1075** (2916×276). Crop to that box. |
| `coastal-logo-white.png` / `-black.png` | 3125×1875 | "The Coastal Collection by Arcadea" logo (the same padded canvas) |
| `island-logo-white.png` / `-black.png` | 3125×1875 | "The Island Collection by Arcadea" logo |
| `big-a.png` | 1200×867 | The stylised "A" monogram |
| `Timeline-1.mp4` | ~27MB | Home page hero video (Gold Coast coastline) |

**Cropping the wordmark** to a given lettering height `h`:
- Box: `width = h × 10.565`, `height = h`, overflow hidden
- Image inside: `height = h × 6.793`, `margin-left = -h × 0.3768`, `margin-top = -h × 2.8986`

**Rule:** use white logos on dark frames and on photos (which always carry a dark scrim), and black logos only on light backgrounds.

**Photography:** project images, collection hero photos and page images are stored in **Sanity** (project `b6pkfjxp`, dataset `production`). They're served from `cdn.sanity.io`, and you can add `?w=1920&fm=jpg&q=85` to the URL to size them.

---

## 10. Remotion translation notes

- **Fonts:** load them with `@remotion/google-fonts`:
  ```ts
  import { loadFont as loadJosefin } from '@remotion/google-fonts/JosefinSans';
  import { loadFont as loadUrbanist } from '@remotion/google-fonts/Urbanist';
  const { fontFamily: heading } = loadJosefin('normal', { weights: ['200', '300', '400'] });
  const { fontFamily: body } = loadUrbanist('normal', { weights: ['400', '500', '600'] });
  ```
- **Easing:** recreate the site's curves with `Easing.bezier(...)` inside `interpolate`:
  - Reveal: `Easing.bezier(0.16, 1, 0.3, 1)`
  - Photo zoom: `Easing.bezier(0.2, 0.8, 0.2, 1)`
- **Springs:** if you use `spring()`, set **high damping** (for example `{ damping: 200 }`) so there's no overshoot. Bouncy springs are off-brand.
- **Timing at 30fps:** reveal ≈ 30 frames, stagger ≈ 3 frames, photo zoom ≈ 36 frames, title hold ≈ 75–120 frames.
- **Ken Burns:** a slow `scale(1.05 → 1.0)` or `(1.0 → 1.06)` across the whole shot duration, with a gentle pan, matches the site's photo zoom.
- **Safe layout:** keep text inside the 85% content width.
  - **16:9:** left-align title blocks to the 7.5% margin.
  - **9:16:** use 90% width, centre-align short title cards, and keep text clear of the top 12% and bottom 18% for platform UI.
- **Default canvas:** background `#0a0a0a`, never pure black.

### Suggested scene recipes
1. **Opener:** a full-bleed video or photo with the centre vignette. The gold eyebrow (e.g. `SOUTHPORT, GOLD COAST`) fades up, then the thin title, then a grey subline. Finish with the cinematic shrink to a 40px-radius card.
2. **Stat card:** a gold-wash panel holding a count-up number (Josefin 300, 96px), a gold hairline and an uppercase grey label. Show two or three side by side with gold vertical dividers.
3. **Property card:** a rounded 24px photo with a frosted pill tag, a gold uppercase location line, a thin title, a grey price and a `VIEW DETAILS →` text link.
4. **Collection banner:** a rounded 40px photo with the white collection logo centred and the gold, slate and teal waves drifting along the bottom edge.
5. **End card:** the `#0a0a0a` background with the large thin tagline *"Exquisite Living, Refined Investments"*, a gold `ARCADEA.COM.AU` eyebrow, and the giant wordmark at 8% opacity across the bottom.

### Do / Don't
**Do:**
- Use thin type with lots of space and gold accents.
- Use rounded photo cards and slow zooms with soft fades.
- Use one highlighted gold phrase per title.
- Keep everything aligned to one left edge.

**Don't:**
- Use bold or all-caps headlines, or large gold fills.
- Use bright colours, or teal and slate on their own.
- Use bouncy or elastic motion, fast cuts or glitch effects.
- Use drop-shadowed or 3D text, emoji, or stock "luxury" fonts like script or serif.

---

### Source of truth (website repo)
- Design tokens: `src/variables.css`
- Shared editorial blocks (eyebrow, titles, cards, panels): `src/pages/EditorialPage.css`
- Cinematic hero: `src/components/CinematicHero.jsx` and `.css`
- Waves: `src/pages/PropertiesPage.jsx` and `.css` (`.listing-hero-waves`)
- Glows and title sequence: `src/pages/OneParkLanePage.jsx` and `.css`
- Count-up stats: `src/pages/AboutPage.jsx` (`StatCounter`)
- Footer wordmark crop: `src/components/Footer.css`
