module.exports = function (app) {
  const plugin = {
    id: 'api-misuse',
    name: 'API Misuse (CI fixture)',
    schema: {
      type: 'object',
      properties: {}
    },
    start: function () {
      // Each of these accesses an internal/misuse-tier property flagged by
      // the API-misuse scan (error, not warning) — grouped here so one
      // fixture exercises the whole "misuse" pattern set, not just
      // app.server. Static text matches — none of these need to throw or
      // even be reachable to be caught, but they're real property reads in
      // a realistic position (inside start()) rather than dead code.
      const server = app.server
      const deltaCache = app.deltaCache
      const pluginsMap = app.pluginsMap
      const historyApiHttpRegistry = app.historyApiHttpRegistry
      app.setPluginStatus('Started')
    },
    stop: function () {}
  }

  return plugin
}
