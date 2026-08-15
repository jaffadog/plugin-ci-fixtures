# fixture: api-misuse

`start()` reads four internal server properties flagged by the "misuse" (hard error) tier of
the API-usage scan: `app.server`, `app.deltaCache`, `app.pluginsMap`, and
`historyApiHttpRegistry`. All four are grouped into this one fixture rather than one fixture
per property, since they're all the same severity and the same scan — this is the "misuse"
category specifically, not the "deprecated" category (`setProviderStatus` etc.) or the
warning-tier anti-patterns, both of which are covered by
[`fixture/api-usage-warnings`](https://github.com/jaffadog/plugin-ci-fixtures/tree/fixture/api-usage-warnings)
instead — a different code path in the same scan.

**Expected result: red.** The API-usage scan is pure static analysis — its result can't differ
by OS or Node version — so it only runs on one representative desktop combination (`ubuntu-latest`
+ the first entry in `node-versions`) instead of all 12; the other 11 show `skip` for that step
specifically, but still run their own package.json/entry-point/schema/lifecycle checks
normally. On the representative combination, "Scan for deprecated and misused SignalK APIs"
fails with all four reported together — static text matches, so none of the four lines need to
execute to be caught — verified locally against the extracted check script before pushing.
Confirmed against a real run: every step after it in that same job — npm pack, ES2023, App
Store, tests, stray-files — shows `skipped`, not "pass". GitHub Actions skips all subsequent
steps in a job once an earlier one fails (no `continue-on-error` here). The overall `desktop`
result is still correctly "failure" either way, since one failing instance fails the whole
matrix.

See the [main branch README](https://github.com/jaffadog/plugin-ci-fixtures/blob/main/README.md)
for how this repo's branch-per-fixture scheme works.
