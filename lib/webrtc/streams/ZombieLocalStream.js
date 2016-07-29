"use strict";
var URL = require("url");

var ZombieMediaStream      = require("./ZombieMediaStream");
var ZombieMediaStreamTrack = require("./ZombieMediaStreamTrack");

function ZombieLocalStream (constraints) {
	constraints = constraints || {};
	var tracks = [];
	if (constraints.audio) {
		var audioTrack = new ZombieMediaStreamTrack("audio");
		tracks.push(audioTrack);
	}

	if (constraints.video) {
		var videoTrack = new ZombieMediaStreamTrack("video");
		tracks.push(videoTrack);
	}

	ZombieMediaStream.call(this, {tracks: tracks});
}

ZombieLocalStream.prototype             = Object.create(ZombieMediaStream.prototype);
ZombieLocalStream.prototype.constructor = ZombieLocalStream;

ZombieLocalStream.prototype.url = function () {
	var url = ZombieMediaStream.prototype.url.call(this);

	return URL.resolve(url, "local/" + this.id);
};

module.exports = ZombieLocalStream;
