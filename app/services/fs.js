/* globals cordova */
import Ember from 'ember'
import RSVP from 'rsvp'

const { Service } = Ember
const { Promise } = RSVP

const SD_CARD_TOPAXI_S6 = 'file:///storage/4E21-FF0C/'

export default Service.extend({
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
    return this.resolveLocalFileSystemURL(cordova.file.externalRootDirectory)
  },

  getSDCardDir() {
    return this.resolveLocalFileSystemURL(SD_CARD_TOPAXI_S6)
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
