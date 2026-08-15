module.exports = function (app) {
  const plugin = {
    id: 'api-misuse',
    name: 'API Misuse (CI fixture)',
    schema: {
      type: 'object',
      properties: {}
    },
    start: function () {
      // app.server is an internal property, not part of the plugin API.
      // The API-misuse scan is a static text match — this line does not
      // need to actually execute to be caught, but it's here in a
      // realistic position (inside start()) rather than as dead code.
      const internal = app.server
      app.setPluginStatus('Started')
    },
    stop: function () {}
  }

  return plugin
}
