/* globals cordova */
import Ember from 'ember'
import RSVP from 'rsvp'

const { Service } = Ember
const { Promise } = RSVP

export default Service.extend({
  init() {
    this.externalRootDirectory = cordova.file.externalRootDirectory
  },

  blobToArrayBuffer(blob) {
    return new Promise(resolve => {
      let fr = new FileReader

      fr.onload = () => resolve(fr.result)
      fr.readAsArrayBuffer(blob)
    })
  },

  resolveLocalFileSystemURL(url) {
    return new Promise((resolve, reject) =>
      window.resolveLocalFileSystemURL(url, resolve, reject)
    )
  },

  getExternalRootDir() {
    return this.resolveLocalFileSystemURL(this.externalRootDirectory)
  },

  readDir(entry) {
    return new Promise((resolve, reject) =>
      entry
        .createReader()
        .readEntries(resolve, reject)
    )
  },

  readDirR(entry, _files = []) {
    return this.readDir(entry)
      .then(files => {
        _files.push(...files.filter(f => f.isFile))

        return Promise.all(
          files
            .filter(f => f.isDirectory)
            .map(dir => this.readDirR(dir, _files))
        )
      })
      .then(() => _files)
  }
})
