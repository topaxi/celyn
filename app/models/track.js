import Ember from 'ember'
import DS from 'ember-data'
import { Model } from 'ember-pouch'

const { attr/* , belongsTo, hasMany */ } = DS
const { computed } = Ember

export default Model.extend({
  url: computed.oneWay('id'),
  duration: attr('number'),

  title: attr('string'),
  artist: attr('string'),
  // artist: hasMany('artist'),
  albumArtist: attr('string'),
  // albumArtist: hasMany('artist'),
  album: attr('string'),
  // album: belongsTo('album'),
  genre: attr('string'),
  // genre: hasMany('genre'),
  disk: attr('object'),
  track: attr('object'),
  year: attr('string'),

  pictures: attr('attachments', {
    defaultValue() {
      return []
    }
  }),

  picture: computed('pictures.[]', function() {
    return this.get('pictures')[0]
  }),

  pictureURL: computed('picture', function() {
    let picture = this.get('picture')

    if (!picture) {
      return null
    }

    return URL.createObjectURL(picture.data)
  })
})
