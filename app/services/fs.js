import Ember from 'ember'

const { Service, inject, computed } = Ember

export default Service.extend({
  electron: inject.service(),
  cordova: inject.service(),

  fsNode: inject.service('fs-node'),
  fsCordova: inject.service('fs-cordova'),

  fs: computed(function() {
    if (this.get('electron.isElectron')) {
      return this.get('fsNode')
    }

    if (this.get('cordova.isCordova')) {
      return this.get('fsCordova')
    }

    throw new Error('Unknown platform, no filesystem available')
  }),

  readDir(dir) {
    return this.get('fs').readDir(dir)
  },

  readDirR(dir) {
    return this.get('fs').readDirR(dir)
  }
})
