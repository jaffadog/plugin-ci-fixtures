# fixture: malicious-install-scripts

Regression test for the `--ignore-scripts` install-fidelity fixes made across the `build`,
`desktop`, and `signalk-integration` jobs — covering all three risky install-time hooks
together (`preinstall`, `install`, `postinstall`; the same grouping `plugin-ci.yml`'s own
package.json validator already flags as "risky scripts"), rather than one fixture per script
name. Each appends its own name to `install-scripts-ran.log` if it ever executes.

**Expected result: green.** The test asserts the log is empty at the end of the desktop job's
pipeline — proving none of the three ever ran anywhere along the way, matching how the real
SignalK server installs plugins (`--ignore-scripts`, always).

See the [main branch README](https://github.com/jaffadog/plugin-ci-fixtures/blob/main/README.md)
for how this repo's branch-per-fixture scheme works.
