# fixture: integration-smoke

A valid plugin (same shape as `good-plugin`) with `enable-signalk-integration: true` and a
`test:integration` script that pings the running server. Proves the `signalk-integration`
job's core mechanism works in isolation — real server starts, plugin installs and loads,
provider API checks pass, `test:integration` reaches the server — before layering
`requires-cascade`-style scenarios on top of it.

**Expected result: green**, including the `Integration` job (not skipped, unlike every other
fixture so far).
