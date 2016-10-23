import Ember from 'ember'

const {
  Component,
  computed,
  String: { underscore }
} = Ember

const MdIcon = Component.extend({
  tagName: 'md-icon',
  classNames: [ 'material-icons' ],
  attributeBindings: [ 'dark', 'light', 'size' ],
  positionalIcon: '',

  icon: computed({
    get() {
      return underscore(this.get('positionalIcon'))
    }
  })
})

MdIcon.reopenClass({
  positionalParams: [ 'positionalIcon' ]
})

export default MdIcon
