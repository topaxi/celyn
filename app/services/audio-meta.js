/* eslint-disable no-undef */
import Ember from 'ember'
import RSVP from 'rsvp'
import musicmetadata from 'npm:musicmetadata'
import blobToArrayBuffer from 'celyn/utils/blob-to-array-buffer'

const { Service, inject } = Ember
const { Promise } = RSVP

export default Service.extend({
  fs: inject.service('fs-cordova'),

  // npm:musicmetadata resolves to the browser version,
  // if we are running in electron, we have to require the node version
  mm: typeof requireNode === 'undefined' ?
    musicmetadata :
    requireNode('musicmetadata'),

  _readMetaData(buffer) {
    return new Promise((resolve, reject) => this.mm(buffer, (err, meta) =>
      err ? reject(err) : resolve(meta)
    ))
  },

  readMetaData(path) {
    if (typeof requireNode !== 'undefined') {
      let fs = requireNode('fs')

      return this._readMetaData(fs.createReadStream(path))
    }


    return this.get('fs')._resolveLocalFileSystemURL(path)
      .then(fileEntry =>
        new Promise((resolve, reject) =>
          fileEntry.file(resolve, reject)
        )
      )
      .then(f => blobToArrayBuffer(f))
      .then(arrayBuffer => this._readMetaData(arrayBuffer))
  }
})
