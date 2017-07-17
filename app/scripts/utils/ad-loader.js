import elementIsVisible from './element-is-visible';
import getMatchingAttributes from './get-matching-attributes';
import loadScript from './load-script';
import ScrollObserver from './scroll-observer';
import selectAll from './select-all';
import uniqueId from './unique-id';

export default class AdLoader {
  constructor(
    {
      adFields = { adUnit: '/5805113/basic', dimensions: [300, 250] },
      attributePrefix = 'dv-gpt-',
      gptSrc = 'https://www.googletagservices.com/tag/js/gpt.js',
      idPrefix = 'dv-gpt-',
      scrollObserver = new ScrollObserver(),
      selector = '.dv-gpt-ad',
      targetingKey = 'tribpedia',
      targetingValue,
    } = {}
  ) {
    this.adFields = adFields;
    this.attributePrefix = attributePrefix;
    this.gptSrc = gptSrc;
    this.idPrefix = idPrefix;
    this.scrollObserver = scrollObserver;
    this.targetingKey = targetingKey;
    this.targetingValue = targetingValue;

    this.initialized = false;
    this.adElements = selectAll(selector);
    this.adSlots = null;

    this.checkSlots = this.checkSlots.bind(this);
    this.createAds = this.createAds.bind(this);
    this.setupService = this.setupService.bind(this);
  }

  setupService() {
    window.googletag.cmd.push(() => {
      const pubads = window.googletag.pubads();

      if (this.targetingKey && this.targetingValue) {
        pubads.setTargeting(this.targetingKey, this.targetingValue);
      }

      pubads.disableInitialLoad();
      window.googletag.enableServices();
    });
  }

  createAds() {
    const { adUnit, dimensions } = this.adFields;

    this.adSlots = this.adElements.map(element => {
      const matchingAttributes = getMatchingAttributes(
        element,
        this.attributePrefix
      );

      const options = Object.assign(
        {},
        { adUnit, dimensions },
        matchingAttributes
      );

      const adElementId = uniqueId(this.idPrefix);
      element.setAttribute('id', adElementId);

      const gptAdUnit = window.googletag.defineSlot(
        options.adUnit,
        options.dimensions,
        adElementId
      );

      if (options.targetingKey && options.targetingValue) {
        gptAdUnit.setTargeting(options.targetingKey, options.targetingValue);
      }

      gptAdUnit.setCollapseEmptyDiv(true);
      gptAdUnit.addService(window.googletag.pubads());

      window.googletag.display(adElementId);

      return { slot: gptAdUnit, el: element, loaded: false };
    });

    this.checkSlots();
    this.scrollObserver.add(this.checkSlots);
  }

  checkSlots() {
    const adSlots = this.adSlots;
    const threshold = 500;
    const clientHeight = document.documentElement.clientHeight;

    adSlots.forEach((ad, idx) => {
      const slot = ad.slot;
      const element = ad.el;

      // the element is not visible at all, no need
      if (!elementIsVisible(element) || ad.loaded) return;

      const rect = element.getBoundingClientRect();

      const visible =
        rect.top <= clientHeight + threshold && rect.bottom >= -threshold;

      if (visible) {
        window.googletag.pubads().refresh([slot]);
        ad.loaded = true;
      }
    });
  }

  init() {
    if (this.initialized) return;

    window.googletag = window.googletag || {};
    window.googletag.cmd = window.googletag.cmd || [];

    loadScript(this.gptSrc, () => {
      window.googletag.cmd.push(this.setupService, this.createAds);

      this.initialized = true;
    });
  }
}
