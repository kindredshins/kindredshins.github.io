function FrameVideoImage(image) {
  var props = {
    canvas: null,
    context: null,
  };

  function create() {
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
      if (image.complete) {
        resolve(image);
      } else {
        image.addEventListener('load', resolve.bind(null, image));
      }
    });
  }

  function draw(img) {
    props.canvas.width = image.width / 4;
    props.canvas.height = image.height / 4;

    props.context.drawImage(image, 0, 0,  props.canvas.width,  props.canvas.height);
    props.context.drawImage(props.canvas, 0, 0, getWidth(), getHeight());

    return img;
  }

  function getWidth() {
    return props.canvas.width / 2;
  }

  function getHeight() {
    return props.canvas.height / 2;
  }

  return create();
}

module.exports = FrameVideoImage;
