# fixture: bad-lifecycle

`stop()` unconditionally throws a genuine error (not one of the "mock gap" message patterns the
lifecycle check downgrades to a warning). Entry point and schema are otherwise valid.

**Expected result: red.** Fails "Test plugin stop()/start() lifecycle" on the first `stop()`
call, right after `start({})` succeeds.

See the [main branch README](https://github.com/jaffadog/plugin-ci-fixtures/blob/main/README.md)
for how this repo's branch-per-fixture scheme works.
