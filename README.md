# BALLOON 2.0 - NULLEXWEB portfolio concept

A complete redesign of the original HTML/CSS/Sass learning project into an editorial Cappadocia travel concept. This is not a travel business: all experiences, prices, durations, dates and availability are illustrative. There are no real reservations, payments, testimonials or customer claims.

## Local development

Requires Node.js 24 and npm. From this repository:

```sh
npm ci
npm run dev
```

Open the Local URL printed by Vite (normally http://127.0.0.1:5173).

```sh
npm run lint
npm test
npm run build
npm run preview
npm run test:e2e
npm run licenses
npm audit
```

Browser tests use installed Google Chrome. On a machine without Chrome, install Playwright Chromium with `npx playwright install chromium` and remove `channel: 'chrome'` from playwright.config.js. Production preview normally uses port 4173.

## Features

- Responsive editorial design, warm palette, system fonts, custom SVG brand mark and local WebP photography.
- Three illustrative experiences, accessible native tour dialogs, mobile navigation and FAQ.
- Rolling demo dates (tomorrow through 90 days), 1-8 participants and per-person EUR demo totals.
- Inline validation, error focus, editable request summary and explicit demo completion.
- Contact values stay in this tab's memory, are rendered as text and are cleared after completion. No network submissions, cookies, browser storage, analytics or payment integration.
- Semantic HTML, focus states, skip link, reduced motion and graceful content fallback without JavaScript. The demo submit button is disabled without JavaScript.
- Vite production build, HTML validation, ESLint, unit tests, Playwright and axe accessibility checks.

## Structure

`index.html` and `credits.html` are production entry points. `src/main.js` handles the UI; `src/booking.js` contains independently tested pricing and validation. `src/style.css` contains the responsive design. `public/` contains verified images, the custom SVG mark, robots.txt and the social preview. `tests/` and `qa/` contain checks and evidence.

Original CSS, Sass, icons, images and empty JavaScript remain as historical source. `legacy/index.html` preserves the original page for reference only; its relative asset paths reflect its original location. These materials are not copied into dist or used by the new site. Do not publish the repository root or legacy page as the website.

## Netlify

Ready for a static Netlify deployment: `netlify.toml` sets Node 24, build command `npm run build` and publish directory `dist`. No environment variables or backend are required. It adds security headers and immutable caching for hashed assets. Existing dashboard overrides should be checked before deployment.

No production deployment has been initiated. The redesigned source is on `feature/portfolio-redesign`; main is unchanged. Do not merge or change the production branch without owner approval.

The Open Graph image currently targets https://ballony.netlify.app/og-balloon.jpg. Update this absolute URL if the site receives a different domain. The old live site will not show the redesign until an approved deployment.

## Provenance and licenses

Photos by Alex Azabache from Pexels, sources and license links in [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md) and the public credits page. The original assets have no established provenance and are excluded from production. The original README identifies the project as course practice during "Advanced CSS and Sass: Flexbox, Grid, Animations and More!"; no affiliation or endorsement is implied.

System fonts require no distributed font license. The SVG brand mark is original project artwork. There are no runtime package dependencies. Installed build/test package licenses are recorded in `qa/dependency-licenses.json` using `npm run licenses`. Dependency license files remain in their packages; do not remove them when redistributing development dependencies.

## Verification

See [qa/REPORT.md](qa/REPORT.md), the saved Lighthouse HTML/JSON reports, and screenshots. Automated checks are evidence for the tested flows, not a blanket WCAG certification or field Core Web Vitals measurement. Real booking infrastructure is intentionally outside this concept.
