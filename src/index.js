if (!window.Promise) {
  window.Promise = require('promise');
}

if (!window.fetch) {
  require('whatwg-fetch');
}

require('svgxuse');
require('./components/background/background');
require('./components/player/player');
