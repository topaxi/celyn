import Ember from 'ember'
import RSVP from 'rsvp'

const { Route, inject } = Ember
const { Promise } = RSVP

export default Route.extend({
  sync: inject.service(),
  cordova: inject.service(),
  player: inject.service('celyn-player'),

  waitUntilReady() {
    return window.cordova ?
      this.get('cordova').ready() :
      Promise.resolve()
  },

  beforeModel() {
    return this.waitUntilReady()
      .then(() => {
        if (window.StatusBar) {
          StatusBar.backgroundColorByHexString('#1c1c1c')
        }
      })
  },

  afterModel() {
    this.get('sync').syncLocalFiles()
  },

  actions: {
    play(track, playlist) {
      this.set('player.currentPlaylist', playlist)
      this.get('player').play(track)
    }
  }
})
