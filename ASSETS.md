# Kestrel Systems website — asset list

Everything the site needs, with sizes. **Status** shows what is in the package today:
**Placeholder** = a working stand-in is already in the folder and the site runs with it; **Needed** = not yet supplied (the site degrades gracefully without it).

Rules from the brand guidelines that apply to every file: use the supplied master artwork and never redraw the mark; keep clear space of 1× the height of the "K" around the logo; only navy `#141B31`, gold `#B89C5B`, off-white `#F2F1EC` and their tints.

## 1. Logo (vector, SVG only)

| File | Artboard / size | Used for | Status |
|---|---|---|---|
| `assets/logo/kestrel-horizontal-gold.svg` | 380 × 88 (shown at 190 × 44 header, 52 px high footer; minimum width 120 px) | Header and footer on navy | Placeholder |
| `assets/logo/kestrel-horizontal-white.svg` | 380 × 88 | One-colour use on photos or gold | Placeholder |
| `assets/logo/kestrel-horizontal-navy.svg` | 380 × 88 | One-colour use on off-white, emails, print | Placeholder |
| `assets/logo/kestrel-vertical-gold.svg` | 260 × 190 | Square or narrow layouts, social profile | Placeholder |
| `assets/logo/kestrel-vertical-white.svg` | 260 × 190 | Same, one-colour | Placeholder |
| `assets/logo/kestrel-mark-gold.svg` / `-white` / `-navy` | 88 × 88 | Falcon mark alone (icons, structured data) | Placeholder |

The placeholders use a neutral diamond, **not** the falcon. Export the real files from the master artwork with these names and the site picks them up with no code change. Text in the logo must be outlined (converted to paths).

## 2. Icons and favicons

| File | Size | Used for | Status |
|---|---|---|---|
| `assets/icons/favicon.svg` | 88 × 88 viewBox | Modern browsers | Placeholder |
| `assets/icons/favicon-32.png` | 32 × 32 | Browser tab fallback | Placeholder |
| `assets/icons/apple-touch-icon.png` | 180 × 180 | iOS home screen | Placeholder |
| `assets/icons/icon-192.png` | 192 × 192 | Web app manifest | Placeholder |
| `assets/icons/icon-512.png` | 512 × 512 | Web app manifest, install prompts | Placeholder |
| `assets/icons/icon-512-maskable.png` | 512 × 512, mark inside the centre 80 % | Android adaptive icon (optional) | Needed (optional) |
| `assets/icons/favicon.ico` | 16, 32, 48 multi-size | Legacy browsers (optional) | Needed (optional) |
| `assets/icons/lms.svg`, `qrms.svg`, `sms.svg` | 48 × 48, 2.2 px stroke | Product icons | Final (drawn for this site) |

App icon pattern from the guidelines: mark centred on a rounded square in navy, gold or white, with generous padding, no wordmark.

## 3. Social sharing

| File | Size | Notes | Status |
|---|---|---|---|
| `assets/img/og-image.png` | 1200 × 630, under 300 KB | Used for link previews (Facebook, LinkedIn, WhatsApp, X) | Placeholder |
| `assets/img/og-lms.png`, `og-qrms.png`, `og-sms.png` | 1200 × 630 each | Per-product previews (optional) | Needed (optional) |

Keep important content inside the central 1000 × 500 area.

## 4. Brand graphics

| File | Size | Notes | Status |
|---|---|---|---|
| `assets/img/pattern-navy.svg` | Tile 120 × 69 | Subtle pattern on navy sections | Placeholder (approximation) |
| `assets/img/pattern-light.svg` | Tile 120 × 69 | Same, for light sections | Placeholder (approximation) |

Replace both with the master pattern from the brand pack, exported as a seamless tile.

## 5. Product imagery

The product pages currently draw an illustrative dashboard in CSS. Real screenshots are better once the products are presentable.

| File | Size | Notes | Status |
|---|---|---|---|
| `assets/img/lms-hero.webp`, `qrms-hero.webp`, `sms-hero.webp` | 1600 × 1000 (16:10), under 150 KB each | Main screenshot in each product hero | Needed |
| `assets/img/{lms,qrms,sms}-1.webp` … `-3.webp` | 1200 × 750 (16:10), under 120 KB each | Secondary screenshots (courses, analytics, fees, and so on) | Needed (optional) |

Capture at 2× and downscale. Use realistic but fictional data, and avoid real people's names.

## 6. About page

| File | Size | Notes | Status |
|---|---|---|---|
| `assets/img/team-01.webp` … `team-03.webp` | 800 × 800 (1:1), under 80 KB each | Team portraits, shown at about 360 px | Needed |
| `assets/img/about-story.webp` | 1600 × 900 (16:9), under 200 KB | Optional workspace or team image | Needed (optional) |

## 7. Social proof (add when available)

| File | Size | Notes | Status |
|---|---|---|---|
| `assets/img/clients/*.svg` | Height 32 px, one colour | Client logos (with permission) | Needed (later) |

## 8. Fonts

| File | Notes | Status |
|---|---|---|
| `assets/fonts/Baradig-Medium.woff2`, `Baradig-Bold.woff2` | Brand primary typeface; needs a web licence. Used for labels and plan names. | Needed. Falls back to Space Grotesk |
| Space Grotesk 400 / 500 / 600 / 700 | Currently loaded from Google Fonts. Self-host the woff2 files if you want no third-party requests. | Working (Google Fonts) |

The brand book names "Grotesk" for body text and Poppins Light for letters. I read "Grotesk" as Space Grotesk; please confirm. Poppins is only needed for letterhead documents, not the website.

## 9. Documents (optional, later)

| File | Size | Notes |
|---|---|---|
| `downloads/kestrel-lms-brochure.pdf`, `qrms`, `sms` | A4, under 2 MB | Product one-pagers for the "Learn more" pages |
| `downloads/kestrel-company-profile.pdf` | A4 | Optional |

## 10. Technical files (already included)

`robots.txt`, `sitemap.xml`, `site.webmanifest`, `404.html`, `js/pricing.js` (all prices). Before launch, set the real domain in `sitemap.xml`, `robots.txt` and the `canonical`/`og:url` tags (currently `https://www.kestrelsystems.com`).

## Budgets

Under 1.5 MB for a first page load. Images in WebP (or AVIF), SVG for everything vector, and `loading="lazy"` on images below the fold.
