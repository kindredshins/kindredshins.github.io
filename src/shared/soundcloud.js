var Promise = require('promise');
var storage = require('./storage');
var config = require('./../../wintersmith');
var scConfig = config.locals.soundcloud;
var SC = require('soundcloud');

SC.initialize({ client_id: scConfig.clientId });

module.exports = {
  players: {},

  getTracks: function getTracks() {
    var user = scConfig.userId;
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
  },

  getPlayer: function(trackId) {
    return SC.stream('/tracks/' + trackId);
  },

  play: function play(trackId) {
    var isFirstPlay = !this.players[trackId];

    // Get player from SoundCloud if it doesn't exist in cache
    this.players[trackId] = this.players[trackId] || this.getPlayer(trackId);

    return this.players[trackId].then(function (player) {
      // Fixes https://github.com/soundcloud/soundcloud-javascript/issues/39
      if (player.options.protocols[0] === 'rtmp') {
          player.options.protocols.reverse();
      }

      player.play();

      return {
        player: player,
        isFirstPlay: isFirstPlay
      };
    }.bind(this));
  },

  pause: function pause(trackId) {
    return this.players[trackId] && this.players[trackId].then(function (player) {
      player.pause();
      return player;
    }.bind(this));
  },

  stop: function stop(trackId) {
    return this.players[trackId].then(function (player) {
      player.seek(0);
      return player;
    });
  },
};

