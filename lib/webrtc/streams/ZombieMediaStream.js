"use strict";
var UUID = require("uuid");

function ZombieMediaStream () {
	this.id   = UUID.v4();
}

ZombieMediaStream.prototype.url = function () {
	return "blob:/zombese/streams/" + this.id;
};

ZombieMediaStream.prototype.getAudioTracks = function () {
	return [];
};

ZombieMediaStream.prototype.getVideoTracks = function () {
	return [];
};

ZombieMediaStream.prototype.getTracks = function () {
	return [];
};

module.exports = ZombieMediaStream;
