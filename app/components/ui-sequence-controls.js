import Component from '@ember/component';

export default Component.extend({
  tagName: '',
  actions: {
    updateSequenceParam(param, value) {
      if (this.hits > this.steps) {
        this.onUpdateSequenceParam('steps', value);
      }
      this.onUpdateSequenceParam(param, value);
    }
  }
});