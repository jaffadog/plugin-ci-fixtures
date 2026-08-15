# fixture: api-misuse

`start()` reads `app.server` — an internal server property, not part of the plugin API. This is
the "misuse" category (hard error), not the "deprecated" category (`setProviderStatus` etc.,
warning only) — a different code path in the same scan.

**Expected result: red.** Fails "Scan for deprecated and misused SignalK APIs" — a static text
match, so the line doesn't need to execute to be caught. Every other structural check passes.

See the [main branch README](https://github.com/jaffadog/plugin-ci-fixtures/blob/main/README.md)
for how this repo's branch-per-fixture scheme works.
