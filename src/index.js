module.exports = function (app) {
  const plugin = {
    id: 'vite-build-node-split',
    name: 'Vite build/node split (CI fixture)',
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
