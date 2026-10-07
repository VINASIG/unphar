# Shared preferences publication build — 7 October 2026

WEB-011 adds the reviewed VINASIG preference runtime to both locales. The initial publication exceeded the existing 2,500 ms mobile LCP budget: the local English median was about 2,704 ms, and the Linux CI median was about 2,631 ms. The original reports and failed CI run [37607182645](https://github.com/VINASIG/unphar/actions/runs/37607182645) remain evidence of that failure.

The publication build now embeds the five reviewed stylesheets in their original order, rebases only the existing Vietnamese font path, and removes the duplicate deferred preference script. The full runtime already binds the controls at `DOMContentLoaded` from its head script. Build-time minification covers these styles, that head script and the three project-owned classic scripts. Original readable source, the shared-runtime digest pin, exact asset/vendor checks and the publication file allowlist remain required. The source bootstrap must equal the reviewed sidecar before compilation; the distributed bootstrap must equal the pinned compiler's output. No CSS import or unreviewed external resource is accepted.

## Dependency selection

The [official npm registry](https://registry.npmjs.org/esbuild/latest) was checked on 7 October 2026. esbuild was not a direct dependency here before this change; latest stable and selected are both **0.28.2**. It supports Node >=18, has no peer dependency, and carries the MIT license with Evan Wallace's notice. Node 24.21.0 and npm 12.2.0 remain pinned. The exact development dependency and lockfile contain its resolved platform packages; every pre-existing lock entry is unchanged. The installed main package matches the registry's integrity metadata. The compiler is not a browser runtime or a network service.

The isolated [transform API](https://esbuild.github.io/api/#transform) is used with fixed `css`/`js` loaders, minification, UTF-8, retained legal comments and Chrome 120 / Firefox 120 / Safari 17 targets. These settings do not bundle or import files. A license banner identifies project-owned compiled software. Original font, mark, logo, license text, JSZip and pako bytes remain unchanged and continue to have their separate rights and digest checks. Source, build scripts and the lockfile are available from the repository's source link.

The dependency audit reports seven existing development-tool findings through `braces` and Stylelint. Their versions did not change; esbuild has no reported finding in this audit. They are not shipped browser dependencies. Automated force-fix suggestions would downgrade unrelated Stylelint majors and were not applied. This scoped result is not a claim that all development dependencies are vulnerability-free.

## Experiments and evidence boundary

All measurements keep the same Lighthouse 13.5.0 fixture, three cold navigations per profile, 390×844 / 1440×900 viewports, simulated 150 ms / 1.6 Mbps / 4× CPU mobile conditions, and original LCP/CLS/TBT budgets. The native browser language is checked before each locale measurement.

Combining external CSS, embedding the original font bytes, changing line endings, or minifying only CSS did not consistently satisfy the budget. Those trials were rejected. CSS plus head-script minification passed one measured median but retained an outlier; reducing the project-owned script payload also lowered main-thread blocking. Failed reports are retained rather than selecting a passing individual navigation.

Final local checks passed: strict source/lint/format/locale/standards checks; **34 unit cases**; **216 Chromium, Firefox and WebKit cases** against the compiled site, including offline conversion, protected inputs, native controls and responsive states; **six independently generated PHP fixtures**; and unchanged asset/license checks.

| Locale / profile   | Median LCP | Median CLS | Median TBT | Result |
| ------------------ | ---------: | ---------: | ---------: | ------ |
| English mobile     |   2,403 ms |          0 |       0 ms | PASS   |
| Vietnamese mobile  |   2,402 ms |          0 |       8 ms | PASS   |
| English desktop    |     522 ms |          0 |       0 ms | PASS   |
| Vietnamese desktop |     522 ms |          0 |       0 ms | PASS   |

These are rounded medians of three final cold navigations per row, not selected individual runs. Raw reports, failed experiments and compiled-site screenshots remain in publication evidence. Remote CI and deployed behavior require their own verification; the local results do not substitute for them. A successful lab budget or browser suite does not establish physical-device results, field vitals, linguistic validation or an independent security review.
