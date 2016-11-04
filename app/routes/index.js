import Ember from 'ember'

const { Route, inject } = Ember

export default Route.extend({
  sync: inject.service(),

  model() {
    return this.store.findAll('track')
      .then(tracks => tracks.toArray())
  },

  activate() {
    this.get('sync').on('end', () => {
      this.store.findAll('track')
      this.refresh()
    })
  },

  deactivate() {
    this.get('sync').off('end')
  }
})
