# fixture: vite-build-node-split

Recreates the exact real-world scenario that originally motivated
[PR #2853](https://github.com/SignalK/signalk-server/pull/2853): a plugin built with a
current Vite (`engines.node: "^20.19.0 || >=22.12.0"`, confirmed against the published
package — it flatly refuses to run on Node 18) that still needs to be installed and
tested against older Node/signalk-server combinations real users run.

- `build-node-version: '24'` — the only Node version that ever runs `vite build`.
- `node-versions: '["18", "20", "22", "24", "26"]'` — the downstream desktop/armv7 test
  matrix, including Node 18, which cannot run this plugin's own build tooling at all.
- `signalk-integration-matrix` pins exactly `node 18 + signalk-server 2.0.0` and
  `node 24 + signalk-server latest` — the same two combinations from the original bug
  report — instead of the full `node-versions` × `signalk-server-versions` cartesian
  product (which would otherwise also generate combinations like node18+latest that
  nothing here needs).

`vite` is a `devDependency`, never a runtime dependency — it's only installed into the
plugin's own checkout (each job's local `npm ci`) and is never a dependency of the
built `dist/index.js` that actually ships. It is never invoked outside the one `build`
job, on `build-node-version`.

**Expected result: fully green.** Before this PR, every job built independently on its
own Node version, so the Node 18 job would have tried to run `vite build` itself and
failed outright — the exact bug this PR fixes. Now `vite` runs exactly once, on
`build-node-version`, and every other job installs and tests that one pre-built
`dist/index.js`.

See the [main branch README](https://github.com/jaffadog/plugin-ci-fixtures/blob/main/README.md)
for how this repo's branch-per-fixture scheme works.
