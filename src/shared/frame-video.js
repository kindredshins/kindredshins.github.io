var Promise = require('promise');
require('whatwg-fetch');

function FrameVideo(where, fps) {
  this._canvas = document.createElement('canvas');
  this._context = this._canvas.getContext('2d');
  this._width = this._canvas.width = document.body.clientWidth;
  this._height = this._canvas.height = document.body.clientHeight;
  this._images = [];

  // default to 30 frames per second
  this._interval = 1000 / (fps || 30);
  this._then = Date.now();

  where.appendChild(this._canvas);
}

FrameVideo.prototype = {
  init: function init(framesPath) {
    fetch(framesPath)
      .then(function (response) {
        return response.json();
      })
      .then(function (json) {
        var images = this._preload(json.frames);

        this._loop(images);
      }.bind(this));
  },

  _preload: function _preload(sources) {
    return sources.map(function (src) {
      var image = new Image();

      image.src = src;
      return image;
    });
  },

  _loop: function _loop(images, frame) {
    frame = frame || 0;

    window.requestAnimationFrame(function () {
      this._images[frame] = this._images[frame] || new FrameVideoImage(images[frame]);

      this._images[frame]
        .then(function (image) {
          var hasUpdated = this._draw(image);
          var nextFrame = images[frame + 1] ? frame + 1 : 0;

          this._loop(images, hasUpdated ? nextFrame : frame);
        }.bind(this));
    }.bind(this));
  },

  _draw: function _draw(image) {
    var width = image.getWidth();
    var height = image.getHeight();

    this._now = Date.now();
    this._delta = this._now - this._then;

    if (this._delta > this._interval) {
      this._then = this._now - (this._delta % this._interval);

      this._context.clearRect(0, 0, this._width, this._height);
      this._context.drawImage(image.canvas, 0, 0, width, height, 0, 0, this._width, this._height);

      return true;
    }

    return false;
  }
};

function FrameVideoImage(image) {
  this.canvas = document.createElement('canvas');
  this._context = this.canvas.getContext('2d');

  return this._init(image).then(this._draw.bind(this));
}

FrameVideoImage.prototype = {
  _init: function _init(image) {
    return new Promise(function (resolve, reject) {
      if (image.complete) {
        resolve(image);
      } else {
        image.addEventListener('load', resolve.bind(this, image));
      }
    });
  },

  _draw: function _draw(image) {
    this.canvas.width = image.width / 4;
    this.canvas.height = image.height / 4;

    this._context.drawImage(image, 0, 0,  this.canvas.width,  this.canvas.height);
    this._context.drawImage(this.canvas, 0, 0, this.getWidth(), this.getHeight());

    return this;
  },

  getWidth: function getWidth() {
    return this.canvas.width / 2;
  },

  getHeight: function getHeight() {
    return this.canvas.height / 2;
  }
};

module.exports = FrameVideo;
