var FrameVideo = require('./../../shared/frame-video/frame-video');
var where = document.querySelector('#ks-background');
var video = new FrameVideo(where, 24);

video.init('/assets/videos/video.json');
