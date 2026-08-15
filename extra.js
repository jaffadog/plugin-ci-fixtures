// Referenced by the "./extra" exports sub-path, but deliberately excluded
// by package.json's "files" allowlist — npm pack won't include it, so
// consumers importing this sub-path would get a 404 after install.
module.exports = {}
