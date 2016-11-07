import EmberCordovaService from 'ember-cordova/services/cordova'

export default EmberCordovaService.extend({
  isCordova: typeof cordova !== 'undefined'
})
