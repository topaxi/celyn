import Ember from 'ember';
import FilesystemInitializer from 'celyn/initializers/filesystem';
import { module, test } from 'qunit';

let application;

module('Unit | Initializer | filesystem', {
  beforeEach() {
    Ember.run(function() {
      application = Ember.Application.create();
      application.deferReadiness();
    });
  }
});

// Replace this with your real tests.
test('it works', function(assert) {
  FilesystemInitializer.initialize(application);

  // you would normally confirm the results of the initializer here
  assert.ok(true);
});
