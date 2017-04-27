var instagram = require('./../../shared/instagram');

module.exports = (function() {
  var instagramPhotos;
  var context;

  function create() {
    context = document.querySelector('.ks-photos');

    if (instagramPhotos) {
      init(instagramPhotos);
    } else {
      document.body.classList.add('is-loading');
      instagram.getPhotos().then(init);
    }
  }

  function init(photos) {
    var fragment = buildPhotos(photos);

    instagramPhotos = photos;
    context.appendChild(fragment);
    document.body.classList.remove('is-loading');
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

  return {
    create: create
  };
})();
