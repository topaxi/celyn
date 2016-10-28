import Ember from 'ember'

const { Component, inject, computed } = Ember

export default Component.extend({
  tagName: 'celyn-player',

  player: inject.service('celyn-player'),

  isPlaying: computed.oneWay('player.isPlaying'),
  currentTrack: computed.oneWay('player.currentTrack'),

  actions: {
    previous() {
      this.get('player').skipPrevious()
    },

    togglePause() {
      this.get('player').togglePause()
    },

    next() {
      this.get('player').skipNext()
    }
  }
})
