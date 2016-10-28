import Ember from 'ember'

const { Service, Evented } = Ember
const MS_ONE_SECOND = 1000

export default Service.extend(Evented, {
  audio: null,
  isPlaying: false,

  init() {
    this.audio = new Audio
    this.audio.autobuffer = true
    this.audio.controls = false
    this.audio.preload = 'auto'

    ;[ 'play', 'pause', 'volumechange', 'ended' ]
      .forEach(event =>
        this.audio.addEventListener(event, e => this.trigger(event, e), false)
      )

    this.on('play', () => this.set('isPlaying', true))
    this.on('pause', () => this.set('isPlaying', false))
  },

  play(url) {
    this.audio.src = url
    this.audio.play()
    this.set('isPlaying', true)
  },

  togglePause() {
    if (this.get('isPlaying')) {
      this.audio.pause()
    }
    else {
      this.audio.play()
    }
  },

  seekTo(milliseconds) {
    this.audio.currentTime = milliseconds / MS_ONE_SECOND
  }
})
