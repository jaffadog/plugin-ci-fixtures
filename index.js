module.exports = function (app) {
  let startCount = 0
  const plugin = {
    id: 'restart-broken',
    name: 'Restart Broken (CI fixture)',
    schema: {
      type: 'object',
      properties: {}
    },
    start: function () {
      startCount++
      if (startCount > 1) {
        // Fails specifically on restart — the second start() call after a
        // stop() — e.g. a plugin that fails to re-acquire a resource stop()
        // released. Not one of the "mock gap" message patterns (e.g. "X is
        // not a function", "Cannot read propert...") the lifecycle check
        // downgrades to a warning — meant to read as a genuine plugin bug.
        throw new Error('intentional restart failure for CI fixture testing')
      }
      app.setPluginStatus('Started')
    },
    stop: function () {}
  }

  return plugin
}
