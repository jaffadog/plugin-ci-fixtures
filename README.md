# fixture: bad-package-metadata

Three distinct error-tier checks in the package.json validation step, all in one fixture since
they're independent field-presence/validity rules rather than variants of the same mechanism
(unlike e.g. `malicious-install-scripts`'s three script hooks) — a regression in any one of
them would still show up as a missing error line in the log even though the others still fire:

- No `keywords` array at all, so the required `signalk-node-server-plugin` keyword is missing.
- No `main` and no `exports` field.
- `"version": "1.0"` — not valid semver.

`index.js` is still a fully valid plugin, reachable via the entry-resolution fallback to
`index.js` when `main`/`exports` are absent — so the entry-point, schema, lifecycle, and
API-usage checks all still run and pass normally, isolating the failure to package.json
validation specifically.

**Expected result: red on `desktop`, green on `armv7`.** `desktop` fails "Validate package.json"
with all three errors reported together — verified locally against the extracted check script
before pushing. Every other `desktop` structural check passes.

`armv7` is a genuinely different job — its only steps are download-artifact, extract, QEMU
setup, and running the plugin's own `npm test` (confirmed by reading the job's step list
directly). `validate-pkg.js` is a `desktop`-exclusive step; `armv7` never runs it, so a broken
package.json is structurally invisible to it. Confirmed against the real run: `desktop` fails,
`armv7` succeeds. Same divergence as
[`fixture/bad-entry-point`](https://github.com/jaffadog/plugin-ci-fixtures/tree/fixture/bad-entry-point),
for the identical reason.

See the [main branch README](https://github.com/jaffadog/plugin-ci-fixtures/blob/main/README.md)
for how this repo's branch-per-fixture scheme works.
