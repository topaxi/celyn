/* global Media */
import Ember from 'ember'

const { Service, Evented } = Ember

export default Service.extend(Evented, {
  media: null,
  currentMediaURL: null,
  currentMedia: null,
  isPlaying: false,

  play(url) {
    if (this.currentMedia) {
      this.currentMedia.stop()
      this.currentMedia.release()
    }

    this.set('isPlaying', false)
    this.currentMediaURL = url
    this.currentMedia = new Media(url,
      () => this.trigger('load', url),
      error => this.trigger('error', error),
      status => this._handleMediaStatus(status)
    )
    this.currentMedia.play()
  },

  togglePause() {
    if (this.get('isPlaying')) {
      this.currentMedia.pause()
    }
    else {
      this.currentMedia.play()
    }
  },

  seekTo(milliseconds) {
    this.currentMedia.seekTo(milliseconds)
  },

  _handleMediaStatus(status) {
    console.log({ status })
    switch (status) {
      case Media.MEDIA_NONE:
        break
      case Media.MEDIA_STARTING:
        break
      case Media.MEDIA_RUNNING:
        console.log('media is running, setting isPlaying to true')
        this.set('isPlaying', true)
        break
      case Media.MEDIA_PAUSED:
        this.set('isPlaying', false)
        break
      case Media.MEDIA_STOPPED:
        this.set('isPlaying', false)
        this.trigger('ended', this.currentMediaURL)
        break
      default:
        this.trigger('error', new Error('Unknown Media Status'))
    }
  }
})
