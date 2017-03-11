var Promise = require('promise');
var soundcloud = require('./../../shared/soundcloud');

function SoundcloudPlayer(context) {
  this.context = context;
  this.classNames = {
    title: '.ks-player__track',
    playing: 'ks-player--playing',
    playBtn: '.ks-player__btn--play',
    pauseBtn: '.ks-player__btn--pause',
    prevBtn: '.ks-player__btn--prev',
    nextBtn: '.ks-player__btn--next'
  };

  soundcloud.getTracks()
    .then(this.init.bind(this));
}

SoundcloudPlayer.prototype = {
  init: function init(tracks) {
    this.tracks = tracks;
    this.trackIndex = Math.floor(Math.random() * this.tracks.length);
    this.title = this.context.querySelector(this.classNames.title);
    this.playBtn = this.context.querySelector(this.classNames.playBtn);
    this.pauseBtn = this.context.querySelector(this.classNames.pauseBtn);
    this.prevBtn = this.context.querySelector(this.classNames.prevBtn);
    this.nextBtn = this.context.querySelector(this.classNames.nextBtn);

    this.nextBtn.addEventListener('click', this.next.bind(this));
    this.prevBtn.addEventListener('click', this.prev.bind(this));
    this.playBtn.addEventListener('click', this.play.bind(this));
    this.pauseBtn.addEventListener('click', this.pause.bind(this));

    this.play();
  },

  getCurrTrack: function getCurrTrack() {
    return this.tracks[this.trackIndex];
  },

  setCurrentTrack: function setCurrentTrack(index) {
    this.trackIndex = index;

    return true;
  },

  toggleClass: function toggleClass(className, add) {
    this.context.classList[add ? 'add' : 'remove'](className);

    return true;
  },

  setTitle: function setTitle(title) {
    this.title.textContent = title;

    return true;
  },

  bindFinish: function bindFinish(res) {
    if (res.isFirstPlay) {
      res.player.on('finish', this.next.bind(this));
    }

    return true;
  },

  play: function play(event) {
    var track = this.getCurrTrack();

    soundcloud.play(track.id)
      .then(this.bindFinish.bind(this))
      .then(this.setTitle.bind(this, track.title))
      .then(this.toggleClass.bind(this, this.classNames.playing, true))
      .then(function () {
        if (event) {
          this.pauseBtn.focus();
        }
      }.bind(this));
  },

  pause: function pause(event) {
    var track = this.getCurrTrack();

    soundcloud.pause(track.id)
      .then(this.toggleClass.bind(this, this.classNames.playing, false))
      .then(function () {
        if (event) {
          this.playBtn.focus();
        }
      }.bind(this));
  },

  stop: function stop() {
    var track = this.getCurrTrack();

    soundcloud.stop(track.id);
  },

  next: function next() {
    this.change(1);
  },

  prev: function prev() {
    this.change(-1);
  },

  change: function change(dir) {
    var loopIndex = dir === 1 ? 0 : this.tracks.length - 1;
    var tryIndex = this.trackIndex + dir;
    var index = this.tracks[tryIndex] ? tryIndex : loopIndex;

    this.stop();
    this.setCurrentTrack(index);
    this.play();
  }
};

module.exports = new SoundcloudPlayer(document.querySelector('.ks-player'));
