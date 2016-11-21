var SC = require('soundcloud');

function Player(SC, context) {
  this.SC = SC;
  this.context = context;
}

Player.prototype = {
  init: function init(tracks) {
    this.playBtn = this.context.querySelector('.ks-player__play');
    this.prevBtn = this.context.querySelector('.ks-player__prev');
    this.nextBtn = this.context.querySelector('.ks-player__next');
    this.currTrack = Math.floor(Math.random() * tracks.length);
    this.tracks = tracks;
    this.players = {};

    this.nextBtn.addEventListener('click', this.next.bind(this));
    this.prevBtn.addEventListener('click', this.prev.bind(this));
    this.playBtn.addEventListener('click', function () {
      this.play.bind(this.tracks[this.currTrack]);
    }.bind(this));

    this.play(tracks[this.currTrack]);
  },

  play: function play(track) {
    var firstPlay = !this.players[track];

    this.players[track] = this.players[track] || this.SC.stream('/tracks/' + track);
    this.players[track].then(function (player) {
      player[player.isPlaying() ? 'pause' : 'play']();

      if (firstPlay) {
        player.on('finish', this.next.bind(this));
      }
    }.bind(this));
  },

  stop: function stop() {
    Object.keys(this.players).forEach(function (track) {
      this.players[track].then(function (player) {
        player.seek(0);
      });
    }.bind(this));
  },

  next: function next() {
    this.change(1);
  },

  prev: function prev() {
    this.change(-1);
  },

  change: function change(dir) {
    var loop = dir === 1 ? 0 : this.tracks.length - 1;
    var track = this.tracks[this.currTrack + dir] ? this.currTrack + dir : loop;

    this.stop();
    this.play(this.tracks[track]);
    this.currTrack = track;
  }
};

SC.initialize({
  client_id: '15c5a12b5d640af73b16bd240753ffbb'
});

SC.get('/users/25135193/tracks')
  .then(function(res) {
    return res
      .filter(function (track) {
        return track.streamable;
      })
      .map(function (track) {
        return track.id;
      });
  })
  .then(function (tracks) {
    var elem = document.querySelector('.ks-player');
    var ksPlayer = new Player(SC, elem);

    ksPlayer.init(tracks);
  });


