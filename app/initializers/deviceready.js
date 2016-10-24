export function initialize(application) {
  if (window.cordova) {
    application.deferReadiness()

    document.addEventListener('deviceready', () =>
      application.advanceReadiness()
    )
  }
}

export default {
  name: 'deviceready',
  initialize
}
