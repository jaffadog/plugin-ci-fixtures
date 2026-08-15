# fixture: bad-schema

`plugin.schema` is a function that throws. Entry point and lifecycle checks are otherwise
valid and should pass — only `schema()` is broken.

**Expected result: red.** Fails "Validate plugin.schema() if defined" specifically; every other
structural check passes.

See the [main branch README](https://github.com/jaffadog/plugin-ci-fixtures/blob/main/README.md)
for how this repo's branch-per-fixture scheme works.
