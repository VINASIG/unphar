# Verification guide

`npm run check` runs strict JS/JSDoc and TypeScript, typed ESLint, CSS and HTML validation, formatting and shared-snapshot integrity. `npm test` checks archive round trips, signatures, Unicode, timestamps, malformed lengths, unsafe paths, CRC damage, input/expanded limits and deflate bombs. `npm run test:php` independently reads the generated PHAR with PHP and parses six native PHP fixtures, including a multibyte PHP stub and SHA-1/SHA-256/SHA-512 with plain/deflate contents.

Build before `npm run test:browser`. Playwright starts and stops only its own loopback preview on an available port. The support matrix is Chromium, Firefox and WebKit. Local `BROWSER_ENGINES=chromium,webkit` may record a local unavailable-engine limit; CI rejects omissions and runs all three engines on both operating systems.

## Browser matrix

The single product route is `/unphar/`. Relative assets are also checked from root hosting and a local `file://` folder. There are no authentication pages, menus, tabs or modals.

- Required viewports are 360×800, 390×844, 768×1024, 1024×768 and 1440×900.
- Reflow includes 320 CSS px, 440/600/900 intermediate widths, both sides of the actual 480 px breakpoint and additional 767/1023/1439 neighbors.
- Each responsive width checks normal and 200% root text in idle, format-notes open, malformed ZIP/error recovery and a long UTF-8 filename/content-path success state. Full-page screenshots and document geometry are both required. Archive contents have an intentional vertical scroll region; paths wrap rather than creating page-wide horizontal scrolling.
- Browser flows use file selection by keyboard, touch, ZIP-to-PHAR-to-ZIP download contents, both themes and normal/reduced motion. The touch test observes actual disabled loading controls and retry after an error. axe-core runs in idle and successful expanded states. An axe pass does not prove full WCAG conformance.
- Offline local-file conversion is tested without a server. Processing requests are observed to stay local. Static HTML metadata, canonical URL, sitemap, relative asset paths, local font and favicon loading are checked.

Before/after screenshots stay under ignored `output/responsive/`, named with route, viewport, engine, text size and state. Open and inspect images in addition to running assertions. No automatic visual baseline is accepted by this repository. Playwright reports and retained failure traces stay under `output/playwright/`.

`npm run test:performance` keeps three mobile and three desktop cold lab reports and enforces median LCP ≤2,500 ms, CLS ≤0.1 and TBT ≤200 ms. The performance script can reproduce the pre-standardization source snapshot with `--baseline`. Reports record browser, viewport, CPU/network simulation and variability. Field INP/CrUX, physical phones, screen readers and an independent SI-agent trial remain separate from these deterministic checks.
