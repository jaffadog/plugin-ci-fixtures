module.exports = function (app) {
  const plugin = {
    id: 'bad-package-metadata',
    name: 'Bad Package Metadata (CI fixture)',
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
