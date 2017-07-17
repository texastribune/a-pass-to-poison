import getMatchingAttributes from './get-matching-attributes';
import loadScript from './load-script';
import selectAll from './select-all';
import uniqueId from './unique-id';

/**
 * AdLoader
 *
 * @param  {Object} opts
 * @return {Object}
 */
function AdLoader(opts) {
  var w = window;
  var hasBeenInit = false;
  var adSlots;

  var defaultOpts = {
    attributePrefix: 'dv-gpt-',
    defaultAdFields: {
      adUnit: '/5805113/basic',
      dimensions: [300, 250],
    },
    globalMappings: {
      banner: [[[768, 130], [[728, 90]]]],
      smallBanner: [[[508, 100], [[468, 60]]]],
    },
    gptSrc: 'https://www.googletagservices.com/tag/js/gpt.js',
    idPrefix: 'dv-gpt-',
    selector: '.dv-gpt-ad',
    targetingKey: 'tribpedia',
    targetingValue: null,
  };

  opts = Object.assign({}, defaultOpts, opts);

  var adElements = selectAll(opts.selector);

  function setupService() {
    w.googletag.cmd.push(function() {
      var pubads = w.googletag.pubads();

      if (opts.targetingKey && opts.targetingValue) {
        pubads.setTargeting(opts.targetingKey, opts.targetingValue);
      }

      pubads.enableSingleRequest();
      w.googletag.enableServices();
    });
  }

  function createAds() {
    adSlots = adElements.map(function(element) {
      var matchingAttributes = getMatchingAttributes(
        element,
        opts.attributePrefix
      );
      var localOpts = Object.assign(
        {},
        opts.defaultAdFields,
        matchingAttributes
      );

      var adElementId = uniqueId(opts.idPrefix);
      element.setAttribute('id', adElementId);

      var adUnit = w.googletag.defineSlot(
        localOpts.adUnit,
        localOpts.dimensions,
        adElementId
      );

      if (
        localOpts.mapping &&
        opts.globalMappings.hasOwnProperty(localOpts.mapping)
      ) {
        adUnit.defineSizeMapping(opts.globalMappings[localOpts.mapping]);
      }

      if (localOpts.targetingKey && localOpts.targetingValue) {
        adUnit.setTargeting(localOpts.targetingKey, localOpts.targetingValue);
      }

      adUnit.setCollapseEmptyDiv(true);
      adUnit.addService(w.googletag.pubads());

      w.googletag.display(adElementId);

      return adUnit;
    });
  }

  function init() {
    if (hasBeenInit) return;

    loadScript(opts.gptSrc, function() {
      w.googletag.cmd.push(setupService, createAds);

      hasBeenInit = true;
    });
  }

  return {
    adSlots: adSlots,
    init: init,
  };
}

export default AdLoader;
