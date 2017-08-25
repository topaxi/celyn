import Ember from 'ember'

const { Route, inject } = Ember

export default Route.extend({
  sync: inject.service(),

  model() {
    return this.store.findAll('track')
      .then(tracks => tracks.toArray())
  },

  activate() {
    let saved = 0

    this.get('sync').on('end', () => this.refresh())
    this.get('sync').on('saved', () => !(++saved % 200) && this.refresh())
  },

  deactivate() {
    this.get('sync').off('end')
    this.get('sync').off('saved')
  }
})
