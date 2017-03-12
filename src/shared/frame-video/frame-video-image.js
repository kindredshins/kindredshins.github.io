module.exports = (function(Promise) {
  var props = {
    image: null,
    canvas: null,
    context: null,
  };

  function create(image) {
    props.image = image;
    props.canvas = document.createElement('canvas');
    props.context = props.canvas.getContext('2d');

    return init()
      .then(draw)
      .then(function(img) {
        return {
          canvas: props.canvas,
          getWidth: getWidth,
          getHeight: getHeight
        };
      });
  }

  function init() {
    return new Promise(function(resolve, reject) {
      if (props.image.complete) {
        resolve(props.image);
      } else {
        props.image.addEventListener('load', resolve.bind(null, props.image));
      }
    });
  }

  function draw(img) {
    props.canvas.width = props.image.width / 4;
    props.canvas.height = props.image.height / 4;

    props.context.drawImage(props.image, 0, 0,  props.canvas.width,  props.canvas.height);
    props.context.drawImage(props.canvas, 0, 0, getWidth(), getHeight());

    return img;
  }

  function getWidth() {
    return props.canvas.width / 2;
  }

  function getHeight() {
    return props.canvas.height / 2;
  }

  return create;
})(require('promise'));
