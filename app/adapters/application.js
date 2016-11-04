import { Adapter } from 'ember-pouch';
import PouchDB from 'pouchdb';
import config from 'celyn/config/environment';
import Ember from 'ember';

const { assert, isEmpty } = Ember;
const isNode = typeof requireNode !== 'undefined'

function createDb() {
  let localDb = config.emberPouch.localDb;

  assert('emberPouch.localDb must be set', !isEmpty(localDb));

  let db

  if (isNode) {
    let Pouch = requireNode('pouchdb')

    Pouch.plugin(requireNode('relational-pouch'))
    db = new Pouch(localDb)
  }
  else {
    db = new PouchDB(localDb)
  }

  db.info().then(info => console.log(info))

  if (config.emberPouch.remoteDb) {
    let remoteDb = new PouchDB(config.emberPouch.remoteDb);

    db.sync(remoteDb, {
      live: true,
      retry: true
    });
  }

  return db;
}

export default Adapter.extend({
  init() {
    this._super(...arguments);
    this.set('db', createDb());
  },

  createRecord(...args) {
    console.log(args)
    return this._super(...args)
  }
});
