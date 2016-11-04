/* globals cordova */
import Ember from 'ember'
import RSVP from 'rsvp'

const { Service } = Ember
const { Promise } = RSVP

export default Service.extend({
  _resolveLocalFileSystemURL(url) {
    return new Promise((resolve, reject) =>
      window.resolveLocalFileSystemURL(url, resolve, reject)
    )
  },

  getExternalRootDir() {
    return this._resolveLocalFileSystemURL(cordova.file.externalRootDirectory)
  },

  readDir(dir) {
    return this._readDir(dir)
      .then(files => files.map(f => f.nativeURL))
  },

  readDirR(dir) {
    return this._resolveLocalFileSystemURL(dir)
      .then(entry => this._readDirR(entry))
      .then(files => files.map(f => f.nativeURL))
  },

  _readDir(dir) {
    return this._resolveLocalFileSystemURL(dir)
      .then(entry => new Promise((resolve, reject) =>
        entry
          .createReader()
          .readEntries(resolve, reject)
      ))
  },

  _readDirR(entry, _files = []) {
    return this._readDir(entry)
      .then(files => {
        _files.push(...files.filter(f => f.isFile))

        return Promise.all(
          files
            .filter(f => f.isDirectory)
            .map(dir => this._readDirR(dir, _files))
        )
      })
      .then(() => _files)
  }
})
