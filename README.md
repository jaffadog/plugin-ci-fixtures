# fixture: vulnerable-dependency

Declares a real, known-vulnerable dependency: `minimist@0.0.8`, which has a critical
prototype-pollution advisory ([GHSA-xvch-5gv4-984h](https://github.com/advisories/GHSA-xvch-5gv4-984h)).
Proves the `build` job's `npm audit` step, added alongside this fixture, actually detects and
reports real-world vulnerabilities — not just that the step runs without crashing.

**Expected result: green, with a warning annotation.** `npm audit` never fails the build (it's
advisory-only, same philosophy as `api-usage-warnings`/`stray-files`), so the run stays green;
what to check is the `::warning::` itself. Verified locally against the real, production step
script before pushing: `npm audit --json` against this exact dependency reports
`critical: 1, total: 1`, and the step's own parser correctly turns that into
`::warning::npm audit found 1 known vulnerability in dependencies (critical: 1, high: 0,
moderate: 0, low: 0)...`. Like `stray-files`/`api-usage-warnings`, a passing run here is
necessary but not sufficient — the conclusion alone can't distinguish "the warning still fires"
from "the step silently stopped detecting anything"; that needs a human (or a log-content
check) to actually read the `Run npm audit` step's output in the `Build` job.

See the [main branch README](https://github.com/jaffadog/plugin-ci-fixtures/blob/main/README.md)
for how this repo's branch-per-fixture scheme works.
