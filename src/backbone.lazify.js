import _ from "underscore";
import Backbone from "backbone";

var DEFAULT_DEBOUNCE = 500;

const Lazify = Backbone.Lazify = {
  defaultDebounce: DEFAULT_DEBOUNCE,
  lazy: function() {
    this._lazified = this._lazified || {};
    const fnName = _.head(arguments),
      args = _.rest(arguments);

    if (fnName) {
      // invoke if already lazified
      if (this._lazified[fnName]) {
        this._lazified[fnName].apply(this, args);
      }
      // fn exists on model
      const original = this[fnName];
      if (original && _.isFunction(original)) {

        // create and store debounced version
        let debounce = DEFAULT_DEBOUNCE;
        if (this.lazify && this.lazify[fnName]) {
          debounce = this.lazify[fnName];
        }
        const lazified = _.debounce(original, debounce);
        this._lazified[fnName] = lazified;

        // invoke!
        this._lazified[fnName].apply(this, args);
      } else {
        throw new Error(`No method ${fnName} to lazify`);
      }
    } else {
      throw new Error('#lazy requires a function name to call');
    }
  }
};

export default Lazify;
