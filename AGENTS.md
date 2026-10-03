# Work on VINASIG Unphar

Read `README.md`, `docs/STANDARDS.md`, `docs/BRAND.md` and `docs/TOOLCHAIN.md` before changing this static browser application.

- Preserve unrelated changes and use the existing branch. Commit, push and publish within the user's current authorization.
- Keep public product copy, source, technical documentation and commit subjects in English. Answer Vietnamese users in Vietnamese. Use SI agents and Super Intelligence in new VINASIG copy, while preserving official external names and identifiers.
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

<!-- VINASIG STANDARDS BEGIN -->
## VINASIG SI agent standards 0.1.0

Read `.vinasig/standards/policies/core.md` and `language.md` before repository work. Respect platform instructions, current user authorization and local project guidance. Preserve unrelated changes. Never invent verification or weaken a quality gate to pass.

Active profile is `web-static`. Read `.vinasig/standards/profiles/web-static.md` and the task-relevant policies. Core is valid for CLI and documentation projects and installs no browser dependencies.

Use `$vinasig-workflow` for implementation work and `$vinasig-dependencies` when adding or upgrading dependencies. Report PASS, FAIL, NOT_RUN or NOT_APPLICABLE with evidence and reasons. Commit, push and publish only within the task authorization.

For license selection, imported material or distribution changes read `policies/licensing.md` and `LICENSES.md` inside the snapshot. LIC-001 through LIC-004 require purpose-based selection, authority and dependency review, separate documentation/font/data/brand rights, consistent SPDX metadata and delivery evidence. Importing this standard does not relicense the host project.

For UI changes read `policies/web.md` inside the snapshot. Apply LANG-004/LANG-005 to all visible copy and locales. WEB-001 requires original transparent header logos matched to the actual surface, without a padded or rounded logo card. WEB-008 requires styled open dropdowns, calendars, color choosers and sliders, including safe initial HTML before scripts load. Use `$vinasig-responsive` for layout/accessibility, `$vinasig-motion` for movement, `$vinasig-search` for SEO/AEO/GEO, `$vinasig-performance` for speed, and `$vinasig-agent-readiness` for browser-agent tasks. Space Grotesk, Lucide and Simple Icons follow their separate roles. Open and inspect real screenshots.

The local manifest pins the approved snapshot. A Markdown path is a reading instruction, not an automatic import. Stop and report unresolved conflicts with mandatory policy. Record approved exceptions with owner, reason and review date.
<!-- VINASIG STANDARDS END -->