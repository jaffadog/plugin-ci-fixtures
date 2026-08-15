# fixture: missing-pack-files

`exports["./extra"]` points at `extra.js`, which is real (entry-point/schema/lifecycle checks
read straight from the checkout, so they pass fine) but excluded by `package.json`'s `files`
allowlist. Verified locally that `npm pack` force-includes whatever `main` points to regardless
of `files` — so this fixture uses a named `exports` sub-path instead, which is *not*
force-included, to actually trigger the check.

**Expected result: red.** Fails "Verify npm pack includes all required files" — `"exports" entry
./extra points to ./extra.js but it is NOT in the npm package`.

See the [main branch README](https://github.com/jaffadog/plugin-ci-fixtures/blob/main/README.md)
for how this repo's branch-per-fixture scheme works.
