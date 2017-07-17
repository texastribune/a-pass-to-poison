const DISQUS_URL = 'https://texastribune.disqus.com/embed.js';

let DISQUS_INITIALIZED = false;

export default function loadDisqus(callback) {
  if (DISQUS_INITIALIZED) {
    callback();
    return;
  }

  DISQUS_INITIALIZED = true;

  // create the `script` element
  var script = document.createElement('script');

  // set `data-timestamp` as Disqus desires
  script.setAttribute('data-timestamp', Date.now());

  // set its URL
  script.src = DISQUS_URL;

  // if there is a supplied callback, add it to `onload`
  if (callback) script.onload = callback;

  // attach the script to the document body
  document.body.appendChild(script);
}
