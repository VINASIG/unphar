# Unphar brand integration

Integration date: 3 October 2026. This product adopts VINASIG Web Design System's Bright Playful Minimalism proposal for its focused conversion workspace. This is a product decision within the owner's standardization request, not approval of every organization design proposal.

## Pinned source and artwork

The selected public exports and Space Grotesk are copied unchanged from [VINASIG Web Design System](https://github.com/VINASIG/web-design-system/tree/7ca081e190a7baa3682edf4d1d12ec6485332349). Its brand archive is [VINASIG Brand Assets](https://github.com/VINASIG/vinasig-brand-assets/tree/673d1392d5d78e87323ca91eac480e25b57210a9). Editable artwork stays in that archive.

`assets/manifest.json` pins SHA-256 for the copied logo, mark, 16/32/48 px favicons, font, OFL notice, runtime bundles and dependency notices. The build checks these bytes and their source/output equality. The primary lockup is not redrawn, recolored or retypeset. Light and dark interfaces use the unchanged lockup on a white surface.

`tokens.css` adopts the source's `:root` tokens, with a relative local font loader and formatting-only normalization. Identity anchors remain Scout Blue `#21497b`, Thinker Orange `#eb7114`, Builder Green `#47a036`, Auditor Red `#971607` and Core Graphite `#443a3b`. `style.css` defines a dark-surface adaptation and layout around these tokens. UI and archive paths use Space Grotesk with a platform sans-serif fallback, 300-700 weight support and no remote font service.

## Controls and motion

The browser serves a WOFF2 container compressed locally from the preserved TTF with FontTools 4.66.1 and Brotli 1.2.0. It is not subsetted: glyph coverage, names and 300-700 variable weights remain intact. The original TTF and OFL notice remain unchanged. This reduces the font transfer from 134,112 to 48,952 bytes; the resulting digest is recorded in the asset manifest.

The chooser is a native button with a named file input. The upload SVG uses the Upload paths from Lucide 1.50.0 and its notice is retained. Archive contents and format notes use native `details`/`summary`, following the design system's button and disclosure guidance. No external brand icon is needed, so Simple Icons is not an unused runtime dependency.

CSS provides 160 ms softly eased interaction feedback with at most 2 px of icon movement. The main content is immediately available. Hover feedback applies only to a fine pointer; all actions work by keyboard and touch. Reduced motion disables movement and transitions. No animation library or framework is needed for these controls. Native progress exposes the real loading state.

Branding applies to the interface. Converted archive contents and paths come from the user's file. The neutral generated PHP stub does not inject VINASIG artwork, names, network requests or executable application behavior into the user's package.
