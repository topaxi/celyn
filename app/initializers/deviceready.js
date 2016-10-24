// This is fine for now, once we use loading templates, we should
// handle this in our application route.
// http://hussfelt.net/2015/08/06/how-to-stop-using-deferreadiness-and-advancereadiness-in-ember/
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
