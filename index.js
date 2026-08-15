module.exports = function (app) {
  const plugin = {
    id: 'api-usage-warnings',
    name: 'API Usage Warnings (CI fixture)',
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
