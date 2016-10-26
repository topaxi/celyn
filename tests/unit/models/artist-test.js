import { moduleForModel, test } from 'ember-qunit';

moduleForModel('artist', 'Unit | Model | artist', {
  // Specify the other units that are required for this test.
  needs: ['model:track', 'model:album']
});

test('it exists', function(assert) {
  let model = this.subject();
  // let store = this.store();
  assert.ok(!!model);
});
