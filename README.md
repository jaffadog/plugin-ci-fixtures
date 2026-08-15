# fixture: prepare-double-build

Regression test for the `--ignore-scripts` + `npm rebuild` fix in the `build`, `desktop`, and
`signalk-integration` jobs' install steps. `prepare` and `build` both run `build.js`, which
increments `build-count.txt`. `prepare` only fires on a bare `npm install`/`npm ci` — so if any
install step in the pipeline drops `--ignore-scripts`, the counter goes above 1.

**Expected result: green.** The test asserts `build-count.txt` is exactly `1` after the full
desktop-job pipeline (built once, centrally, via `build-command` — never re-triggered by
`prepare`).

See the [main branch README](https://github.com/jaffadog/plugin-ci-fixtures/blob/main/README.md)
for how this repo's branch-per-fixture scheme works.
