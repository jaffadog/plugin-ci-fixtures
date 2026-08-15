# plugin-ci-fixtures

Regression fixtures for [SignalK/signalk-server](https://github.com/SignalK/signalk-server)'s
reusable [`plugin-ci.yml`](https://github.com/SignalK/signalk-server/blob/master/.github/workflows/plugin-ci.yml)
workflow.

**Status**: staged under a personal account for now. The intent is to transfer this repo into
the `SignalK` GitHub org once the fixture set is proven out — ask a SignalK maintainer about
status if you're picking this up and it's still here.

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
| `fixture/good-plugin` | Baseline — a fully valid plugin | **Green** |
| `fixture/prepare-double-build` | A `prepare` script that would double-build if `--ignore-scripts` weren't applied consistently | **Green** — the build-count marker must show exactly 1 |
| `fixture/malicious-postinstall` | A `postinstall` script that writes a marker file | **Green** — the marker must be *absent*, proving install-time scripts never ran |
| `fixture/native-optional-broken` | An optional native dependency the plugin doesn't actually handle the absence of | **Red** on the test run — passes the static App Store scan (warning only) but fails once tests run against the real, uncompiled install |
| `fixture/requires-cascade` | `signalk.requires` pointing at another fixture branch | **Green**, with `enable-signalk-integration: true` — the required package must install with `--ignore-scripts` same as the plugin itself |

More fixtures (bad schema, bad lifecycle, deprecated API usage, missing pack files, stray files,
a required — not optional — native addon) are planned; this list will grow.
