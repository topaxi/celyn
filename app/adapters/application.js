import { Adapter } from 'ember-pouch'
import PouchDB from 'pouchdb'
import Ember from 'ember'
import config from 'celyn/config/environment'

const { assert, isEmpty, inject } = Ember

export default Adapter.extend({
  electron: inject.service(),

  init(...args) {
    this._super(...args)

    this.set('db', this.createDb())
  },

  createDb() {
    let localDb = config.emberPouch.localDb

    assert('emberPouch.localDb must be set', !isEmpty(localDb))

    let db

    if (this.get('electron.isElectron')) {
      let NodePouchDB = this.get('electron').require('pouchdb')

      NodePouchDB.plugin(this.get('electron').require('relational-pouch'))

      db = new NodePouchDB(localDb)
    }
    else {
      db = new PouchDB(localDb)
    }

    if (config.emberPouch.remoteDb) {
      let remoteDb = new PouchDB(config.emberPouch.remoteDb)

      db.sync(remoteDb, {
        live: true,
        retry: true
      })
    }

    return db
  }
})
