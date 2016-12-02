var SC = require('soundcloud');
var assign = require('object.assign/polyfill')();

function ScPlayer(context, options) {
  this.context = context;
  this.opts = assign({}, this.constructor.defaults, options);
}

ScPlayer.prototype = {
  init: function init(tracks) {
    this.playBtn = this.context.querySelector(this.opts.playBtn);
    this.pauseBtn = this.context.querySelector(this.opts.pauseBtn);
    this.prevBtn = this.context.querySelector(this.opts.prevBtn);
    this.nextBtn = this.context.querySelector(this.opts.nextBtn);
    this.currTrack = Math.floor(Math.random() * tracks.length);
    this.tracks = tracks;
    this.players = {};

    this.nextBtn.addEventListener('click', this.next.bind(this));
    this.prevBtn.addEventListener('click', this.prev.bind(this));

    this.playBtn.addEventListener('click', function () {
      this.play(this.tracks[this.currTrack]);
    }.bind(this));

    this.pauseBtn.addEventListener('click', function () {
      this.pause(this.tracks[this.currTrack]);
    }.bind(this));

    this.play(tracks[this.currTrack]);
  },

  play: function play(track) {
    var isFirstPlay = !this.players[track];

    this.players[track] = this.players[track] || SC.stream('/tracks/' + track);
    this.players[track].then(function (player) {
      this.context.classList.add(this.opts.playing);
      player.play();

      if (isFirstPlay) {
        player.on('finish', this.next.bind(this));
      }
    }.bind(this));
  },

  pause: function pause(track) {
    if (this.players[track]) {
      this.players[track]
        .then(function (player) {
          this.context.classList.remove(this.opts.playing);
          player.pause();
        }.bind(this));
    }
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

ScPlayer.defaults = {
  playing: '-is-playing',
  playBtn: '.play',
  pauseBtn: '.pause',
  prevBtn: '.prev',
  nextBtn: '.next'
};

module.exports = ScPlayer;
