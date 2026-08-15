// Every function below is a static text match for one warning-tier pattern
// in the API-usage scan (deprecated APIs, direct Express routes, file-
// storage anti-patterns, security anti-patterns) — grouped into one fixture
// since they're all the same severity (warning, never fails the build)
// rather than one fixture per pattern. None of these are called anywhere;
// the scan is a static text match and does not need them to execute, and
// keeping them uncalled means this file can't break the plugin at runtime.

const fs = require('fs')
const path = require('path')

// ── Deprecated APIs ──────────────────────────────────────────
function legacyProviderStatus(app) {
  app.setProviderStatus('legacy status')
}
function legacyProviderError(app) {
  app.setProviderError('legacy error')
}

// ── Direct Express route instead of registerWithRouter() ────
function registerRouteDirectly(app) {
  app.get('/plugins/example/status', (req, res) => res.json({ ok: true }))
}

// ── File storage anti-patterns ───────────────────────────────
function writeNextToPluginCode(data) {
  fs.writeFileSync(path.join(__dirname, 'cache.json'), JSON.stringify(data))
}
function writeIntoServerCwd(data) {
  fs.writeFileSync(path.join(process.cwd(), 'cache.json'), JSON.stringify(data))
}
function readConfigPathDirectly(app) {
  return app.config.configPath
}

// ── Security anti-patterns ───────────────────────────────────
function readSecurityStrategyDirectly(app) {
  return app.securityStrategy
}
function branchOnDummySecurity(security) {
  return security.isDummy()
}
function readSkPrincipalDirectly(req) {
  return req.skPrincipal
}
function useAdminWriteMiddlewareDirectly(app) {
  return app.addAdminWriteMiddleware
}
function useWriteMiddlewareDirectly(app) {
  return app.addWriteMiddleware
}

module.exports = {
  legacyProviderStatus,
  legacyProviderError,
  registerRouteDirectly,
  writeNextToPluginCode,
  writeIntoServerCwd,
  readConfigPathDirectly,
  readSecurityStrategyDirectly,
  branchOnDummySecurity,
  readSkPrincipalDirectly,
  useAdminWriteMiddlewareDirectly,
  useWriteMiddlewareDirectly
}
