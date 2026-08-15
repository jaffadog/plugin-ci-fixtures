module.exports = function (app) {
  const plugin = {
    id: 'vulnerable-dependency',
    name: 'Vulnerable Dependency (CI fixture)',
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
