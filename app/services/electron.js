/* global requireNode */
import Ember from 'ember'
import isElectron from '../utils/is-electron'

const { Service } = Ember

export default Service.extend({
  isElectron: isElectron(),

  require(path) {
    return requireNode(path)
  }
})
