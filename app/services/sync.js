/* eslint-disable no-console */
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

  syncLocalFiles(reindex) {
    console.time('file sync')

    return this._getAllFiles()
      .then(files => this._filterAudioFiles(files))
      .then(files => forEachPromise(files, f => this._syncTrack(f, reindex)))
      .then(() => console.timeEnd('file sync'))
  },

  _formatToMime(f) {
    switch (f) {
      case 'jpg':
        return 'image/jpeg'
      case 'png':
        return 'image/png'
      case 'gif':
        return 'image/gif'
      default:
        return ''
    }
  },

  _syncTrack(fileEntry, force) {
    console.time(fileEntry.nativeURL)

    let id = fileEntry.nativeURL
    let store = this.get('store')
    let audioMeta = this.get('audioMeta')

    return store.findRecord('track', id)
      .catch(err => {
        if (!err) {
          // PouchDB probably found an empty record
          console.warn('Something bad has happened. Got empty error, ' +
                       'assuming record was not found')

          // By returning an empty object, we ignore this record for now...
          return {}

          // TODO: Remove object from store and return null
          // db.get(id).then(doc => db.remove(doc))

          // By returning null, we will recreate this record
          // return null
        }

        if (/Not found:/.test(err.toString())) {
          return null
        }

        throw err
      })
      .then(_track => {
        if (_track && !force) {
          return _track
        }

        return audioMeta.readMetaData(fileEntry)
          .then(meta => {
            let track = _track

            if (!track) {
              track = store.createRecord('track', { id })
            }

            track.setProperties({
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
                  content_type: type, // eslint-disable-line camelcase
                  data: new Blob([ p.data ], { type })
                }
              })
            })

            return track.save()
          })
      })
      .then(() => console.timeEnd(fileEntry.nativeURL))
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
