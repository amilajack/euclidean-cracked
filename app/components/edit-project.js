import Component from '@ember/component';
import { computed, set, get } from '@ember/object';
import DS from 'ember-data';

export default Component.extend({
  isEditing: false,
  classNames: 'edit-project',

  isAllowed: computed('project.creator.uid', 'session.currentUser.uid',{
    get() {
      const currentUser = get(this, 'session.currentUser.uid');
      const creatorPromise = get(this, 'project.creator').then((creator)=>{
        if (creator) {
          return get(creator, 'uid') === currentUser;
        } else {
          return false;
        }
      });

      return DS.PromiseObject.create({promise: creatorPromise});
    }
  }),

  actions: {
    save() {
      let sessionName = get(this, 'session.currentUser.uid');

      if (sessionName === this.project.get('creator.uid')) {
        set(this, 'isEditing', false);
        get(this, 'onSaveProject')(this.project);
      } else {
        alert('Sorry not authorized');
      }
    },

    edit() {
      set(this, 'isEditing', true);
    },

    deleteProject() {
      this.onDelete(this.project);
      set(this, 'isEditing', false);
    },
  }
});
