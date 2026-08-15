# fixture: fail-on-warning

Identical plugin content to
[`fixture/api-usage-warnings`](https://github.com/jaffadog/plugin-ci-fixtures/tree/fixture/api-usage-warnings)
— the same eleven warning-tier API-usage patterns, plus the same missing-CHANGELOG/missing-screenshots
package.json warnings every fixture in this repo has (none of them ship a CHANGELOG.md or
`signalk.screenshots`). The only difference is `fail-on-warning: true` in this branch's
`signalk-ci.yml`.

**Expected result: red.** Where `api-usage-warnings` shows green with thirteen warning
annotations, this fixture fails on the first check that finds any — "Validate package.json"
(missing CHANGELOG + screenshots, 2 warnings) — before the API-usage scan even runs, since a
failure cascades and skips everything after it in the same job (see
[`fixture/bad-package-metadata`](https://github.com/jaffadog/plugin-ci-fixtures/tree/fixture/bad-package-metadata)
for the general mechanism). Verified locally against all six `fail-on-warning`-aware check
scripts (package.json, schema structure, API-usage scan, npm audit, ES2023, stray-files) with
real warning-producing inputs: every one exits 1 with `FAIL_ON_WARNING=true` and is unaffected
with it unset, including on an already-clean plugin (fail-on-warning is a no-op when there's
nothing to fail on).

`fail-on-warning` deliberately does **not** apply to the lifecycle check's "mock gap" warnings
(`registerWithRouter()` throwing, or `start()`/`stop()` hitting a `"X is not a function"`/
`"Cannot read propert…"` pattern) — those indicate this workflow's test harness doesn't model
something the plugin depends on, not necessarily a defect in the plugin itself, so failing a
build on them would be unfair to enable.

See the [main branch README](https://github.com/jaffadog/plugin-ci-fixtures/blob/main/README.md)
for how this repo's branch-per-fixture scheme works.
