# fixture: requires-cascade

`signalk.requires` points at [`fixture/requires-cascade-dep`](https://github.com/jaffadog/plugin-ci-fixtures/tree/fixture/requires-cascade-dep)
via `github:jaffadog/plugin-ci-fixtures#fixture/requires-cascade-dep` — a real npm-installable
git-URL specifier, used here instead of a published npm package since neither fixture is (or
should be) published. Regression test for the `signalk-integration` job's `signalk.requires`
cascade install honoring `--ignore-scripts` for the *required* package too, not just the plugin
under test.

**Expected result: green**, with `enable-signalk-integration: true`. `test:integration` checks
both that the server is reachable and that `requires-cascade-dep`'s `postinstall` marker is
*absent* under `/tmp/sk-test/node_modules/`.

See the [main branch README](https://github.com/jaffadog/plugin-ci-fixtures/blob/main/README.md)
for how this repo's branch-per-fixture scheme works.
