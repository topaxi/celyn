/* eslint-disable no-console */
import Ember from 'ember'
import RSVP from 'rsvp'

const { Service, inject } = Ember
const { Promise } = RSVP

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

  isSyncing: false,
  syncTotal: 0,
  syncProcessed: 0,
  syncCurrentFile: '',

  _isAudioFile(fileName) {
    return fileName.endsWith('.mp3') ||
           fileName.endsWith('.m4a') ||
           fileName.endsWith('.ogg') ||
           fileName.endsWith('.flac') ||
           fileName.endsWith('.wma')
  },

  syncLocalFiles(reindex) {
    this.set('isSyncing', true)
    console.groupCollapsed('file sync')
    console.time('file sync')

    console.groupCollapsed('get current state')
    console.time('get current state')
    console.time('search audio files')
    console.time('fetch synced tracks')
    let syncState = Promise.all([
      this._getAllFiles()
        .then(files => {
          console.timeEnd('search audio files')

          return files
        })
        .then(files => this._filterAudioFiles(files))
        .then(files => {
          this.setProperties({
            syncTotal: files.length,
            syncProcessed: 0
          })

          return files
        }),
      this.get('store').findAll('track')
        .then(tracks => {
          console.timeEnd('fetch synced tracks')

          return tracks
        })
    ])

    return syncState
      .then(state => {
        console.groupEnd('get current state')
        console.timeEnd('get current state')

        return state
      })
      .then(([ files ]) => files)
      .then(files => {
        console.groupCollapsed(`sync ${files.length} tracks`)
        console.time(`sync ${files.length} tracks`)

        return forEachPromise(files, f => this._syncTrack(f, reindex))
          .then(() => {
            console.groupEnd(`sync ${files.length} tracks`)
            console.timeEnd(`sync ${files.length} tracks`)
          })
      })
      .then(() => {
        console.groupEnd('file sync')
        console.timeEnd('file sync')
      })
      .finally(() => this.set('isSyncing', false))
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
    console.groupCollapsed(fileEntry.name)
    console.time('total')

    this.set('syncCurrentFile', fileEntry.name)

    let id = fileEntry.nativeURL
    let store = this.get('store')
    let audioMeta = this.get('audioMeta')

    console.time('peek record')
    let track = store.peekRecord('track', id)
    console.timeEnd('peek record')

    let done = () => {
      this.set('syncProcessed', this.get('syncProcessed') + 1)
      console.groupEnd(fileEntry.name)
      console.timeEnd('total')
    }

    if (track && !force) {
      done()

      return track
    }

    console.time('read metadata')

    return audioMeta.readMetaData(fileEntry)
      .then(meta => {
        console.timeEnd('read metadata')
        if (!track) {
          track = store.createRecord('track', { id })
        }

        console.time('update properties')
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

        console.timeEnd('update properties')
        console.time('save')

        return track.save()
          .then(t => {
            console.timeEnd('save')

            return t
          })
      })
      .then(() => done())
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

    let rootDirs = [
      fs.getExternalRootDir(),
      fs.getSDCardDir()
        .catch(() => null)
    ]

    let themFiles = []

    return Promise.all(rootDirs)
      .then(dirs =>
        Promise.all(
          dirs.filter(i => i)
              .map(dir => fs.readDirR(dir, themFiles))
        )
      )
      .then(() => themFiles)
  }
})
