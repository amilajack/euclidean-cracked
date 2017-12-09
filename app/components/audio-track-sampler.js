import Ember from 'ember';
import { get, set, computed } from "@ember/object";
import { debug } from "@ember/debug";

const { service } = Ember.inject;

export default Ember.Component.extend({
  audioService: service(),
  classNames: ['audio-track-sampler'],
  classNameBindings: [
    'trackReady' // only used to force computed get() to run
  ],

  samplerId: computed('trackId', {
    get() {
      return `sampler-${get(this, 'trackId')}`;
    },
  }),

  gainId: computed('samplerId', {
    get() {
      return `${get(this, 'samplerId')}-gain`;
    },
  }),

  path: computed('directory', 'filename', {
    get() {
      // TODO: how to set new filename without rebuilding node?
      return `${get(this, 'directory')}${get(this, 'filename')}`;
    },
    set(key, val) {
      return val;
    },
  }),

  gain: computed({
    set(key, val) {
      __(`#${get(this, 'gainId')}`).attr({gain: val});
      return val;
    }
  }),

  trackReady: computed('sequence', 'filename',{
    get() {

      let requirements = [
        get(this, 'sequence'),
        get(this, 'filename'),
      ];

      let isReady = requirements.every((property)=>{
        return typeof property != 'undefined';
      });

      if (isReady && !get(this, 'hasBuiltNode')){
        this.initializeSampler();
      }

    },

  }),

  init() {
    this._super(...arguments);

    // TODO: move all properties into track model
    set(this, 'isLooping', false);
    set(this, 'loopEnd', 1);
    set(this, 'speed', 1);

    // dict of parameter values for each step
    // in current sequence
    let samplerStepParams = {
      speed: new Array(16).fill(1),
      loopEnd: new Array(16).fill(1),
    };

    set(this, 'samplerStepParams', samplerStepParams);
  },

  didReceiveAttrs() {
    this._super(...arguments);
    // cache and compare properties that require
    // a refresh of sampler nodes on update
    // ie [sequence, filename, ...
    let refreshOnUpdate =
      get(this, 'sequence') !== get(this, '_sequence')
      || get(this, 'filename') !== get(this, '_filename')

    if (refreshOnUpdate) {
      this.initializeSampler();
    }
    set(this, '_sequence', get(this, 'sequence'));
    set(this, '_filename', get(this, 'filename'));
  },


  willDestroy() {
    this.removeAllNodes();
  },

  removeAllNodes() {
    __(`#${get(this, 'samplerId')}`).unbind("step");

    let selectors = [
      `#${get(this, 'samplerId')}`,
      `#${get(this, 'gainId')}`,
    ];

    selectors.forEach((selector)=>{
      __(selector).remove();
    });

    set(this, 'hasBuiltNode', false);

    //remove reference from service
    let serviceTracks = get(this, 'audioService.tracks');
    let ref = serviceTracks.findBy('trackId', get(this, 'trackId'));
    serviceTracks.removeObject(ref);

  },

  buildNode() {
    set(this, 'hasBuiltNode', true);
    __()
    .sampler({
      id: get(this, 'samplerId'),
      path: get(this, 'path'),
    })
    .gain({
      id: get(this, 'gainId'),
    })
    .connect(get(this, 'outputNodeSelector'));
  },

  bindStep() {
    this.initializeTrackData();

    let trackId = get(this, 'trackId');

    let trackData = get(this, 'audioService.tracks').findBy('trackId', trackId);

    let selector  =`#${get(this,'samplerId')}`;
    let callback = get(this, 'onStepCallback').bind(this);
    let sequence = get(this,'sequence');

    set(trackData, 'selector', selector);
    set(trackData, 'callback', callback);
    set(trackData, 'sequence', sequence);

    get(this, 'audioService').bindTrackSamplers();

  },

  // callback functions to be called on each step of sequencer
  onStepCallback(index, data){
    set(this, 'stepIndex', index);

    if (data) {
      __(this).stop();
      __(this).start();

      let speed = get(this, 'samplerStepParams')['speed'][index];
      __(this).attr({speed: speed});

    if(get(this, 'isLooping')){
        let loopEnd = get(this, 'samplerStepParams')['loopEnd'][index];
        __(this).attr({loop:true, start: 0, end: loopEnd});
      }
    } else {
      if (!get(this, 'isLegato')) {
        __(this).attr({loop:false});
      }
    }

  },

  initializeTrackData() {
    let trackId = get(this, 'trackId');
    debug('initialize track data', trackId);

    let trackData = get(this, 'audioService.tracks').findBy('trackId', trackId);
    if (!trackData) {
      get(this, 'audioService.tracks').push({trackId: trackId});
    }
  },


  initializeSampler() {
    if (get(this, 'sequence')) {
      this.removeAllNodes();
      this.buildNode();
      this.bindStep();
    }
  },

});