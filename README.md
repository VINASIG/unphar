# VINASIG Unphar

Convert PHAR and ZIP archives locally in your browser. Select or drop one file, wait for integrity checks and download the converted archive. File contents are processed on your device and are never uploaded by this application.

[Open Unphar](https://vinasig.github.io/unphar/) · [Report an issue](https://github.com/VINASIG/unphar/issues)

## Use the converter

1. Choose or drop a `.phar` or `.zip` file up to 32 MB.
2. The archive format is checked from its bytes. PHAR becomes ZIP; ZIP becomes PHAR.
3. The result downloads automatically. A download link remains available if your browser blocks the automatic download.
4. Open "Archive contents" to review file paths. Read "Supported formats and limits" before using a converted PHAR in another application.

The public site loads its libraries and Space Grotesk font from the same static host. There is no upload endpoint, account system, telemetry or CDN dependency. You can also download the published site folder and open its `index.html` locally. Signature processing needs Web Crypto; use HTTPS or localhost if your browser does not provide it for `file://`.

## Formats and limits

- Native PHAR archives with stored or raw-deflate file contents are supported. SHA-1, SHA-256 and SHA-512 signatures are verified when present; every file's size and CRC32 are checked. New PHAR files use a real SHA-256 signature.
- ZIP supports stored and deflate entries, UTF-8 file paths and common data descriptors. BZip2, ZIP64, encrypted/split ZIP, MD5/OpenSSL PHAR signatures, whole-archive compression and tar-based PHAR formats are not supported.
- Limits are 2,000 archive entries, 16 MB per expanded file and 32 MB of total expanded data. Entries larger than 1 MB with a compression ratio over 200 are rejected. Paths up to 4,096 UTF-8 bytes are supported. Decompression stops when an entry exceeds its declared size.
- Empty directories are omitted. ZIP DOS timestamps use UTC consistently with the ZIP writer and have two-second precision. File contents and paths are preserved; the original PHP stub, alias, serialized metadata, permissions and signature are not preserved across conversion.
- A new PHAR is an archive container. It does not restore the original application's executable entrypoint. An integrity check does not identify an archive's author or make its contents safe to execute.

## Develop locally

Use Node 24.21.0 and npm 12.2.0. The website remains plain HTML/CSS/JavaScript; tooling is for development, testing and creating an allowlisted publication folder.

```sh
npm ci
npm run dev
```

The local server prints its actual loopback URL and available port. `npm run preview` serves `dist/` after a build. Assets use relative URLs so root hosting, `/unphar/` and local files share the same layout.

```sh
npm run check
npm test
npm run test:php
npm run build
npm exec playwright install chromium firefox webkit
npm run test:browser
npm run test:performance
```

PHP with the Phar and zlib extensions is needed only for the independent interoperability test. It reads generated archives and creates synthetic fixtures with `phar.readonly=0` for that process; it never executes an uploaded PHP stub or changes a machine-wide configuration.

## Project conventions

- [AGENTS.md](AGENTS.md) and [standards adoption](docs/STANDARDS.md) define the local VINASIG SI agent workflow.
- [Brand integration](docs/BRAND.md) records the supplied artwork, Space Grotesk, Lucide and design-system adoption.
- [Toolchain](docs/TOOLCHAIN.md) records pinned versions and compatibility decisions.
- [Testing](tests/README.md) describes browser states, responsive widths and evidence limits.
- [Publication audit](docs/audits/2026-10-03-publication.md) records actual verification, with local artifacts in ignored `output/`.
- [Source and asset rights](LICENSE_STATUS.md), [third-party notices](THIRD_PARTY_NOTICES.md), [contribution guide](CONTRIBUTING.md) and [security reporting](SECURITY.md) define reuse and maintenance boundaries.

GitHub Actions checks source, unit tests and the built site on Windows and Linux, then runs Chromium, Firefox and WebKit browser tests. Linux also runs PHP interoperability and lab performance budgets. Only a passing push to `main` can deploy the allowlisted `dist/` folder to GitHub Pages. The published site does not include development packages, reference archives or test output.

Pre-existing reference files in `package/`, `phar-1.8.0.tgz`, archive listings, `favicon_io/` and the root legacy library bundles remain in Git history and the source tree. They are not loaded by the current website, installed as application dependencies, or copied to Pages. Their existing external notices remain intact.

## License scopes

VINASIG-authored software uses **AGPL-3.0-or-later**. Authored documentation uses **CC-BY-SA-4.0**. Commercial use is allowed under those standard licenses. Fonts and third-party components retain their original terms. Official VINASIG identity assets follow the separate brand policy.

Read [LICENSE](LICENSE), [LICENSES.md](LICENSES.md), [VINASIG Brand Usage Policy](BRAND_POLICY.md) and [the licensing review](docs/audits/licensing-2026-10-04.md) for exact scopes, rationale and remaining review.
