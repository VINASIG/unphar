# Security reporting

Report suspected vulnerabilities through [GitHub private vulnerability reporting](https://github.com/VINASIG/unphar/security/advisories/new). Use synthetic archives that reproduce the issue and describe the browser, steps and observed behavior. Do not include private archives, credentials, production data or an executable payload targeting another user.

The application has no upload endpoint or authentication service. It treats archives as untrusted bytes, validates paths and bounds, limits memory/decompression, verifies checksums and supported signatures, and renders file paths as text. It never executes a PHP stub or deserializes PHP metadata. These protections are not a full independent security audit and cannot make the contents of a converted archive safe to run.

Dependency and vendor updates require a reviewed lockfile, matching browser bundle, notices and tests. Only checked `dist/` output is published. Use the project's browser and PHP fixture checks before publishing archive changes.
