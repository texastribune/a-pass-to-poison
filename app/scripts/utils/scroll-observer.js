import mitt from 'mitt';

export default class ScrollObserver {
  constructor() {
    this.initialized = false;
    this.observer = mitt();
    this.ticking = false;
    this.lastScrollPosition = 0;

    this.onScroll = this.onScroll.bind(this);
    this.update = this.update.bind(this);
  }

  requestTick() {
    if (!this.ticking) {
      requestAnimationFrame(this.update);
      this.ticking = true;
    }
  }

  onScroll() {
    this.lastScrollPosition = window.pageYOffset;
    this.requestTick();
  }

  update() {
    this.observer.emit('scroll', { offset: this.lastScrollPosition });
    this.ticking = false;
  }

  add(callback) {
    if (!this.initialized) {
      window.addEventListener('scroll', this.onScroll, false);
      this.initialized = true;
    }

    this.observer.on('scroll', callback);

    const remove = () => this.remove(callback);
    return { remove };
  }

  remove(callback) {
    this.observer.off('scroll', callback);
  }
}
