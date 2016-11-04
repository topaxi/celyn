import RSVP from 'rsvp'

const { Promise } = RSVP

export default function blobToArrayBuffer(blob) {
  return new Promise(resolve => {
    let fr = new FileReader

    fr.onload = () => resolve(fr.result)
    fr.readAsArrayBuffer(blob)
  })
}
