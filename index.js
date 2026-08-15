module.exports = function (app) {
  const plugin = {
    id: 'integration-smoke',
    name: 'Integration Smoke (CI fixture)',
    schema: {
      type: 'object',
      properties: {}
    },
    start: function () {
      app.setPluginStatus('Started')
    },
    stop: function () {}
  }

  return plugin
}
