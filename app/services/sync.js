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

    let syncState = Promise.all([
      this._getAllFiles()
        .then(files => this._filterAudioFiles(files)),
      this.get('store').findAll('track')
    ])

    return syncState
      .then(([ files ]) => files)
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

    let track = store.peekRecord('track', id)

    if (track && !force) {
      console.timeEnd(fileEntry.nativeURL)

      return track
    }

    return audioMeta.readMetaData(fileEntry)
      .then(meta => {
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
