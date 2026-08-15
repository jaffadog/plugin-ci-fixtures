# fixture: bad-entry-point

`index.js` exports a plain object instead of the required constructor function — e.g. a plugin
mistakenly converted to export a singleton instance rather than a factory. package.json is
otherwise fully valid.

**Expected result: red.** Fails "Validate entry point" (`::error::Plugin entry point does not
export a function (got object)`) — verified locally against the extracted check script before
pushing. Package.json validation passes. The schema and lifecycle checks both detect the
constructor isn't callable and silently skip (exit 0, no output) rather than reporting their
own errors — by design, since they'd just be re-describing the same root cause already reported
by the entry-point check. The API-usage scan still runs and passes normally, since it's a pure
static text scan that doesn't need a working constructor.

See the [main branch README](https://github.com/jaffadog/plugin-ci-fixtures/blob/main/README.md)
for how this repo's branch-per-fixture scheme works.
