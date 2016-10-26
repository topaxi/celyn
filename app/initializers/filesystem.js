export function initialize(application) {
  application.inject('route', 'fs', 'service:fs')
}

export default {
  name: 'filesystem',
  initialize
}
