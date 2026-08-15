# fixture: restart-broken

`stop()` always succeeds, but the *second* `start()` call — the restart re-entry the server
does when a user toggles the plugin off then on again, or changes its config — throws a
genuine error (not one of the "mock gap" message patterns the lifecycle check downgrades to a
warning).

This is a distinct failure path from
[`fixture/bad-lifecycle`](https://github.com/jaffadog/plugin-ci-fixtures/tree/fixture/bad-lifecycle),
which fails at `stop()` itself — the lifecycle check runs start → stop → start again, and
`stop()` throwing exits before the second `start()` is ever reached, so the two fixtures
necessarily exercise different code in the same check and can't be merged into one.

**Expected result: red.** Fails "Test plugin stop()/start() lifecycle" specifically on
`start({}) again` — verified locally against the extracted check script before pushing: the
first `start()` and `stop()` both log "ok", then the second `start()` throws and the check
exits 1. Confirmed against a real run: every step after it — the API-usage scan, npm pack,
ES2023, App Store, tests, stray-files — shows `skipped`. GitHub Actions skips all subsequent
steps in a job once an earlier one fails (no `continue-on-error` here), so none of those checks
actually execute on this fixture.

See the [main branch README](https://github.com/jaffadog/plugin-ci-fixtures/blob/main/README.md)
for how this repo's branch-per-fixture scheme works.
