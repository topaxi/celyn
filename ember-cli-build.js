/* eslint-env node */

const EmberApp = require('ember-cli/lib/broccoli/ember-app')
const Funnel = require('broccoli-funnel')

const MATERIAL_ICONFONT = 'node_modules/material-design-icons/iconfont'

module.exports = function(defaults) {
  let app = new EmberApp(defaults, {
    sassOptions: {
      includePaths: [
        MATERIAL_ICONFONT
      ]
    }
  })

  let materialIconFonts = new Funnel(MATERIAL_ICONFONT, {
    destDir: 'assets',
    include: [ '*.eot', '*.ijmap', '*.svg', '*.ttf', '*.woff', '*.woff2' ]
  })

  return app.toTree([ materialIconFonts ])
}
