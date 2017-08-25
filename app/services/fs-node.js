/* eslint-env node */
/* global requireNode */
import Ember from 'ember'

const denodeify = requireNode('denodeify')
const nodeDir = requireNode('node-dir')
const fs = requireNode('fs')
const getfiles = denodeify(nodeDir.files)
const readdir = denodeify(fs.readdir)

const { Service } = Ember

export default Service.extend({
  readDir(dir) {
    return readdir(dir)
      .then(files =>
        files.map(file => `${dir}/${file}`)
      )
  },

  readDirR(dir) {
    return getfiles(dir)
  }
})
