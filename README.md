# fixture: bad-package-metadata

Three distinct error-tier checks in the package.json validation step, all in one fixture since
they're independent field-presence/validity rules rather than variants of the same mechanism
(unlike e.g. `malicious-install-scripts`'s three script hooks) — a regression in any one of
them would still show up as a missing error line in the log even though the others still fire:

- No `keywords` array at all, so the required `signalk-node-server-plugin` keyword is missing.
- No `main` and no `exports` field.
- `"version": "1.0"` — not valid semver.

`index.js` is still a fully valid plugin, reachable via the entry-resolution fallback to
`index.js` when `main`/`exports` are absent — so the entry-point, schema, lifecycle, and
API-usage checks all still run and pass normally, isolating the failure to package.json
validation specifically.

**Expected result: red.** Fails "Validate package.json" with all three errors reported
together — verified locally against the extracted check script before pushing. Every other
structural check passes.

See the [main branch README](https://github.com/jaffadog/plugin-ci-fixtures/blob/main/README.md)
for how this repo's branch-per-fixture scheme works.
