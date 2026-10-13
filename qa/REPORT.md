# Verification report - BALLOON 2.0

Date: 13 October 2026. Environment: Windows, Node 24.18.0, installed Google Chrome, local Vite production preview. The original checkout was clean and the redesign was made on `feature/portfolio-redesign`.

## Original audit

Static HTML/CSS/Sass; no package manifest, build or test scripts. Empty unconnected JavaScript, placeholder navigation, no working booking workflow, unmarked invented testimonials, autoplay video and assets with no license provenance. The legacy index and source materials remain historical only and are not shipped in dist.

## Executed checks

- ESLint and HTML Validate: pass after correcting markup.
- Node unit tests: 6 pass (tour prices, participant boundaries, valid requests, rolling dates across year boundaries, impossible/past/out-of-range dates, contacts and acknowledgement).
- Playwright: 3 pass, covering tour dialogs, Escape and focus restoration, tour selection, invalid form focus, live totals, review/edit/completion, text-safe rendering, cleared contact fields, no POST requests and empty browser storage.
- Responsive checks: 320, 375, 768, 1024 and 1440 px; no horizontal overflow; all local images decode. Mobile menu links and Escape work.
- Keyboard skip link, reduced-motion CSS and no-JavaScript content fallback verified; submission is disabled without JavaScript.
- axe WCAG 2 A/AA, 2.1 AA and 2.2 AA tagged rules: zero violations in tested full pages at five widths and open tour/review dialogs.
- Console: no error-level browser messages or uncaught page errors in the booking test.
- npm audit: no known vulnerabilities at verification time. Dependency license inventory generated separately.
- Screenshots: `screenshots/balloon-1440.png` and `screenshots/balloon-375.png`; visually inspected.

## Lighthouse

Local production preview, standard mobile throttling and desktop preset. Initial mobile CLS was 0.288 due to the menu changing layout during initialization; fixed by using a stable collapsed layout. Final results:

| Category/metric | Mobile | Desktop |
| --- | --- | --- |
| Performance | 100 | 100 |
| Accessibility | 100 | 100 |
| Best Practices | 100 | 100 |
| SEO | 100 | 100 |
| Largest Contentful Paint | 1.4 s | 0.5 s |
| Cumulative Layout Shift | 0 | 0 |
| Total Blocking Time | 0 ms | 0 ms |

Lighthouse 13 additionally reports an agentic-browsing category, scoring 50 on both runs. This concept does not implement the proposed AI catalog/llms discovery files; that score is outside the four conventional website categories requested. All actual audit data is retained in the HTML and JSON reports.

## Limits and remaining work

- No production deployment initiated; main untouched. Netlify CDN, real-domain headers, crawler/social cache and hosted behavior await an approved deployment.
- Lighthouse is a lab result, not field Core Web Vitals. Scores vary by device and load.
- Automated axe checks and keyboard scenarios do not prove complete WCAG compliance. A full manual screen-reader audit and real iOS/Safari device test have not been performed.
- The social image absolute URL is configured for the existing ballony.netlify.app domain; change it for a different domain.
- Historical assets have unknown licenses and are excluded, not falsely declared cleared.
- No real operator, booking backend, contact delivery or payments are implemented by design.
- Playwright can emit Node terminal warnings about NO_COLOR/FORCE_COLOR from the runner environment; the browser console is clean.

## Netlify readiness

Static dist build is ready. `netlify.toml`: Node 24, `npm run build`, `dist`; no secrets required. Owner should confirm existing dashboard overrides and deployment branch before authorizing production.
