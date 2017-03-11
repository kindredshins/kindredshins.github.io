var instagram = require('./../../shared/instagram');

(function(context) {
  function create() {
    instagram.getPhotos().then(init);
  }

  function init(photos) {
    var fragment = window.document.createDocumentFragment();

    photos.forEach(function(photo) {
      var item = window.document.createElement('li');
      var link = window.document.createElement('a');
      var img = window.document.createElement('img');

      link.href = photo.url;
      link.target = '_blank';
      img.src = photo.src;

      link.appendChild(img);
      item.appendChild(link);
      fragment.appendChild(item);
    });

    context.appendChild(fragment);
  }

  create();
})(document.querySelector('.ks-photos'))
