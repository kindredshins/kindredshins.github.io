var FrameVideoImage = require('./frame-video-image');

function FrameVideo(where, fps) {
  var props = {
    canvas: null,
    context: null,
    width: null,
    height: null,
    images: [],
    delta: null,
    interval: null,
    then: null
  };

  function create() {
    props.canvas = document.createElement('canvas');
    props.context = props.canvas.getContext('2d');
    props.width = props.canvas.width = document.body.clientWidth;
    props.height = props.canvas.height = document.body.clientHeight;

    // default to 30 frames per second
    props.interval = 1000 / (fps || 30);
    props.then = Date.now();

    where.appendChild(props.canvas);

    return {
      init: init
    };
  }

  function init(framesPath) {
    window.fetch(framesPath)
      .then(function(response) {
        return response.json();
      })
      .then(function(json) {
        var images = preload(json.frames);

        loop(images);
      });
  }

  function preload(sources) {
    return sources.map(function(src) {
      var image = new Image();

      image.src = src;
      return image;
    });
  }

  function loop(images, frame) {
    frame = frame || 0;

    window.requestAnimationFrame(function() {
      props.images[frame] = props.images[frame] || FrameVideoImage(images[frame]);

      props.images[frame].then(function(image) {
        var hasUpdated = draw(image);
        var nextFrame = images[frame + 1] ? frame + 1 : 0;

        loop(images, hasUpdated ? nextFrame : frame);
      });
    });
  }

  function draw(image) {
    var width = image.getWidth();
    var height = image.getHeight();

    props.now = Date.now();
    props.delta = props.now - props.then;

    if (props.delta > props.interval) {
      props.then = props.now - (props.delta % props.interval);

      props.context.clearRect(0, 0, props.width, props.height);
      props.context.drawImage(image.canvas, 0, 0, width, height, 0, 0, props.width, props.height);

      return true;
    }

    return false;
  }

  return create();
}

module.exports = FrameVideo;
