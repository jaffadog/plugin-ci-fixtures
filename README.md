# fixture: stray-files

`test` writes `stray-debug-output.log` (untracked, not gitignored) before running the real test
suite — simulating a build/test tool that leaves debug output behind.

**Expected result: red.** Fails the stray-files check (`git ls-files --others --exclude-standard`)
after the desktop job's test step runs. Every structural check and the test suite itself pass.

See the [main branch README](https://github.com/jaffadog/plugin-ci-fixtures/blob/main/README.md)
for how this repo's branch-per-fixture scheme works.
