import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, find } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | add track', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    await render(hbs`{{add-track}}`);

    assert.dom('*').hasText('');

    // Template block usage:
    await render(hbs`
      {{#add-track}}
        template block text
      {{/add-track}}
    `);

    assert.dom('*').hasText('template block text');
  });
});