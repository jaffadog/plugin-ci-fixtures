module.exports = function (app) {
  const plugin = {
    id: 'bad-schema-default',
    name: 'Bad Schema Default (CI fixture)',
    schema: {
      type: 'object',
      properties: {
        excludedPaths: {
          type: 'array',
          title: 'Paths to exclude',
          default: ['self']
        }
      }
    },
    start: function (options) {
      // start({}) never exercises this — options.excludedPaths is simply
      // undefined there. It only breaks once a user saves the config
      // screen with the schema's own default value intact: 'self' is not
      // a valid SignalK path segment on its own (it should be something
      // like 'vessels.self...'), but the plugin never validates before use.
      if (Array.isArray(options.excludedPaths) && options.excludedPaths.includes('self')) {
        throw new Error("invalid path prefix in excludedPaths: 'self' is not a valid SignalK path segment")
      }
      app.setPluginStatus('Started')
    },
    stop: function () {}
  }

  return plugin
}
