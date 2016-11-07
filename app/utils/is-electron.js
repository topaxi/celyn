/* global requireNode */
export default function isElectron() {
  return typeof requireNode !== 'undefined'
}
