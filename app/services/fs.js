import Ember from 'ember'

const { Service, inject } = Ember

export default Service.extend({
  fs: inject.service('fs-node'),

  readDir(dir) {
    return this.get('fs').readDir(dir)
  },

  readDirR(dir) {
    return this.get('fs').readDirR(dir)
  }
})
