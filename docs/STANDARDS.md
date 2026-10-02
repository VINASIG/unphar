# VINASIG standards adoption

Adopted on 3 October 2026 for VINASIG Unphar. The owner requested organization transfer, VINASIG standardization and public publication. The project adopts the `web-static` profile while preserving its plain JavaScript architecture.

| Record            | Value                                                              |
| ----------------- | ------------------------------------------------------------------ |
| Shared repository | `VINASIG/agent-standards`                                          |
| Reviewed commit   | `c9d33c73a89edaf1773fa4d31f1c7258e549b7b1`                         |
| Preview version   | `0.1.0`                                                            |
| Bundle SHA-256    | `ad5dcbe4601a9a3668d3433330a582e6d780b8f2527e1dcc8cfbb93f8f264870` |
| Installed profile | `web-static`                                                       |
| Managed files     | 37 policy, configuration, schema, template and skill payloads      |
| Local records     | `.vinasig/manifest.json`, `.vinasig/provenance.json`               |

The installer copies an immutable snapshot and a marked root `AGENTS.md` block. Project instructions specialize it outside that block. A URL is not an automatic policy import. The seven namespaced skills are local files under `.agents/skills/`.

`npm run check:standards` verifies hashes, the manifest, profile, instruction block and 8 KiB root instruction budget. Strict JS/JSDoc and TypeScript, typed ESLint, Stylelint and HTML-validate use owner wrappers around the managed presets. Third-party bundles and archived reference packages are vendor material; they are not silently presented as checked project-authored source. New runtime source is checked without a legacy defect baseline.

Use SI agents and Super Intelligence in new VINASIG-authored copy. This naming convention does not assert a government renaming agreement or certify a model's capabilities. Official external names, technical identifiers and license notices retain their original names.

PASS means the named check actually ran successfully. FAIL retains a reproduced defect. NOT_RUN identifies unavailable or unexecuted checks. NOT_APPLICABLE requires a scope reason. Source integrity does not establish fresh Codex skill discovery, an independent SI-agent task trial, full accessibility conformance or a live-device result. A fresh trusted Codex session is needed to check runtime skill discovery.

This import creates no global Codex/MCP configuration, credentials, paid accounts, hosted scanners, analytics or organization-wide rules. Update the snapshot through a separately reviewed bundle, not a floating fetch during an agent session. Preserve the managed bytes with `.gitattributes`; do not format `.agents/` or `.vinasig/`.
