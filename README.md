# fixture: bad-entry-point

`index.js` exports a plain object instead of the required constructor function — e.g. a plugin
mistakenly converted to export a singleton instance rather than a factory. package.json is
otherwise fully valid.

**Expected result: red on `desktop`, green on `armv7`.** `desktop` fails "Validate entry point"
(`::error::Plugin entry point does not export a function (got object)`) — verified locally
against the extracted check script before pushing. Package.json validation passes. The schema
and lifecycle checks both detect the constructor isn't callable and silently skip (exit 0, no
output) rather than reporting their own errors — by design, since they'd just be re-describing
the same root cause already reported by the entry-point check. The API-usage scan still runs
and passes normally, since it's a pure static text scan that doesn't need a working constructor.

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
