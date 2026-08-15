# fixture: bad-package-metadata

Three distinct error-tier checks in the package.json validation step, all in one fixture since
they're independent field-presence/validity rules rather than variants of the same mechanism
(unlike e.g. `malicious-install-scripts`'s three script hooks) — a regression in any one of
them would still show up as a missing error line in the log even though the others still fire:

- No `keywords` array at all, so the required `signalk-node-server-plugin` keyword is missing.
- No `main` and no `exports` field.
- `"version": "1.0"` — not valid semver.

`index.js` is still a fully valid plugin, reachable via the entry-resolution fallback to
`index.js` when `main`/`exports` are absent.

**Expected result: red on `desktop`, green on `armv7`.** `validate-pkg.js` is pure static
analysis of package.json/source files — its result can't differ by OS or Node version, so it
only runs on one representative desktop combination (`ubuntu-latest` + the first entry in
`node-versions`) instead of all 12; the other 11 show `skip` for that step specifically, but
still run their own entry-point/schema/lifecycle/API-usage checks normally. On the
representative combination, "Validate package.json" fails with all three errors reported
together — verified locally against the extracted check script before pushing. Confirmed
against the real run: **every step after it in that same job shows `skipped`, not "pass"** —
GitHub Actions skips all subsequent steps in a job once an earlier one fails (no
`continue-on-error` here), so entry-point/schema/lifecycle/API-usage never actually execute on
this fixture, on any combination. The overall `desktop` result is still correctly "failure"
either way, since one failing instance fails the whole matrix.

`armv7` is a genuinely different job — its only steps are download-artifact, extract, QEMU
setup, and running the plugin's own `npm test` (confirmed by reading the job's step list
directly). `validate-pkg.js` is a `desktop`-exclusive step; `armv7` never runs it, so a broken
package.json is structurally invisible to it. Confirmed against the real run: `desktop` fails,
`armv7` succeeds. Same divergence as
[`fixture/bad-entry-point`](https://github.com/jaffadog/plugin-ci-fixtures/tree/fixture/bad-entry-point),
for the identical reason.

See the [main branch README](https://github.com/jaffadog/plugin-ci-fixtures/blob/main/README.md)
for how this repo's branch-per-fixture scheme works.
