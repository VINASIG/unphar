# PHAR ⇆ ZIP Converter (Pure Browser)

Single-page web app to convert between PHP archives (`.phar`) and ZIP files entirely client‑side. No server, no build step, works from `file://` or any static host.

## Features
- **PHAR → ZIP**: Manual PHAR parser (stub + manifest + file data), supports deflate (GZ). Warns on BZip2.
- **ZIP → PHAR**: Builds PHAR with stub, manifest, raw data (no compression), CRC32, and SHA1 placeholder signature (`GBMB` magic).
- **Auto detect**: One drop zone; dropping `.phar` converts to `.zip`, dropping `.zip` converts to `.phar`.
- **Verification**: After ZIP → PHAR, the app re-parses the generated PHAR and compares CRC32 of every file.
- **Offline after first load**: Uses CDN JS (JSZip, FileSaver, pako); once cached by the browser, works offline.

## Usage
1. Open `index.html` (double-click is fine; first time needs network for CDNs).
2. Drag & drop a `.phar` or `.zip` onto the drop zone, or click to choose.
3. The app detects the type:
   - `.phar` → downloads `<name>.zip`
   - `.zip`  → downloads `<name>.phar`
4. For ZIP → PHAR, a verification line shows how many files matched CRC after repack.

## Implementation Notes
- **Parsing PHAR**: Finds `__HALT_COMPILER(); ?>` stub end, reads manifest (length‑prefixed), then file entries; handles deflate based on `flags & 0xF000`.
- **Building PHAR**: Stub text:
  ```php
  <?php
  // PocketMine-MP Plugin
  __HALT_COMPILER(); ?>
  ```
  followed by CRLF. Manifest uses API 0x0011, no alias/metadata, no compression. Signature block: type `0x00000001`, 20 zero bytes, magic `GBMB`.
- **Compression**: None when creating PHAR; only deflate is decompressed when reading PHAR. BZip2 is not supported in-browser.
- **CRC32**: Implemented manually (poly 0xEDB88320).

## Stack
- Vanilla HTML/CSS/JS (no frameworks)
- JSZip 3.10.1 (CDN)
- FileSaver 2.0.5 (CDN)
- pako 2.1.0 (CDN)

## Files
- `index.html` - layout + drop zone
- `style.css`  - styling (Apple-like light theme)
- `script.js`  - parsing/building logic

## Known Limitations
- BZip2-compressed PHAR entries are not supported.
- Very large files depend on browser memory limits.

## Credits
- Inspired by the parsing approach from [easy-phar/easy-phar.github.io](https://github.com/easy-phar/easy-phar.github.io) and [pharjs/phar.js](https://github.com/pharjs/phar.js).
