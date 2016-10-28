import Ember from 'ember'

const { Service, Evented, inject, computed } = Ember
const { min, max } = Math

export default Service.extend(Evented, {
  player: inject.service('media-player'),
  isPlaying: computed.oneWay('player.isPlaying'),

  currentPlaylist: computed(() => []),
  currentPlaylistIndex: -1,
  currentTrack: null,
  repeat: null,
  shuffle: null,

  init() {
    this.get('player').on('ended', () => this.next())
  },

  togglePause() {
    this.get('player').togglePause()
  },

  play(track) {
    this.set('currentTrack', track)
    this.set('currentPlaylistIndex',
      this.get('currentPlaylist').indexOf(track)
    )
    this.get('player').play(track.get('url'))
    this.get('player').one('load', () => this.trigger('load', track))
  },

  skipNext() {
    this.set('currentPlaylistIndex',
      min(
        this.get('currentPlaylist.length'),
        this.get('currentPlaylistIndex') + 1
      )
    )
  },

  skipPrevious() {
    this.set('currentPlaylistIndex',
      max(0, this.get('currentPlaylistIndex') - 1)
    )
  }
})
