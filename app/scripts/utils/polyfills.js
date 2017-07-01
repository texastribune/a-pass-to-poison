// This is for importing our polyfills. This should already be pulled in via
// Webpack, so no additional importing of this file should be necessary.
import objectAssign from 'object-assign';
import Promise from 'promise-polyfill';

if (typeof Promise === 'undefined') {
  window.Promise = Promise;
}

Object.assign = objectAssign;
