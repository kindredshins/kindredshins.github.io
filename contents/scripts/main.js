var svgxuse = require('svgxuse');
var FrameVideo = require('./frame-video');
var where = document.querySelector('#ks-background');
var video = new FrameVideo(where, 24);

video.init('/assets/videos/video.json');
