var wintersmith = require('./../../wintersmith');

module.exports = (function(fetch, config) {
  var props = {
    url: config.apiUrl + 'users/' + config.userId + '/media/recent?access_token=' + config.token
  };

  function getPhotos() {
    return fetch(props.url)
      .then(function(response) {
        return response.json();
      })
      .then(reduceResponse);
  }

  function reduceResponse(photos) {
    return photos.data.map(function(photo) {
      return {
        src: photo.images.low_resolution.url,
        url: photo.link
      };
    });
  }

  return {
    getPhotos: getPhotos
  };
})(
  require('fetch-jsonp'),
  wintersmith.locals.instagram
);
