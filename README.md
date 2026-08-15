# fixture: stray-files

`test` writes `stray-debug-output.log` (untracked, not gitignored) before running the real test
suite — simulating a build/test tool that leaves debug output behind.

**Expected result: green, with a warning annotation.** Confirmed by reading the actual job log
(not assumed) — the stray-files check is advisory only: it emits `::warning::` and lists the
file, but never exits non-zero, so it can't fail the build. That means this fixture can't be
verified the same way as the others (assert overall conclusion) — confirming it actually still
works requires checking the run's warning annotations specifically, e.g.
`gh api repos/OWNER/plugin-ci-fixtures/actions/runs/<id>/jobs --jq '...'` or eyeballing the job
summary for "Build/test left untracked files in the repository". A simple pass/fail check of the
overall run conclusion will always read "green" here regardless of whether the warning still
fires correctly — that's a real, known gap in this fixture's regression coverage, not something
this fixture currently closes.

See the [main branch README](https://github.com/jaffadog/plugin-ci-fixtures/blob/main/README.md)
for how this repo's branch-per-fixture scheme works.
