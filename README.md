# fixture: api-misuse

`start()` reads four internal server properties flagged by the "misuse" (hard error) tier of
the API-usage scan: `app.server`, `app.deltaCache`, `app.pluginsMap`, and
`historyApiHttpRegistry`. All four are grouped into this one fixture rather than one fixture
per property, since they're all the same severity and the same scan — this is the "misuse"
category specifically, not the "deprecated" category (`setProviderStatus` etc.) or the
warning-tier anti-patterns, both of which are covered by
[`fixture/api-usage-warnings`](https://github.com/jaffadog/plugin-ci-fixtures/tree/fixture/api-usage-warnings)
instead — a different code path in the same scan.

**Expected result: red.** Fails "Scan for deprecated and misused SignalK APIs" with all four
reported together — static text matches, so none of the four lines need to execute to be
caught. Every other structural check passes (verified locally against the extracted check
scripts before pushing).

See the [main branch README](https://github.com/jaffadog/plugin-ci-fixtures/blob/main/README.md)
for how this repo's branch-per-fixture scheme works.
