module.exports = function (app) {
  const plugin = {
    id: 'missing-pack-files',
    name: 'Missing Pack Files (CI fixture)',
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
