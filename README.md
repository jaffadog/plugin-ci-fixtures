# fixture: bad-lifecycle

`stop()` unconditionally throws a genuine error (not one of the "mock gap" message patterns the
lifecycle check downgrades to a warning). Entry point and schema are otherwise valid.

**Expected result: red.** Fails "Test plugin stop()/start() lifecycle" on the first `stop()`
call, right after `start({})` succeeds. Confirmed against a real run: every step after it — the
API-usage scan, npm pack, ES2023, App Store, tests, stray-files — shows `skipped`. GitHub
Actions skips all subsequent steps in a job once an earlier one fails (no `continue-on-error`
here), so none of those checks actually execute on this fixture.

See the [main branch README](https://github.com/jaffadog/plugin-ci-fixtures/blob/main/README.md)
for how this repo's branch-per-fixture scheme works.
