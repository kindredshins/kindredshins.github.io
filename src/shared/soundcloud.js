var Promise = require('promise');
var storage = require('./storage');
var config = require('./../../wintersmith');
var scConfig = config.locals.soundcloud;
var SC = require('soundcloud');

function Soundcloud() {
  var props = {
    players: {}
  };

  function getTracks() {
    var user = scConfig.userId;
    var day = 60 * 60 * 24000;
    var tracks = storage.get('tracks', day);

    // Return tracks from store if the store is less than a day old
    if (tracks) {
      return Promise.resolve(tracks);
    }

    // Otherwise get tracks from the SoundCloud API
    return SC.get('/users/' + user + '/tracks')
      .then(getStreamableTracks)
      .then(function(tracks) {
        // Store tracks so that we don't keep hitting the SoundCloud API
        storage.set('tracks', tracks);
        return tracks;
      });
  }

  function getStreamableTracks(tracks) {
    return tracks
      .filter(function(track) {
        return track.streamable;
      })
      .map(function(track) {
        return {
          id: track.id,
          title: track.title
        };
      });
  }

  function getPlayer(trackId) {
    return SC.stream('/tracks/' + trackId);
  }

  function play(trackId) {
    var isFirstPlay = !props.players[trackId];

    // Get player from SoundCloud if it doesn't exist in cache
    props.players[trackId] = props.players[trackId] || getPlayer(trackId);

    return props.players[trackId].then(function(player) {
      // Fixes https://github.com/soundcloud/soundcloud-javascript/issues/39
      if (player.options.protocols[0] === 'rtmp') {
          player.options.protocols.reverse();
      }

      player.play();

      return {
        player: player,
        isFirstPlay: isFirstPlay
      };
    });
  }

  function pause(trackId) {
    return props.players[trackId] && props.players[trackId].then(function(player) {
      player.pause();
      return player;
    });
  }

  function stop(trackId) {
    return props.players[trackId].then(function(player) {
      player.seek(0);
      return player;
    });
  }

  return {
    play: play,
    pause: pause,
    getTracks: getTracks
  };
};

SC.initialize({ client_id: scConfig.clientId });

module.exports = Soundcloud();

