# Unphar brand integration

Integration date: 3 October 2026. This product adopts VINASIG Web Design System's Bright Playful Minimalism proposal for its focused conversion workspace. This is a product decision within the owner's standardization request, not approval of every organization design proposal.

## Pinned source and artwork

The selected public exports and Space Grotesk are copied unchanged from [VINASIG Web Design System](https://github.com/VINASIG/web-design-system/tree/7ca081e190a7baa3682edf4d1d12ec6485332349). Its brand archive is [VINASIG Brand Assets](https://github.com/VINASIG/vinasig-brand-assets/tree/673d1392d5d78e87323ca91eac480e25b57210a9). Editable artwork stays in that archive.

`assets/manifest.json` pins SHA-256 for the copied logo, mark, 16/32/48 px favicons, font, OFL notice, runtime bundles and dependency notices. The build checks these bytes and their source/output equality. The primary lockup is not redrawn, recolored or retypeset. The current header uses a transparent lockup matched to its actual surface.

`tokens.css` adopts the source's `:root` tokens, with a relative local font loader and formatting-only normalization. Identity anchors remain Scout Blue `#21497b`, Thinker Orange `#eb7114`, Builder Green `#47a036`, Auditor Red `#971607` and Core Graphite `#443a3b`. `style.css` defines a dark-surface adaptation and layout around these tokens. UI and archive paths use Space Grotesk with a platform sans-serif fallback, 300-700 weight support and no remote font service.

## Controls and motion

The browser serves a WOFF2 container compressed locally from the preserved TTF with FontTools 4.66.1 and Brotli 1.2.0. It is not subsetted: glyph coverage, names and 300-700 variable weights remain intact. The original TTF and OFL notice remain unchanged. This reduces the font transfer from 134,112 to 48,952 bytes; the resulting digest is recorded in the asset manifest.

The chooser is a native button with a named file input. The upload SVG uses the Upload paths from Lucide 1.50.0 and its notice is retained. Archive contents and format notes use native `details`/`summary`, following the design system's button and disclosure guidance. No external brand icon is needed, so Simple Icons is not an unused runtime dependency.

CSS provides 160 ms softly eased interaction feedback with at most 2 px of icon movement. The main content is immediately available. Hover feedback applies only to a fine pointer; all actions work by keyboard and touch. Reduced motion disables movement and transitions. No animation library or framework is needed for these controls. Native progress exposes the real loading state.

Branding applies to the interface. Converted archive contents and paths come from the user's file. The neutral generated PHP stub does not inject VINASIG artwork, names, network requests or executable application behavior into the user's package.

## Transparent header approved on 4 October 2026

Use the unchanged Primary Color lockup on the light canvas and the unchanged Reversed lockup on the dark canvas. A native picture source selects the existing dark variant without JavaScript. The logo link has no white panel, padded card, rounded artwork, shadow or filter. Its minimum hit height is 44 px, while the image retains the original 540 by 140 aspect ratio.

The newly copied Reversed SVG was reviewed at VINASIG/vinasig-brand-assets commit `83ed7515c81c3b2a28888a75c754e44562d5b107`. Its SHA-256 is `98ceaaace06835138856d3710b4fed38714528573f78b19e710db796aea53d07`. The manifest records this separate review and preserves every earlier asset digest. Existing design/font adoption pins remain historical records of those unchanged files. Generated user output and printable document surfaces keep their intended styling.

## Appearance control approved on 5 October 2026

The owner selected the existing TOTP and QR Scanner appearance pattern for VINASIG websites. Use decorative Lucide Sun and Moon SVGs at 20 CSS px inside a button with a target of at least 44 CSS px. Light mode shows Moon to offer dark mode. Dark mode shows Sun to offer light mode. Keep a localized action name, pressed state, visible keyboard focus and the unchanged language link. Do not replace these recognizable icons with filled squares. Regression checks inspect both icons, their visibility and dimensions before and after toggling, persistence and blocked storage.

## Neutral appearance approved on 8 October 2026

Read [the shared theme adoption](THEME.md) before changing interface colors. The approved Radix Gray canvas, text and control roles supersede historical warm interface neutrals. Earlier source and artwork records remain intact.
