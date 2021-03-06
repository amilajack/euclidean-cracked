import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | ui multislider', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    await render(hbs`{{ui-multislider}}`);

    assert.dom('*').hasText('');

    // Template block usage:
    await render(hbs`
      {{#ui-multislider}}
        template block text
      {{/ui-multislider}}
    `);

    assert.dom('*').hasText('template block text');
  });
});
