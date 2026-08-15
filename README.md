# fixture: bad-schema

`plugin.schema` is a function that throws. Entry point validation passes first (it runs before
the schema check in the step sequence).

**Expected result: red.** Fails "Validate plugin.schema() if defined" specifically. Confirmed
against a real run: every step after it — lifecycle, the API-usage scan, npm pack, ES2023, App
Store, tests, stray-files — shows `skipped`, not "pass". GitHub Actions skips all subsequent
steps in a job once an earlier one fails (no `continue-on-error` here); a skipped step never
ran, so it can't have "passed" either.

See the [main branch README](https://github.com/jaffadog/plugin-ci-fixtures/blob/main/README.md)
for how this repo's branch-per-fixture scheme works.
