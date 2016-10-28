import Ember from 'ember'

const { Service, Evented, inject, computed } = Ember

const playerService = typeof cordova === 'object' ?
  'cordova-player' : 'html5-player'

export default Service.extend(Evented, {
  player: inject.service(playerService),

  isPlaying: computed.oneWay('player.isPlaying'),

  init(...args) {
    this._super(...args)

    ;[ 'playing', 'ended' ]
      .forEach(event =>
        this.get('player').on(event, e => this.trigger(event, e))
      )
  },

  play(url) {
    return this.get('player').play(url)
  },

  togglePause() {
    return this.get('player').togglePause()
  },

  seekTo(milliseconds) {
    return this.get('player').seekTo(milliseconds)
  }
})
