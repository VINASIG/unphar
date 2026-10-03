# Interface standards audit

Reviewed on 4 October 2026 under the owner's organization-wide request.

## Source changes

The existing visible prose and upload control met the requested interface conventions. Added a rendered-copy and platform-control regression to the existing browser infrastructure.

`tests/browser/interface.spec.ts`. Archive conversion and vendored source are unchanged.

The reviewed standards snapshot is pinned to `76901601b193c963b849b253d11f51363b447ffe`. LANG-004 and LANG-005 cover natural punctuation, sentence case, plain language and custom list markers. WEB-008 covers the complete closed and open control surface. The inspector runs against authored visible text, with required syntax and user-controlled output preserved.

Installer diff, dry run, update and doctor completed. Project-owned AGENTS text outside the managed block was compared byte for byte and preserved.

## Verification

Source checks, 26 unit tests, PHP interoperability and the allowlisted production build passed. The complete browser suite passed 162 cases across Chromium, Firefox and WebKit.

Routes reviewed: `/`.

The visual review covers light and dark preferences at 360 x 800, 390 x 844, 768 x 1024, 1024 x 768 and 1440 x 900. Full-page screenshots were retained and reviewed through contact sheets with top, middle and bottom sections. Existing browser tests additionally exercise their documented narrow widths, breakpoints, keyboard, touch, form and disclosure states. Screenshots are retained under ignored `output/responsive/ui-language-2026-10-03/before/` and `after/`, alongside the existing run artifacts. Automated accessibility checks supplement visual review and do not certify conformance or physical-device behavior.

## Publication and limits

This record describes local verification. Current-head CI and publication are verified separately before task completion. The subsequent header-logo audit has its own implementation and evidence. Original assets, protocol syntax and business logic were preserved.
