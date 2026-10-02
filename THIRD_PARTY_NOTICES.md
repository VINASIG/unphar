# Third-party notices

| Material                                           | Role                                                             | Notice                                                                                             |
| -------------------------------------------------- | ---------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| [JSZip](https://github.com/Stuk/jszip) 3.10.2      | Active local ZIP writer                                          | `assets/licenses/JSZip.txt`, MIT option retained                                                   |
| [pako](https://github.com/nodeca/pako) 3.0.2       | Active local raw-deflate reader                                  | `assets/licenses/pako.txt`, MIT and Zlib                                                           |
| [Lucide](https://lucide.dev/) 1.50.0               | Static Upload SVG                                                | `assets/licenses/Lucide.txt`, original ISC/MIT notices                                             |
| Space Grotesk                                      | Local UI font                                                    | `assets/fonts/OFL.txt`, SIL OFL 1.1                                                                |
| [phar.js](https://github.com/pharjs/phar.js) 1.8.0 | Pre-existing source reference archive, unused by current runtime | `package/LICENSE`, `package/README.md`, original metadata and copied `assets/licenses/phar-js.txt` |

The pre-existing converter documented inspiration from [easy-phar](https://github.com/easy-phar/easy-phar.github.io) and phar.js. These are external technical credits. The current checked reader/writer implements the documented native PHAR and ZIP fields, validates archive boundaries and never executes stub or serialized metadata.

Development dependencies retain the licenses in their installed packages. Asset hashes and versions are recorded in `assets/manifest.json`; refresh notices with a reviewed dependency update. Branding rights are separate from source and dependency licenses.
