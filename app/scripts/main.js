import loadDisqus from './utils/load-disqus';
import objectFitImages from 'object-fit-images';
import ScrollObserver from './utils/scroll-observer';
import select from './utils/select';

const masthead = select('.masthead');
const leadCard = select('#lead-card');
const commentsContainer = select('.container--comments');
const activateComments = select('#activate-comments');
const disqusThread = select('#disqus_thread');

const COMMENT_LOAD_THRESHOLD = 500;
const mastheadHeight = masthead.getBoundingClientRect().height;

const whenScroll = new ScrollObserver();

// masthead background handler
whenScroll.add(() => {
  const rect = leadCard.getBoundingClientRect();

  if (rect.bottom - mastheadHeight * 0.75 < 0) {
    masthead.classList.add('masthead--background');
  } else {
    masthead.classList.remove('masthead--background');
  }
});

// load disqus when close
const disqusScrollWatcher = whenScroll.add(() => {
  const rect = commentsContainer.getBoundingClientRect();
  const clientHeight = document.documentElement.clientHeight;

  if (rect.top <= clientHeight + COMMENT_LOAD_THRESHOLD) {
    loadDisqus(() => {
      disqusScrollWatcher.remove();
    });
  }
});

/*
Kickstart the scroll watcher in case it's reloaded in the middle of the page
 */
whenScroll.onScroll();

if (select('.dv-gpt-ad') != null) {
  import(/* webpackChunkName: "adloader" */ './utils/ad-loader').then(
    module => {
      const AdLoader = module.default;

      const loader = new AdLoader({ targetingValue: 'pass-to-poison' });
      loader.init();
    }
  );
}

activateComments.addEventListener('click', () => {
  commentsContainer.classList.add('container--comments-loading');

  loadDisqus(() => {
    disqusThread.scrollIntoView();
    disqusScrollWatcher.remove();
  });
});

if (select('img.lazyload') != null) {
  import(/* webpackChunkName: "lazyload" */ './utils/lazyload').then(module => {
    const LazyLoad = module.default;

    const ll = new LazyLoad({ scrollObserver: whenScroll });
    ll.init();

    objectFitImages('img.js-lazyload-img');
  });
}
