import Ember from 'ember'
import mm from 'npm:musicmetadata'

const { Service, inject } = Ember

export default Service.extend({
  fs: inject.service(),

  readMetaData(fileEntry) {
    let file = new Promise((resolve, reject) =>
      fileEntry.file(resolve, reject)
    )

    return file
      .then(f => this.get('fs').blobToArrayBuffer(f))
      .then(ab => new Promise((resolve, reject) => mm(ab, (err, meta) =>
        err ? reject(err) : resolve(meta)
      )))
  }
})
