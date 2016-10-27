/* eslint-disable no-magic-numbers */
import Ember from 'ember'

const {
  Component,
  inject,
  computed,
  String: { htmlSafe }
} = Ember

export default Component.extend({
  tagName: '',

  sync: inject.service(),

  isSyncing: computed(
    'sync.isSyncing',
    'sync.syncProcessed',
    'sync.syncTotal',
    function() {
      return this.get('sync.isSyncing') &&
        this.get('sync.syncProcessed') &&
        this.get('sync.syncTotal')
    }
  ),

  progressStyle: computed('sync.syncProcessed', 'sync.syncTotal', function() {
    let total = this.get('sync.syncTotal')
    let processed = this.get('sync.syncProcessed')
    let percent = 100 / total * processed

    return htmlSafe(`--progress:${(percent || 0).toFixed(2)}%`)
  })
})
