module.exports = function (app) {
  const plugin = {
    id: 'prepare-double-build',
    name: 'Prepare Double Build (CI fixture)',
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
