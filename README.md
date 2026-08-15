# plugin-ci-fixtures

Regression fixtures for [SignalK/signalk-server](https://github.com/SignalK/signalk-server)'s
reusable [`plugin-ci.yml`](https://github.com/SignalK/signalk-server/blob/master/.github/workflows/plugin-ci.yml)
workflow.

**Status**: staged under a personal account for now. The intent is to transfer this repo into
the `SignalK` GitHub org once the fixture set is proven out — ask a SignalK maintainer about
status if you're picking this up and it's still here.

**If/when this repo moves to a new owner**: every cross-branch link in this repo (main → fixture
branches, and each fixture branch back to main) is a full GitHub URL, since plain relative
markdown links can't express "this repo, whichever branch, regardless of owner" — crossing
branches on GitHub always requires `/OWNER/REPO/blob/BRANCH/...`. All of them contain the literal
string `jaffadog/plugin-ci-fixtures`, so updating every branch after a transfer is one command per
branch: `git grep -rl jaffadog | xargs sed -i 's/jaffadog/NEW_OWNER/' && git commit -am "update owner after transfer" && git push`.

## How this repo works

There is no code on `main` other than this README. Each **branch** is a minimal, deliberately
built (good or broken) plugin, with its own `.github/workflows/signalk-ci.yml` caller workflow
that invokes `plugin-ci.yml`. Pushing to a branch triggers that branch's own CI run — check the
Actions tab, filtered by branch, to see results.

Each fixture is scoped to exercise **one** specific behavior of `plugin-ci.yml`, so a red run on
a branch that's supposed to fail is a *pass* for the fixture, and vice versa. See the table below
for what each branch expects.

### Testing against a specific `plugin-ci.yml` branch/ref

GitHub Actions does not allow `jobs.<id>.uses` to be a dynamic expression — the `@ref` in each
fixture's caller workflow has to be a literal string. To point the whole suite at a
signalk-server branch other than `master` (e.g. while a PR to `plugin-ci.yml` is still open),
edit the `uses: OWNER/signalk-server/.github/workflows/plugin-ci.yml@<ref>` line on each branch
you care about and push. There's no way around this without changing `plugin-ci.yml`'s own
contract, which isn't worth it just for this.

**`OWNER` matters.** A branch that only exists on a contributor's fork (i.e. any PR that hasn't
merged yet) is not resolvable as `SignalK/signalk-server@that-branch` — the upstream repo simply
doesn't have it. Point at the fork that actually has the branch (e.g.
`jaffadog/signalk-server/.github/workflows/plugin-ci.yml@feat/some-branch`), and switch back to
`SignalK/signalk-server@master` once it's merged. Confirm with
`git ls-remote --heads <repo-url> <branch>` before assuming — an unresolvable `uses:` fails the
whole run immediately (0s, before any job starts), which looks identical to a config typo, so
it's worth checking directly rather than guessing.

## Fixtures

| Branch | Exercises | Expected CI result |
| --- | --- | --- |
| [`fixture/good-plugin`](https://github.com/jaffadog/plugin-ci-fixtures/tree/fixture/good-plugin) | Baseline — a fully valid plugin | **Green** |
| [`fixture/bad-package-metadata`](https://github.com/jaffadog/plugin-ci-fixtures/tree/fixture/bad-package-metadata) | Missing the `signalk-node-server-plugin` keyword, missing `main`/`exports`, and an invalid (non-semver) `version` | **Red** — fails "Validate package.json" with all three reported together |
| [`fixture/bad-entry-point`](https://github.com/jaffadog/plugin-ci-fixtures/tree/fixture/bad-entry-point) | Entry point exports a plain object instead of a constructor function | **Red** — fails "Validate entry point"; schema/lifecycle checks silently skip rather than double-reporting the same root cause |
| [`fixture/prepare-double-build`](https://github.com/jaffadog/plugin-ci-fixtures/tree/fixture/prepare-double-build) | A `prepare` script that would double-build if `--ignore-scripts` weren't applied consistently | **Green** — the build-count marker must show exactly 1 |
| [`fixture/malicious-install-scripts`](https://github.com/jaffadog/plugin-ci-fixtures/tree/fixture/malicious-install-scripts) | `preinstall`/`install`/`postinstall` scripts (the same "risky scripts" group `plugin-ci.yml` itself flags) that log if they ever run | **Green** — the log must be empty, proving none of the three ever ran |
| [`fixture/integration-smoke`](https://github.com/jaffadog/plugin-ci-fixtures/tree/fixture/integration-smoke) | `enable-signalk-integration: true` on an otherwise-valid plugin, with a `test:integration` script that pings the server | **Green**, including the `Integration` job — proves the job's core mechanism works before layering harder scenarios on top |
| [`fixture/vite-build-node-split`](https://github.com/jaffadog/plugin-ci-fixtures/tree/fixture/vite-build-node-split) | The exact real-world scenario that motivated this PR: `vite` (`engines.node: "^20.19.0 \|\| >=22.12.0"`) as the build tool on `build-node-version: '24'`, tested across `node-versions: ["18","20","22","24","26"]`, plus a `signalk-integration-matrix` pinning sk2.0.0+node18 and sk-latest+node24 | **Green** — before this PR, the Node 18 job would have tried to run `vite build` itself and failed outright |
| [`fixture/native-optional-broken`](https://github.com/jaffadog/plugin-ci-fixtures/tree/fixture/native-optional-broken) | An optional native dependency (`bcrypt`) the plugin requires unconditionally, no try/catch | **Red** on the test run — passes the static App Store scan (warning only) but fails once tests run against the real, uncompiled install. `armv7` passes — it has no equivalent uncompiled-reinstall step |
| [`fixture/requires-cascade`](https://github.com/jaffadog/plugin-ci-fixtures/tree/fixture/requires-cascade) | `signalk.requires` pointing at [`fixture/requires-cascade-dep`](https://github.com/jaffadog/plugin-ci-fixtures/tree/fixture/requires-cascade-dep) via a `github:` git-URL specifier | **Green**, with `enable-signalk-integration: true` — `test:integration` confirms the server is reachable *and* that the required package's `postinstall` never ran |
| [`fixture/bad-schema`](https://github.com/jaffadog/plugin-ci-fixtures/tree/fixture/bad-schema) | `plugin.schema()` throws | **Red** — fails "Validate plugin.schema() if defined" specifically |
| [`fixture/bad-lifecycle`](https://github.com/jaffadog/plugin-ci-fixtures/tree/fixture/bad-lifecycle) | `stop()` throws a real error (not a "mock gap" message pattern) | **Red** — fails "Test plugin stop()/start() lifecycle" on the first `stop()` call |
| [`fixture/restart-broken`](https://github.com/jaffadog/plugin-ci-fixtures/tree/fixture/restart-broken) | `stop()` succeeds, but the *second* `start()` (the restart re-entry) throws | **Red** — fails the same lifecycle check as `bad-lifecycle`, but at a distinct step: `stop()` throwing exits before the second `start()` is ever reached, so this is separate coverage, not a duplicate |
| [`fixture/bad-schema-default`](https://github.com/jaffadog/plugin-ci-fixtures/tree/fixture/bad-schema-default) | `start({})` succeeds, but `start()` with the plugin's own `schema`-declared default config throws | **Red** — fails the same lifecycle check at a third distinct step (schema-defaults activation), proving the mechanism this fixture was built to prove actually works |
| [`fixture/vulnerable-dependency`](https://github.com/jaffadog/plugin-ci-fixtures/tree/fixture/vulnerable-dependency) | A real, known-vulnerable dependency (`minimist@0.0.8`, critical prototype-pollution CVE) | **Green, with a warning annotation** — `npm audit` is advisory-only; like `stray-files`/`api-usage-warnings`, a passing run here needs a human to read the actual warning |
| [`fixture/fail-on-warning`](https://github.com/jaffadog/plugin-ci-fixtures/tree/fixture/fail-on-warning) | Identical plugin content to `fixture/api-usage-warnings`, but with `fail-on-warning: true` set | **Red** — the same findings that make `api-usage-warnings` green now fail the build, proving the opt-in actually works |
| [`fixture/api-misuse`](https://github.com/jaffadog/plugin-ci-fixtures/tree/fixture/api-misuse) | `start()` reads `app.server`, `app.deltaCache`, `app.pluginsMap`, and `historyApiHttpRegistry` — the full "misuse" (error) tier of the API-usage scan | **Red** — fails the API-misuse scan with all four reported together (static text matches; none need to execute) |
| [`fixture/api-usage-warnings`](https://github.com/jaffadog/plugin-ci-fixtures/tree/fixture/api-usage-warnings) | The eleven warning-tier patterns in the same scan: deprecated APIs, a direct-Express-route anti-pattern, 3 file-storage anti-patterns, 5 security anti-patterns | **Green, with eleven warning annotations** — like `stray-files`, a passing run here is necessary but not sufficient; see this branch's own README |
| [`fixture/missing-pack-files`](https://github.com/jaffadog/plugin-ci-fixtures/tree/fixture/missing-pack-files) | An `exports` sub-path pointing at a file excluded by `files` | **Red** — fails "Verify npm pack includes all required files". `main`'s own file is always force-included by `npm pack` regardless of `files` (confirmed locally) — this fixture uses a named `exports` sub-path instead, since that *isn't* force-included |
| [`fixture/stray-files`](https://github.com/jaffadog/plugin-ci-fixtures/tree/fixture/stray-files) | `test` writes an untracked file as a side effect | **Green, with a warning annotation** — the stray-files check is advisory-only (`::warning::`, never fails the build); see this branch's own README for why a passing run here doesn't fully verify the check still works |
| [`fixture/native-required`](https://github.com/jaffadog/plugin-ci-fixtures/tree/fixture/native-required) | `bcrypt` as a *required* (not optional) dependency | **Red** — fails "Simulate App Store install" directly (the static scan errors on a required native addon), aborting the rest of the desktop job before the test step even runs |

`fixture/requires-cascade-dep` is a companion package for `requires-cascade` above, not an
independent scenario — its own CI run should be green (it's a normal valid plugin), but its
purpose is to be installed *by* `requires-cascade` via `signalk.requires`.

Every planned fixture from the original list is now built, plus eight added later by auditing
`plugin-ci.yml`'s own CI-summary checklist (and, separately, signalk-plugin-registry's scoring)
against this suite and closing what each found uncovered: `vite-build-node-split` (reproduces
the PR's own original motivating bug report end-to-end), the extended `api-misuse` and new
`api-usage-warnings` (the full API-usage scan, both severity tiers), `restart-broken` (the
lifecycle check's second-`start()` failure path, distinct from `bad-lifecycle`'s `stop()`
failure), `bad-package-metadata` / `bad-entry-point` (the two highest-priority
package.json/entry-point negative cases), and `bad-schema-default` / `vulnerable-dependency`
(proving the two `plugin-ci.yml` capabilities — schema-derived-defaults activation and `npm
audit` — added directly in response to the signalk-plugin-registry comparison below). `armv7`
and the `Integration` job don't run every check the `desktop` job does (see individual fixture
READMEs for which ones each skips) — that's a real scope boundary, not a gap to fix.

Known remaining gaps in this checklist, not yet built: `plugin.schema()` returning a non-object,
`plugin.schema()` containing functions/symbols/circular references/`undefined` property values
(a JSON-serialization-safety check, distinct from the "returns non-object" and "throws" paths,
found while re-verifying this list — also zero coverage), or omitting
`type`/`properties`/`oneOf`/`anyOf` (only the throws-an-error path is covered by `bad-schema`),
`node:sqlite` usage without a matching `engines.node`, hardcoded `/home/user/...` paths,
ES2024+ syntax tripping the ES2023/Cerbo GX compatibility check, bundling a private copy of
`baconjs`, and a `webapp`-keyword plugin declaring React < 19.

`validate-pkg.js` also has several checks the CI job's own step-summary text never mentions,
found only by reading the full check source rather than that summary — so they were missed in
the first pass above too. `bad-package-metadata` now covers the invalid-semver-`version` one;
still zero coverage on: a warning when `preinstall`/`postinstall`/`install` scripts are declared
in `package.json` (separate from the actual `--ignore-scripts` enforcement in the "App Store
install" step), a warning when `engines.node` is entirely absent (distinct from the
`node:sqlite`-specific engines mismatch above), a warning when no `CHANGELOG.md`-family file or
`.github/release.yml` exists, a warning when `signalk.screenshots` is empty, and a warning when
`signalk.appIcon`/`signalk.screenshots` paths don't resolve to real files in the repo.

### Differences from signalk-plugin-registry's scoring

[SignalK/signalk-plugin-registry](https://github.com/SignalK/signalk-plugin-registry) runs its
own, independent test-and-score harness over published plugins. Comparing its scoring
dimensions (`test-harness/score.ts`, `runner.ts`, `detect-providers.ts`, `app-shim.ts`,
`core-deps.ts`) against `plugin-ci.yml` surfaced real scope differences — not fixture gaps,
since there's no `plugin-ci.yml` behavior for a fixture to exercise. Fixing these would mean
changing `plugin-ci.yml` itself, not this suite:

- **Activation config**: `plugin-ci.yml`'s lifecycle check only ever calls `start({})` with a
  literally empty config. The registry additionally activates with config built from the
  plugin's own `schema` defaults (`extractSchemaDefaults`). A bug that only fires once a
  schema-default field is actually populated (e.g. an assumed-present default array) passes
  `plugin-ci.yml` and fails the registry.
- **API misuse detection**: `plugin-ci.yml` statically greps source for ~15 hardcoded known-bad
  patterns. The registry wraps its mock `app` in a `Proxy` and dynamically captures *any*
  access to a property the shim doesn't define — it catches unknown/future misuse patterns for
  free, but (per its `TestResults`/score wiring) doesn't currently turn that into a score
  penalty or an actionable message the way `plugin-ci.yml`'s scan does for the patterns it
  knows about. Neither approach subsumes the other.
- **Provider detection**: `plugin-ci.yml`'s mock stubs `registerResourceProvider`/
  `registerAutopilotProvider`/`registerWeatherProvider`/`registerHistoryProvider` as silent
  no-ops (so `start()` doesn't crash) but never records which were called — no "has-providers"
  equivalent. `registerRadarProvider` and `registerBLEProvider`/`bleApi` aren't stubbed at all,
  so a plugin calling either hits the lifecycle check's `isMockGap()` heuristic
  (`"X is not a function"` → downgraded to a warning) — meaning BLE/radar plugins can never get
  a real pass/fail from this check, only "maybe fine, our mock doesn't know this method."
- **No vulnerability scanning**: `plugin-ci.yml` has no `npm audit` step at all (verified via
  grep — nothing matches `npm audit` anywhere in the file). The registry tiers 20/15/10/0 points
  on critical/high/moderate advisory counts.
- **No core-dependency-freshness check**: the registry flags (`-80`, near-fatal) a plugin whose
  declared range on a core package (`@signalk/server-api`, `@canboat/canboatjs`, etc.) excludes
  that package's latest same-major release — a stale pin that holds the package back in every
  user's `~/.signalk` install. `plugin-ci.yml` does no registry-latest-version lookups anywhere.
- **Changelog/screenshots checked differently, not just independently**: both projects score
  "has a changelog" and "has screenshots," but not the same underlying fact.
  `plugin-ci.yml` checks the *source tree* for a `CHANGELOG.md`-family file or a
  `.github/release.yml` *declaration of intent*; the registry checks the *published tarball*
  plus an actual matching GitHub Release via the releases.atom feed — the real outcome. A
  plugin with `release.yml` but no release ever cut for a given version passes one and fails
  the other. Screenshots run the other way: `plugin-ci.yml` additionally verifies the declared
  paths resolve to real files in the repo; the registry only checks the array is non-empty.
- **Cross-repo coupling, untested by either side**: the registry's `plugin-ci-commands.ts`
  parses a plugin's own `.github/workflows/*.yml`, looking for a job that
  `uses: SignalK/signalk-server/.github/workflows/plugin-ci.yml` and reads `build-command`/
  `test-command` straight out of its `with:` block, as a fallback when a plugin's tarball tests
  aren't runnable. If `plugin-ci.yml` ever renamed those inputs or changed how they're declared,
  the registry's source-test fallback would silently break, and nothing in either repo's test
  suite would catch it.

## Running the whole suite

`fixtures.json` is the machine-readable manifest (branch → expected conclusion, plus an optional
`note` for fixtures whose expected conclusion alone doesn't fully verify them — e.g.
`stray-files`). `scripts/run-all.js` triggers every branch, polls until all runs complete, and
prints a table of expected vs. actual:

```
node scripts/run-all.js
```

Requires the `gh` CLI, authenticated, and Node. It's plain Node rather than a bash script on
purpose — macOS ships bash 3.2 by default, which has no associative arrays at all and silently
mis-parses `declare -A` instead of erroring, which would have made an earlier version of this
script quietly corrupt its own bookkeeping on exactly the platform this repo's CI matrix tests
against. Verified against real `gh run view`/`gh run list` output, not just syntax-checked.
