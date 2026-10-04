# VINASIG standards adoption

Adopted on 3 October 2026 for VINASIG Unphar. The owner requested organization transfer, VINASIG standardization and public publication. The project adopts the `web-static` profile while preserving its plain JavaScript architecture.

| Record            | Value                                                              |
| ----------------- | ------------------------------------------------------------------ |
| Shared repository | `VINASIG/agent-standards`                                          |
| Reviewed commit   | `00fd107bfc651d4eb9cf7f34cf5e0a9f2ee93ee9`                         |
| Preview version   | `0.1.0`                                                            |
| Bundle SHA-256    | `efe05f654da53716186663ff3186623e521003fbc82eedc624a4c46d0cc8adef` |
| Installed profile | `web-static`                                                       |
| Managed files     | 47 policy, configuration, schema, template and skill payloads      |
| Local records     | `.vinasig/manifest.json`, `.vinasig/provenance.json`               |

The installer copies an immutable snapshot and a marked root `AGENTS.md` block. Project instructions specialize it outside that block. A URL is not an automatic policy import. The seven namespaced skills are local files under `.agents/skills/`.

`npm run check:standards` verifies hashes, the manifest, profile, instruction block and 8 KiB root instruction budget. Strict JS/JSDoc and TypeScript, typed ESLint, Stylelint and HTML-validate use owner wrappers around the managed presets. Third-party bundles and archived reference packages are vendor material; they are not silently presented as checked project-authored source. New runtime source is checked without a legacy defect baseline.

Use SI agents and Super Intelligence in new VINASIG-authored copy. This naming convention does not assert a government renaming agreement or certify a model's capabilities. Official external names, technical identifiers and license notices retain their original names.

PASS means the named check actually ran successfully. FAIL retains a reproduced defect. NOT_RUN identifies unavailable or unexecuted checks. NOT_APPLICABLE requires a scope reason. Source integrity does not establish fresh Codex skill discovery, an independent SI-agent task trial, full accessibility conformance or a live-device result. A fresh trusted Codex session is needed to check runtime skill discovery.

This import creates no global Codex/MCP configuration, credentials, paid accounts, hosted scanners, analytics or organization-wide rules. Update the snapshot through a separately reviewed bundle, not a floating fetch during an agent session. Preserve the managed bytes with `.gitattributes`; do not format `.agents/` or `.vinasig/`.

## Interface rules approved on 3 October 2026

The owner requested this standards update across VINASIG. LANG-004 requires natural punctuation, sentence case and custom list markers in authored interfaces. LANG-005 requires ordinary-reader language and limits parenthetical labels. Required code, URLs, times, regulatory identifiers, official names and user input retain their correct syntax.

WEB-008 requires matching closed and opened dropdown, calendar, color and slider controls. Operating-system popups do not satisfy the requirement. The snapshot includes `templates/web/interface.mjs` for rendered-copy and control regressions. Consumer tests exercise real routes and dynamic states. Visual, keyboard and ordinary-language review remain necessary.

## Header rules approved on 4 October 2026

The owner approved original transparent horizontal logos selected for the actual header surface under WEB-001. Keep the source asset bytes, proportions and internal artwork. Avoid white panels, padded or rounded cards and artwork effects. Maintain the accessible logo link and its usable target independently of image size.

This reviewed snapshot adds `inspectHeaderBrand` to `templates/web/interface.mjs`. The consumer browser regressions check the real header alongside rendered copy. Asset integrity, screenshot review and script-unavailable states remain separate checks.

## Licensing adopted on 4 October 2026

The reviewed snapshot includes the licensing policy, LIC-001 through LIC-004, full GPL/CC texts, material map, brand policy, review template and license checker. It retains its own software/prose grants rather than setting this project's primary license. The owner separately selected this project's scopes in LICENSES.md. Use npm run check:licenses for source metadata/text verification. Web builds also verify published legal text and source notices. Original assets and existing gates remain required.
