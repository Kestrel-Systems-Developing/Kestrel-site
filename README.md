# Kestrel Systems — static website

Plain HTML, CSS and JavaScript. No build step, no backend, no dependencies. Open `index.html` to preview, or upload the folder to any static host (Netlify, Cloudflare Pages, GitHub Pages, or a normal web server).

## Pages

| Page | Purpose |
|---|---|
| `index.html` | Home: hero, the three systems, self-hosted vs cloud, how we work |
| `solutions.html` | The marketplace: filterable product cards, all plans and pricing, comparison table |
| `lms.html`, `qrms.html`, `sms.html` | "Learn more" page per product: features, how it works, plans, FAQ |
| `about.html` | Story, mission, vision, process, team |
| `contact.html` | "Talk to our team" form, WhatsApp, email |
| `404.html` | Not-found page |

## Things you will edit most

- **Prices:** `js/pricing.js` only. Pages read from it on load.
- **Plans:** the pricing model is
  - LMS and QRMS: Self-Hosted (one-time, 6 months support), Self-Hosted + Customization (one-time, support and customization hours), Kestrel Cloud (monthly).
  - SMS: Starter, Growth and Scale, each monthly or yearly (yearly is set to 10× monthly, shown as "2 months free").
- **Colours and fonts:** variables at the top of `css/styles.css`.
- **Contact details:** search for `kestrelsystems.official@gmail.com` and `966544488142`.

## The contact form (no backend)

Submitting opens the visitor's email app with the message prefilled, with a copy button and a WhatsApp link as fallback. When you add a backend or a form service, replace the body of `sendMessage()` in `js/main.js`. Links from plan buttons prefill the product and plan (for example `contact.html?product=LMS&plan=Kestrel%20Cloud`).

## Still placeholder

Logos (diamond stand-in, not the falcon), favicon and app icons, the pattern, the Open Graph image, product visuals (drawn in CSS), team profiles, and all pricing, feature lists and FAQ answers. See `ASSETS.md` for the full list with sizes.
