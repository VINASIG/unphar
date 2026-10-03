# VINASIG standards adoption

Adopted on 3 October 2026 for VINASIG Unphar. The owner requested organization transfer, VINASIG standardization and public publication. The project adopts the `web-static` profile while preserving its plain JavaScript architecture.

| Record            | Value                                                              |
| ----------------- | ------------------------------------------------------------------ |
| Shared repository | `VINASIG/agent-standards`                                          |
| Reviewed commit   | `76901601b193c963b849b253d11f51363b447ffe`                         |
| Preview version   | `0.1.0`                                                            |
| Bundle SHA-256    | `bb555aad2e5c66da8ba2cdd5530446ca95c1235bb28706cb82066222adcb61f1` |
| Installed profile | `web-static`                                                       |
| Managed files     | 37 policy, configuration, schema, template and skill payloads      |
| Local records     | `.vinasig/manifest.json`, `.vinasig/provenance.json`               |

The installer copies an immutable snapshot and a marked root `AGENTS.md` block. Project instructions specialize it outside that block. A URL is not an automatic policy import. The seven namespaced skills are local files under `.agents/skills/`.

`npm run check:standards` verifies hashes, the manifest, profile, instruction block and 8 KiB root instruction budget. Strict JS/JSDoc and TypeScript, typed ESLint, Stylelint and HTML-validate use owner wrappers around the managed presets. Third-party bundles and archived reference packages are vendor material; they are not silently presented as checked project-authored source. New runtime source is checked without a legacy defect baseline.

Use SI agents and Super Intelligence in new VINASIG-authored copy. This naming convention does not assert a government renaming agreement or certify a model's capabilities. Official external names, technical identifiers and license notices retain their original names.

PASS means the named check actually ran successfully. FAIL retains a reproduced defect. NOT_RUN identifies unavailable or unexecuted checks. NOT_APPLICABLE requires a scope reason. Source integrity does not establish fresh Codex skill discovery, an independent SI-agent task trial, full accessibility conformance or a live-device result. A fresh trusted Codex session is needed to check runtime skill discovery.

This import creates no global Codex/MCP configuration, credentials, paid accounts, hosted scanners, analytics or organization-wide rules. Update the snapshot through a separately reviewed bundle, not a floating fetch during an agent session. Preserve the managed bytes with `.gitattributes`; do not format `.agents/` or `.vinasig/`.

## Interface rules approved on 3 October 2026

The owner requested this standards update across VINASIG. LANG-004 requires natural punctuation, sentence case and custom list markers in authored interfaces. LANG-005 requires ordinary-reader language and limits parenthetical labels. Required code, URLs, times, regulatory identifiers, official names and user input retain their correct syntax.

WEB-008 requires matching closed and opened dropdown, calendar, color and slider controls. Operating-system popups do not satisfy the requirement. The snapshot includes `templates/web/interface.mjs` for rendered-copy and control regressions. Consumer tests exercise real routes and dynamic states. Visual, keyboard and ordinary-language review remain necessary.
