import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | nav bar', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    await render(hbs`{{nav-bar}}`);

    assert.dom('*').hasText('');

    // Template block usage:
    await render(hbs`
      {{#nav-bar}}
        template block text
      {{/nav-bar}}
    `);

    assert.dom('*').hasText('template block text');
  });
});
