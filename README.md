# fixture: native-optional-broken

`bcrypt` is declared as an `optionalDependency` and required unconditionally at the top of
`index.js`, with no try/catch — a plugin that assumes an optional native dependency is always
there.

**Expected result: mixed.** The early structural checks (entry point, schema, lifecycle) pass —
`build`/`desktop`'s "Install dependencies" step compiles `bcrypt` via the targeted `npm rebuild`,
so those checks run against a fully working install. The static App Store native-addon scan only
*warns* (bcrypt is optional, not required). But the "Reinstall without native compilation" step
wipes `node_modules` and reinstalls with `--ignore-scripts` and no rebuild — under those
conditions `require('bcrypt')` throws (`Cannot find module ... bcrypt_lib.node`), so **the test
run fails**. That's the point: the static scan's warning alone would never have caught this: only
actually running code against the real, uncompiled install does.

See the [main branch README](https://github.com/jaffadog/plugin-ci-fixtures/blob/main/README.md)
for how this repo's branch-per-fixture scheme works.
