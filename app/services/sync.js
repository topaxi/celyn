import Ember from 'ember'

const { Service, inject } = Ember

function forEachPromise(array, callback) {
  return array.reduce(
    (p, value, i, self) =>
      p.then(() => callback(value, i, self)),
    Promise.resolve()
  )
}

// function arrayMapPromise(array, callback) {
//   let a = []
//
//   return array.reduce(
//     (p, value, i, self) =>
//       p
//         .then(() => callback(value, i, self))
//         .then(v => a.push(v)),
//     Promise.resolve()
//   )
//   .then(() => a)
// }

export default Service.extend({
  fs: inject.service(),
  audioMeta: inject.service(),
  store: inject.service(),

  _artists: new Map,
  _albums: new Map,
  _genres: new Map,

  _isAudioFile(fileName) {
    return fileName.endsWith('.mp3') ||
           fileName.endsWith('.m4a') ||
           fileName.endsWith('.ogg') ||
           fileName.endsWith('.flac') ||
           fileName.endsWith('.wma')
  },

  syncLocalFiles() {
    let audioMeta = this.get('audioMeta')
    let t = performance.now()

    return this._getAllFiles()
      .then(files => this._filterAudioFiles(files))
      .then(files =>
        this._eachAudioMetaData(files, (f, meta) => this._syncTrack(f, meta))
      )
      .then(files => console.log((performance.now() - t) / 1000, files))
  },

  _formatToMime(f) {
    switch (f) {
      case 'jpg':
        return 'image/jpeg'
      case 'png':
        return 'image/png'
      default:
        return ''
    }
  },

  _syncTrack(f, meta) {
    let store = this.get('store')

    return store.queryRecord('track', { filter: { url: f.nativeURL } })
      .then(track => {
        if (track) {
          return track
        }

        return store.createRecord('track', {
          url: f.nativeURL,
          duration: meta.duration,
          title: meta.title,
          artist: meta.artist.join(', '),
          album: meta.album,
          albumArtist: meta.albumartist.join(', '),
          genre: meta.genre.join(', '),
          disk: meta.disk,
          track: meta.track,
          year: meta.year,
          pictures: meta.picture.map(p => {
            let type = this._formatToMime(p.format)

            return {
              name: `${meta.album}.${p.format}`,
              content_type: type,
              data: new Blob([ p.data ], { type })
            }
          })
        })
          .save()
      })
  },

  _eachAudioMetaData(files, callback) {
    return forEachPromise(files, f =>
      this.get('audioMeta')
          .readMetaData(f)
          .then(meta => callback(f, meta))
    )
  },

  _filterAudioFiles(files) {
    return files.filter(f => this._isAudioFile(f.name))
  },

  _getAllFiles() {
    let fs = this.get('fs')

    return fs.getExternalRootDir()
      .then(dir => fs.readDirR(dir))
  }
})
