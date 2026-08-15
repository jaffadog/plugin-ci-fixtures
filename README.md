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
| [`fixture/prepare-double-build`](https://github.com/jaffadog/plugin-ci-fixtures/tree/fixture/prepare-double-build) | A `prepare` script that would double-build if `--ignore-scripts` weren't applied consistently | **Green** — the build-count marker must show exactly 1 |
| [`fixture/malicious-install-scripts`](https://github.com/jaffadog/plugin-ci-fixtures/tree/fixture/malicious-install-scripts) | `preinstall`/`install`/`postinstall` scripts (the same "risky scripts" group `plugin-ci.yml` itself flags) that log if they ever run | **Green** — the log must be empty, proving none of the three ever ran |
| [`fixture/integration-smoke`](https://github.com/jaffadog/plugin-ci-fixtures/tree/fixture/integration-smoke) | `enable-signalk-integration: true` on an otherwise-valid plugin, with a `test:integration` script that pings the server | **Green**, including the `Integration` job — proves the job's core mechanism works before layering harder scenarios on top |
| [`fixture/vite-build-node-split`](https://github.com/jaffadog/plugin-ci-fixtures/tree/fixture/vite-build-node-split) | The exact real-world scenario that motivated this PR: `vite` (`engines.node: "^20.19.0 \|\| >=22.12.0"`) as the build tool on `build-node-version: '24'`, tested across `node-versions: ["18","20","22","24","26"]`, plus a `signalk-integration-matrix` pinning sk2.0.0+node18 and sk-latest+node24 | **Green** — before this PR, the Node 18 job would have tried to run `vite build` itself and failed outright |
| [`fixture/native-optional-broken`](https://github.com/jaffadog/plugin-ci-fixtures/tree/fixture/native-optional-broken) | An optional native dependency (`bcrypt`) the plugin requires unconditionally, no try/catch | **Red** on the test run — passes the static App Store scan (warning only) but fails once tests run against the real, uncompiled install. `armv7` passes — it has no equivalent uncompiled-reinstall step |
| [`fixture/requires-cascade`](https://github.com/jaffadog/plugin-ci-fixtures/tree/fixture/requires-cascade) | `signalk.requires` pointing at [`fixture/requires-cascade-dep`](https://github.com/jaffadog/plugin-ci-fixtures/tree/fixture/requires-cascade-dep) via a `github:` git-URL specifier | **Green**, with `enable-signalk-integration: true` — `test:integration` confirms the server is reachable *and* that the required package's `postinstall` never ran |

`fixture/requires-cascade-dep` is a companion package for `requires-cascade` above, not an
independent scenario — its own CI run should be green (it's a normal valid plugin), but its
purpose is to be installed *by* `requires-cascade` via `signalk.requires`.

| Branch | Exercises | Expected CI result |
| --- | --- | --- |
| [`fixture/bad-schema`](https://github.com/jaffadog/plugin-ci-fixtures/tree/fixture/bad-schema) | `plugin.schema()` throws | **Red** — fails "Validate plugin.schema() if defined" specifically |
| [`fixture/bad-lifecycle`](https://github.com/jaffadog/plugin-ci-fixtures/tree/fixture/bad-lifecycle) | `stop()` throws a real error (not a "mock gap" message pattern) | **Red** — fails "Test plugin stop()/start() lifecycle" on the first `stop()` call |
| [`fixture/api-misuse`](https://github.com/jaffadog/plugin-ci-fixtures/tree/fixture/api-misuse) | `start()` reads `app.server`, an internal property | **Red** — fails the API-misuse scan (a static text match; the line never needs to execute) |
| [`fixture/missing-pack-files`](https://github.com/jaffadog/plugin-ci-fixtures/tree/fixture/missing-pack-files) | An `exports` sub-path pointing at a file excluded by `files` | **Red** — fails "Verify npm pack includes all required files". `main`'s own file is always force-included by `npm pack` regardless of `files` (confirmed locally) — this fixture uses a named `exports` sub-path instead, since that *isn't* force-included |
| [`fixture/stray-files`](https://github.com/jaffadog/plugin-ci-fixtures/tree/fixture/stray-files) | `test` writes an untracked file as a side effect | **Green, with a warning annotation** — the stray-files check is advisory-only (`::warning::`, never fails the build); see this branch's own README for why a passing run here doesn't fully verify the check still works |
| [`fixture/native-required`](https://github.com/jaffadog/plugin-ci-fixtures/tree/fixture/native-required) | `bcrypt` as a *required* (not optional) dependency | **Red** — fails "Simulate App Store install" directly (the static scan errors on a required native addon), aborting the rest of the desktop job before the test step even runs |

Every planned fixture from the original list is now built, plus `vite-build-node-split`, which
reproduces the PR's own original motivating bug report end-to-end rather than a synthesized
scenario. `armv7` and the `Integration` job don't run every check the `desktop` job does (see
individual fixture READMEs for which ones each skips) — that's a real scope boundary, not a gap
to fix.

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
