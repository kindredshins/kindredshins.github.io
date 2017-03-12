var instagram = require('./../../shared/instagram');

(function(context) {
  function create() {
    if (context) {
      instagram.getPhotos().then(init);
    }
  }

  function init(photos) {
    var fragment = buildPhotos(photos);

    // empty context
    while (context.hasChildNodes()) {
        context.removeChild(context.lastChild);
    }

    context.appendChild(fragment);
  }

  function buildPhotos(photos) {
    var fragment = window.document.createDocumentFragment();

    photos.forEach(function(photo) {
      var item = window.document.createElement('article');
      var link = window.document.createElement('a');
      var img = window.document.createElement('img');

      link.href = photo.url;
      link.target = '_blank';
      img.src = photo.src;
      item.classList.add('ks-photos__item');

      link.appendChild(img);
      item.appendChild(link);
      fragment.appendChild(item);
    });

    return fragment;
  }

  create();
})(document.querySelector('.ks-photos'))
