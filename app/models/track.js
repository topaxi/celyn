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

  pictures: attr('attachment', {
    defaultValue() {
      return []
    }
  })
})
