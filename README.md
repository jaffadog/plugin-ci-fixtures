# fixture: native-required

`bcrypt` is a regular (required, not optional) dependency, required unconditionally. Unlike
[`fixture/native-optional-broken`](https://github.com/jaffadog/plugin-ci-fixtures/tree/fixture/native-optional-broken),
this should fail immediately and directly — no need to wait for the reinstalled-test-run step.

**Expected result: red.** Fails "Simulate App Store install (--ignore-scripts)" directly — the
static native-addon scan errors on a *required* native addon (`process.exit(1)`), which aborts
the rest of the desktop job (Lint, Check formatting, Run tests never execute).

See the [main branch README](https://github.com/jaffadog/plugin-ci-fixtures/blob/main/README.md)
for how this repo's branch-per-fixture scheme works.
