if (!window.Promise) { window.Promise = require('promise'); }
if (!window.fetch) { require('whatwg-fetch'); }
require('svgxuse');
require('./components/background/background');
require('./components/player/player');

var Navigo = require('navigo');
var router = new Navigo(null, true);
var pages = {};

function getResponseHtml(response) {
  return response.text();
}

function updatePage(content) {
  var main = content.match(/<main.*?>([\s\S]*)<\/main>/);

  document.getElementById('main').innerHTML = main[1];
  return main[0];
};

function loadPage(page, callback) {
  callback = callback || function () {};

  return function () {
    if (pages[page]) {
      updatePage(pages[page]);
      callback();
      return;
    }

    document.body.classList.add('is-loading');

    fetch('/' + page)
      .then(getResponseHtml)
      .then(updatePage)
      .then(function (content) {
        pages[page] = content;
        document.body.classList.remove('is-loading');
        callback();
      });
  }
}

function initPhotos() {
  var photos = require('./components/photos/photos');
  photos.create();
}

router.on({
  info: loadPage('info'),
  videos: loadPage('videos'),
  photos: loadPage('photos', initPhotos),
  gigs: loadPage('gigs'),
  merch: loadPage('merch'),
  contact: loadPage('contact')
});

router.resolve();
