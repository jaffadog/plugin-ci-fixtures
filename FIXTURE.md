# fixture: malicious-postinstall

Regression test for the `--ignore-scripts` install-fidelity fixes made across the `build`,
`desktop`, and `signalk-integration` jobs. `postinstall` writes `postinstall-ran.marker` if it
ever executes.

**Expected result: green.** The test asserts the marker is *absent* at the end of the desktop
job's pipeline — proving install-time scripts never ran anywhere along the way, matching how
the real SignalK server installs plugins (`--ignore-scripts`, always).
