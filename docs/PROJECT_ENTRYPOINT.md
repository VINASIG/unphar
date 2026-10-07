# Work on VINASIG Unphar

Read `README.md`, `docs/STANDARDS.md`, `docs/BRAND.md` and `docs/TOOLCHAIN.md` before changing this static browser application.

- Preserve unrelated changes and use the existing branch. Commit, push and publish within the user's current authorization.
- Keep public product copy in reviewed Vietnamese and English. Keep source, technical documentation and commit subjects in English. Answer Vietnamese users in Vietnamese. Use SI agents and Super Intelligence in new VINASIG copy, while preserving official external names and identifiers.
- Keep plain HTML/CSS/JavaScript and local-only archive processing. Do not add a framework, upload service, account flow, analytics or remote font for routine changes.
- Use local Space Grotesk, Lucide for interface SVGs and Simple Icons only for needed third-party brand marks. Preserve supplied VINASIG artwork and third-party notices. This product adopts the design system's Bright Playful Minimalism proposal; it does not approve every draft for the organization.
- Keep both PHAR-to-ZIP and ZIP-to-PHAR flows usable by keyboard and touch. Native details show format limitations and archive contents. Fix wrapping and intrinsic sizing at their source; never conceal page overflow.
- Never evaluate a PHP stub or deserialize archive metadata. Validate bounds, paths, sizes, compression, CRC32 and supported signatures before publishing a result. Keep memory and decompression limits enforced, recover from errors and prevent overlapping conversions. ZIP conversion cannot restore an original executable PHAR stub.
- Keep runtime vendor files local and pinned. Strict JSDoc checking applies to `archive.js` and `script.js`; development scripts use TypeScript. Preserve the browser's classic-script loading so a downloaded `dist/` folder can open without a server.
- Run `npm run check`, `npm test`, `npm run test:php` and `npm run build`. Before publishing UI changes run `npm run test:browser` and inspect actual screenshots. Use all three browser engines in CI. An unavailable local engine is NOT_RUN, not a pass.
- Include the five standard viewports, 320 px, real breakpoint neighbors, enlarged text, light/dark, normal/reduced motion, keyboard/touch, idle/error/loading/success and long filenames. Capture and open screenshots, scroll through the full page, inspect geometry and retain before evidence in ignored `output/responsive/`.
- Run `npm run test:performance` for changes affecting loading or processing. Keep comparable lab reports; do not claim field metrics or physical-device validation from emulation.
- Publish only the allowlisted `dist/` folder after checks pass. Never publish the whole repository or `output/`. Preserve Git history and review the exact staged diff. Verify pushed HEAD, CI and Pages deployment for the same revision.
- Read `LICENSE_STATUS.md` before promising reuse rights. Report PASS, FAIL, NOT_RUN or NOT_APPLICABLE with actual evidence. A static standards-integrity check does not prove fresh Codex skill discovery or an independent SI-agent trial.

## Canonical domain

The owner authorized the custom-domain migration on 4 October 2026. Publish this site at https://unphar.vinasig.io.vn/ with an origin-root base. Preserve that domain in canonical/social metadata, sitemap, robots, package homepage, preview and browser assertions. Keep GitHub repository/source links intact. Read docs/DOMAIN.md. GitHub Actions deploys through the repository Pages custom-domain setting; a CNAME file alone does not configure an Actions deployment.

## Language and appearance

Read `docs/LOCALIZATION.md`. Both locales must include navigation, accessible names, validation, loading and result copy. Keep native reciprocal language links and locale metadata. Preserve technical identifiers, code and user content. Only finite theme/language preferences use parent-domain cookies or local fallback under WEB-011. Never save or send measurements, files or generator content. Verify both locales and themes before publishing.

## Shared header and footer

Read docs/SITE_CHROME.md before header or footer changes. Keep shared chrome consistent and run npm run test:chrome.
