# fixture: requires-cascade-dep

Companion package for [`fixture/requires-cascade`](https://github.com/jaffadog/plugin-ci-fixtures/tree/fixture/requires-cascade),
installed by the `signalk-integration` job's `signalk.requires` cascade via
`npm install github:jaffadog/plugin-ci-fixtures#fixture/requires-cascade-dep`. Not meant to be
tested standalone, though its own CI run (a normal valid plugin) should still be green.

Its `postinstall` writes `postinstall-ran.marker` if it ever executes — `requires-cascade`'s
`test:integration` checks for that marker's absence inside `/tmp/sk-test/node_modules/`.

See the [main branch README](https://github.com/jaffadog/plugin-ci-fixtures/blob/main/README.md)
for how this repo's branch-per-fixture scheme works.
