# fixture: api-usage-warnings

`anti-patterns.js` contains eleven uncalled helper functions, each a static text match for one
warning-tier pattern in the API-usage scan: two deprecated APIs (`setProviderStatus`,
`setProviderError`), one direct-Express-route anti-pattern, three file-storage anti-patterns
(writing relative to `__dirname` or `process.cwd()`, reading `app.config.configPath`
directly), and five security anti-patterns (`app.securityStrategy`, `isDummy()`,
`req.skPrincipal`, `addAdminWriteMiddleware`, `addWriteMiddleware`). None of the functions are
called anywhere — the scan is a static text match and doesn't need them to execute, and keeping
them uncalled means this file can't break the plugin at runtime regardless of what it references.

This is the warning tier of the same scan
[`fixture/api-misuse`](https://github.com/jaffadog/plugin-ci-fixtures/tree/fixture/api-misuse)
exercises for the error tier (`app.server` and friends) — grouped into one fixture per severity
rather than one fixture per pattern, since eleven near-identical branches would add noise
without adding real regression coverage.

**Expected result: green, with eleven warning annotations.** None of these patterns fail the
build — verified locally against the extracted check script before pushing (all eleven
reported, exit 0). Like
[`fixture/stray-files`](https://github.com/jaffadog/plugin-ci-fixtures/tree/fixture/stray-files),
a passing run here is necessary but not sufficient: the run conclusion alone can't distinguish
"all eleven warnings still fire" from "the scan silently stopped matching some of them" — that
needs a human to actually read the job log/step summary.

The API-usage scan is also now gated to run on only one representative desktop combination
(`ubuntu-latest` + the first entry in `node-versions`), since it's pure static analysis and its
result can't differ by OS/Node version — the other 11 desktop jobs show `skip` for that step
and the same "pass" as always for everything else. Unlike the error-tier fixtures, warnings
never cause a step to exit non-zero, so there's no cascading skip here — reasoned from the
script's own logic (`errors.length > 0` gates the only `exit 1`, not `warnings`), not yet
confirmed against a live run since this fixture hasn't been re-triggered against the updated
`plugin-ci.yml` as of this writing. The per-job "Write job summary" table should show
`⚠️ 11 warnings` on the representative job's "API usage" row instead of a bare "pass".

See the [main branch README](https://github.com/jaffadog/plugin-ci-fixtures/blob/main/README.md)
for how this repo's branch-per-fixture scheme works.
