# fixture: bad-schema-default

Proves the lifecycle check's schema-derived-defaults activation, added alongside this fixture:
`start({})` succeeds, but `start()` called with the plugin's own `schema`-declared default
config throws. The bug: `excludedPaths` defaults to `['self']`, and `start()` blindly trusts
that `'self'` is a valid SignalK path segment without validating it. `start({})` never
exercises this — `options.excludedPaths` is simply `undefined` there — so before this addition,
nothing in `plugin-ci.yml` could ever catch it.

This mirrors [SignalK/signalk-plugin-registry](https://github.com/SignalK/signalk-plugin-registry)'s
`test-harness/schema-defaults.ts`, which activates plugins the same way. Before this addition,
a plugin could pass every `plugin-ci.yml` check while still failing the registry's `activates`
scoring dimension for exactly this reason — see the "Differences from signalk-plugin-registry's
scoring" section of the main branch README.

**Expected result: red.** Fails "Test plugin stop()/start() lifecycle" specifically on
`start(<schema defaults>)`, distinct from every other lifecycle failure point (`bad-lifecycle`'s
`stop()`, `restart-broken`'s second `start({})`) — verified locally against the extracted check
script before pushing: `start({})` and the `{}`-based restart both log "ok", only the
schema-defaults activation throws. Every other structural check passes. Also verified that this
addition causes zero regressions across `good-plugin`, `bad-schema`, `bad-lifecycle`,
`prepare-double-build`, `restart-broken`, `api-misuse`, `api-usage-warnings`, and
`bad-package-metadata` — none of them declare a schema with real default values, so the new
check is a no-op for all of them, exactly as expected.

See the [main branch README](https://github.com/jaffadog/plugin-ci-fixtures/blob/main/README.md)
for how this repo's branch-per-fixture scheme works.
