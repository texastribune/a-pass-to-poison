import select from './utils/select';

if (select('img.lazyload') != null) {
  import(/* webpackChunkName: "lazyload" */ './utils/lazyload').then(module => {
    const LazyLoad = module.default;

    const ll = new LazyLoad();
    ll.init();
  });
}
