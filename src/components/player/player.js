var SC = require('soundcloud');
var Promise = require('promise');
var config = require('./../../../wintersmith');
var storage = require('./../../scripts/storage');
var ScPlayer = require('./../../scripts/soundcloud-player');
var scConfig = config.locals.soundcloud;

function getTracks(user) {
  var day = 60 * 60 * 24000;
  var tracks = storage.get('tracks', day);

  // Return tracks from store if the store is less than a day old
  if (tracks) {
    return Promise.resolve(tracks);
  }

  // Otherwise get tracks from the SoundCloud API
  return SC.get('/users/' + user + '/tracks')
    .then(function(res) {
      return res
        .filter(function (track) {
          return track.streamable;
        })
        .map(function (track) {
          return {
            id: track.id,
            title: track.title
          };
        });
    })
    .then(function (tracks) {
      // Store tracks so that we don't keep hitting the SoundCloud API
      storage.set('tracks', tracks);
      return tracks;
    });
}

SC.initialize({ client_id: scConfig.clientId });

getTracks(scConfig.userId).then(function (tracks) {
  var elem = document.querySelector('.ks-player');
  var player = new ScPlayer(elem, {
    title: '.ks-player__track',
    playing: 'ks-player--playing',
    playBtn: '.ks-player__btn--play',
    pauseBtn: '.ks-player__btn--pause',
    prevBtn: '.ks-player__btn--prev',
    nextBtn: '.ks-player__btn--next'
  });

  player.init(tracks);
});
