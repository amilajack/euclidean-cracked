import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { set, get } from "@ember/object";
import { equal } from "@ember/object/computed";

export default Component.extend({
  classNames: 'new-post',
  session: service(),
  
  init() {
    this._super(...arguments);
    set(this, 'publicVisible', true);
    set(this, 'publicEditable', true);
  },

  anonymous: equal('session.provider', 'anonymous'),

  actions: {
    save() {
      let {
        title,
        publicEditable,
        publicVisible
      } = this.getProperties('title', 'publicEditable', 'publicVisible');

      get(this, 'onSave')(title, publicEditable, publicVisible)
      set(this, 'interval', 200);
    }
  }
});
