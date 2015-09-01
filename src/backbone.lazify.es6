import _ from "underscore";
import Backbone from "backbone";

var DEFAULT_DEBOUNCE = 500;

const createLazifiedHash = function(ctx) {
  ctx._lazified = ctx._lazified || {};
};

const createLazifiedFunction = function(ctx, fnName) {
    // fn exists on model
    const original = ctx[fnName];
    if (original && _.isFunction(original)) {

      // create and store debounced version
      let debounce = DEFAULT_DEBOUNCE;
      if (ctx.lazify && ctx.lazify[fnName]) {
        debounce = ctx.lazify[fnName];
      }
      const lazified = _.debounce(original, debounce);
      ctx._lazified[fnName] = lazified;
    } else {
      throw new Error(`No method ${fnName} to lazify`);
    }
};


const Lazify = Backbone.Lazify = {
  DEFAULT_DEBOUNCE,

  lazy(fnName, ...args) {
    createLazifiedHash(this);

    if (fnName) {
      // invoke if already lazified
      if (this.lazified(fnName)) {
        return this._lazified[fnName].apply(this, args);
      }

      createLazifiedFunction(this, fnName);

      // invoke!
      return this._lazified[fnName].apply(this, args);

    } else {
      throw new Error('#lazy requires a function name to call');
    }
  },

  lazified(fnName) {
    createLazifiedHash(this);
    createLazifiedFunction(this, fnName);
    return this._lazified[fnName];
  }
};

export default Lazify;
