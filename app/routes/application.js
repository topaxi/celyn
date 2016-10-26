import Ember from 'ember'

const { Route, inject } = Ember

export default Route.extend({
  sync: inject.service(),

  beforeModel() {
    this.get('sync').syncLocalFiles()
  },

  model() {
    return this.store.findAll('track')
  }
})
