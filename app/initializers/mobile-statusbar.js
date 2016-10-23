export function initialize() {
  if (typeof StatusBar !== 'undefined') {
    StatusBar.backgroundColorByHexString('#1c1c1c')
  }
}

export default {
  name: 'mobile-statusbar',
  initialize
}
