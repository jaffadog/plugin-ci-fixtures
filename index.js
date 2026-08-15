module.exports = function (app) {
  const plugin = {
    id: 'requires-cascade-dep',
    name: 'Requires Cascade Dependency (CI fixture)',
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
