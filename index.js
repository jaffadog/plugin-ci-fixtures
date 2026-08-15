// Exports a plain object instead of the required constructor function —
// e.g. a plugin mistakenly converted to export a singleton instance.
module.exports = {
  id: 'bad-entry-point',
  name: 'Bad Entry Point (CI fixture)',
  start: function () {},
  stop: function () {}
}
