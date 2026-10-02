# Toolchain selection

Official npm registry lookup date: 3 October 2026. All selected direct dependencies are exact versions and `package-lock.json` locks the resolved graph. Node 24.21.0 is the supported LTS line for development and CI; npm 12.2.0 is pinned. No global runtime installation is required by repository scripts.

| Package                     | Latest stable checked | Selected | Decision                                                                                            |
| --------------------------- | --------------------- | -------- | --------------------------------------------------------------------------------------------------- |
| JSZip                       | 3.10.2                | 3.10.2   | Local ZIP writer; replace the legacy runtime bundle                                                 |
| pako                        | 3.0.2                 | 3.0.2    | Local inflate-only browser build; bounded raw-deflate reader                                        |
| Lucide                      | 1.50.0                | 1.50.0   | Static Upload SVG and license; no full icon runtime                                                 |
| Playwright Test             | 1.63.0                | 1.63.0   | Persistent cross-engine browser checks                                                              |
| axe-core Playwright         | 4.13.0                | 4.13.0   | Partial automated accessibility checks                                                              |
| TypeScript                  | 7.0.2                 | 6.0.3    | typescript-eslint 8.71.0 requires TypeScript `<6.1.0`; retain the latest compatible checked release |
| typescript-eslint           | 8.71.0                | 8.71.0   | Typed strict rules                                                                                  |
| ESLint / @eslint/js         | 10.11.0 / 10.0.1      | Same     | Zero unexplained warnings                                                                           |
| Prettier                    | 3.9.9                 | 3.9.9    | One formatter for project-owned source                                                              |
| Stylelint / standard config | 17.16.0 / 40.0.0      | Same     | Check real CSS                                                                                      |
| HTML-validate               | 11.16.1               | 11.16.1  | Validate source and published HTML                                                                  |
| Lighthouse                  | 13.5.0                | 13.5.0   | Local lab reports and reviewed budgets                                                              |
| Node types                  | 26.6.4                | 24.19.1  | Match runtime major 24                                                                              |

pako 3 supplies its own TypeScript definitions. The deprecated `@types/pako` stub is not installed. FileSaver is no longer an active dependency; a native Blob URL and download link provide the same download flow and recovery action.

Classic browser scripts retain `file://` compatibility without a module fetch, bundler or application server. Development scripts use Node's TypeScript stripping; TypeScript separately checks all applicable source. The production build copies an explicit file list and rejects unexpected files in `dist/`. It does not publish the entire repository.

Vendor refreshes must copy the matching pinned package files, retain notices and review `assets/manifest.json` digests. A package upgrade without a reviewed vendor refresh fails the asset/version check. Dependabot proposes weekly npm and action updates; it does not automatically merge them. CI actions use reviewed commit SHAs.

PHP interoperability runs against an actual PHP CLI with Phar and zlib extensions. The test records its detected version and uses process-specific fixture flags. CI uses its available PHP CLI on Linux and fails if the fixture test cannot run. Physical devices, assistive technology, field vitals and external search dashboards require their own evidence; they are not implied by this toolchain.

Lighthouse 13.5.0's transitive trace type declarations contain an `exactOptionalPropertyTypes` incompatibility. The local driver validates the pinned external runtime boundary and parses report fields as unknown data. The project retains declaration checking and strict source checks; no `skipLibCheck` or blanket linter suppression is introduced.

FontTools 4.66.1 and Brotli 1.2.0 were checked from official PyPI on the same date and installed only in ignored local tooling to create the WOFF2 container. Normal development and CI use its reviewed committed bytes and need no Python/font compiler. Retain the original TTF and OFL, verify glyph/weight/name preservation and update the asset digest when regenerating the container.
