import Ember from 'ember'

const { Route, inject } = Ember

export default Route.extend({
  sync: inject.service(),
  cordova: inject.service(),

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

  model() {
    return this.store.findAll('track')
  }
})
