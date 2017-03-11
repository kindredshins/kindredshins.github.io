var fetchJsonp = require('fetch-jsonp');
var wsConfig = require('./../../wintersmith');
var config = wsConfig.locals.instagram;

function Instagram() {
  props = {
    url: 'http://api.instagram.com/v1/users/' + config.userId + '/media/recent?access_token=' + config.token
  };

  function getPhotos() {
    return fetchJsonp(props.url)
      .then(function(response) {
        return response.json();
      })
      .then(reduceResponse);
  }

  function reduceResponse(photos) {
    return photos.data.map(function (photo) {
      return {
        src: photo.images.low_resolution.url,
        url: photo.link
      };
    });
  }

  return {
    getPhotos: getPhotos
  };
}

module.exports = Instagram();
