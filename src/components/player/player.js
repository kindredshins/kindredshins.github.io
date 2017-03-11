var Promise = require('promise');
var soundcloud = require('./../../shared/soundcloud');

(function(context) {
  var props = {
    context: null,
    tracks: null,
    trackIndex: null,
    title: null,
    playBtn: null,
    pauseBtn: null,
    prevBtn: null,
    nextBtn: null,
    classNames: {
      title: '.ks-player__track',
      playing: 'ks-player--playing',
      playBtn: '.ks-player__btn--play',
      pauseBtn: '.ks-player__btn--pause',
      prevBtn: '.ks-player__btn--prev',
      nextBtn: '.ks-player__btn--next'
    }
  };

  function create() {
    props.context = context;
    soundcloud.getTracks().then(init);
  }

  function init(tracks) {
    props.tracks = tracks;
    props.trackIndex = Math.floor(Math.random() * props.tracks.length);
    props.title = props.context.querySelector(props.classNames.title);
    props.playBtn = props.context.querySelector(props.classNames.playBtn);
    props.pauseBtn = props.context.querySelector(props.classNames.pauseBtn);
    props.prevBtn = props.context.querySelector(props.classNames.prevBtn);
    props.nextBtn = props.context.querySelector(props.classNames.nextBtn);

    props.nextBtn.addEventListener('click', next);
    props.prevBtn.addEventListener('click', prev);
    props.playBtn.addEventListener('click', play);
    props.pauseBtn.addEventListener('click', pause);

    play();
  }

  function getCurrTrack() {
    return props.tracks[props.trackIndex];
  }

  function setCurrentTrack(index) {
    props.trackIndex = index;
    return true;
  }

  function toggleClass(className, add) {
    props.context.classList[add ? 'add' : 'remove'](className);
    return true;
  }

  function setTitle(title) {
    props.title.textContent = title;
    return true;
  }

  function bindFinish(res) {
    if (res.isFirstPlay) {
      res.player.on('finish', next);
    }
    return true;
  }

  function play(event) {
    var track = getCurrTrack();

    soundcloud.play(track.id)
      .then(bindFinish)
      .then(setTitle.bind(null, track.title))
      .then(toggleClass.bind(null, props.classNames.playing, true))
      .then(function() {
        if (event) {
          props.pauseBtn.focus();
        }
      });
  }

  function pause(event) {
    var track = getCurrTrack();

    soundcloud.pause(track.id)
      .then(toggleClass.bind(null, props.classNames.playing, false))
      .then(function() {
        if (event) {
          props.playBtn.focus();
        }
      });
  }

  function stop() {
    var track = getCurrTrack();

    soundcloud.stop(track.id);
  }

  function next() {
    change(1);
  }

  function prev() {
    change(-1);
  }

  function change(direction) {
    var loopIndex = direction === 1 ? 0 : props.tracks.length - 1;
    var tryIndex = props.trackIndex + direction;
    var index = props.tracks[tryIndex] ? tryIndex : loopIndex;

    stop();
    setCurrentTrack(index);
    play();
  }

  create();
})(document.querySelector('.ks-player'));
