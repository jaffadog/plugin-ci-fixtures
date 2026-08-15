# fixture: bad-entry-point

`index.js` exports a plain object instead of the required constructor function — e.g. a plugin
mistakenly converted to export a singleton instance rather than a factory. package.json is
otherwise fully valid.

**Expected result: red on `desktop`, green on `armv7`.** `desktop` fails "Validate entry point"
(`::error::Plugin entry point does not export a function (got object)`) — verified locally
against the extracted check script before pushing. "Validate package.json" passes first (it
runs before entry-point validation in the step sequence). Confirmed against the real run:
**every step after the failure — schema, lifecycle, the API-usage scan, npm pack, ES2023,
App Store, tests, stray-files — shows `skipped`, not "pass" or its own error.** GitHub Actions
skips all subsequent steps in a job once an earlier one fails (no `continue-on-error` here); a
skipped step never "detects" anything or "runs and passes" — it never executes at all. (An
earlier version of this README claimed otherwise, based on testing each check script
independently rather than checking the real sequential job execution — corrected after
reading actual step outcomes from a live run.) The API-usage scan is also, separately, now
gated to run on only one representative desktop combination — moot for this specific fixture,
since it would show `skipped` here either way.

`armv7` is a genuinely different job, not a variant of `desktop` — its only steps are
download-artifact, extract, QEMU setup, and running the plugin's own `npm test` (confirmed by
reading the job's step list directly). None of `validate-pkg.js`/`validate-entry.js`/
`check-schema.js`/`check-lifecycle.js`/the API-usage scan are `desktop`-exclusive steps that
`armv7` runs at all — so a broken entry point is structurally invisible to it. This fixture's
own `test/index.test.js` asserts `typeof entryExport === 'object'`, which is true by
construction, so `armv7` legitimately passes. Confirmed against the real run: `desktop` fails,
`armv7` succeeds.

See the [main branch README](https://github.com/jaffadog/plugin-ci-fixtures/blob/main/README.md)
for how this repo's branch-per-fixture scheme works.
