/* eslint-disable no-undef */
import Ember from 'ember'
import RSVP from 'rsvp'
import musicmetadata from 'npm:musicmetadata'
import blobToArrayBuffer from 'celyn/utils/blob-to-array-buffer'

const { Service, inject, computed } = Ember
const { Promise } = RSVP

export default Service.extend({
  electron: inject.service('electron'),
  fs: inject.service('fs-cordova'),

  // npm:musicmetadata resolves to the browser version,
  // if we are running in electron, we have to require the node version
  mm: computed(function() {
    if (this.get('electron.isElectron')) {
      return this.get('electron').require('musicmetadata')
    }

    return musicmetadata
  }),

  _readMetaData(buffer) {
    return new Promise((resolve, reject) =>
      this.get('mm')(buffer, (err, meta) =>
        err ? reject(err) : resolve(meta)
      )
    )
  },

  readMetaData(path) {
    if (this.get('electron.isElectron')) {
      let fs = this.get('electron').require('fs')

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
