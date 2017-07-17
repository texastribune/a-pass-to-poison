import elementIsVisible from './element-is-visible';
import ScrollObserver from './scroll-observer';
import selectAll from './select-all';

const supportsSrcset = 'srcset' in document.createElement('img');

export default class LazyLoad {
  constructor(
    {
      scrollObserver = new ScrollObserver(),
      selector = 'img.lazyload',
      threshold = 350,
    } = {}
  ) {
    this.initialized = false;
    this.scrollObserver = scrollObserver;
    this.selector = selector;
    this.threshold = threshold;

    this.checkElements = this.checkElements.bind(this);
  }

  init() {
    if (this.initialized) return;
    this.initialized = true;

    this.elements = selectAll(this.selector);
    this.checkElements();

    this.scrollObserver.add(this.checkElements);
  }

  checkElements() {
    const elements = this.elements;
    const threshold = this.threshold;
    const clientWidth = document.documentElement.clientWidth;
    const clientHeight = document.documentElement.clientHeight;

    const processedElements = [];

    elements.forEach((element, idx) => {
      // the element is not visible at all, no need
      if (!elementIsVisible(element)) return;

      const rect = element.getBoundingClientRect();

      const visible =
        rect.top <= clientHeight + threshold &&
        rect.right >= -threshold &&
        rect.bottom >= -threshold &&
        rect.left <= clientWidth + threshold;

      if (visible) {
        processedElements.push(idx);
        element.classList.add('lazyload--loaded');

        const src = element.getAttribute('data-src');
        const srcset = element.getAttribute('data-srcset');

        if (srcset && supportsSrcset) {
          element.setAttribute('srcset', srcset);
        } else {
          element.setAttribute('src', src);
        }

        element.onload = () => element.classList.add('loaded');
      }

      while (processedElements.length > 0) {
        elements.splice(processedElements.pop(), 1);
      }

      if (elements.length === 0) {
        this.scrollObserver.remove(this.checkElements);
      }
    }, this);
  }
}
