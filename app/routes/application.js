import Ember from 'ember'

const { Route, inject } = Ember

export default Route.extend({
  sync: inject.service(),
  cordova: inject.service(),
  player: inject.service('celyn-player'),

  beforeModel() {
    return this.get('cordova').ready()
      .then(() => {
        if (typeof StatusBar !== 'undefined') {
          StatusBar.backgroundColorByHexString('#1c1c1c')
        }
      })
      .then(() => {
        this.get('sync').syncLocalFiles()
      })
  },

  actions: {
    play(track, playlist) {
      this.set('player.currentPlaylist', playlist)
      this.get('player').play(track)
    }
  }
})
