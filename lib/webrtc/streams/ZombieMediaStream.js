"use strict";
var UUID = require("node-uuid");
var _    = require("lodash");

function ZombieMediaStream (options) {
	options      = options || {};
	this.id      = options.id || UUID.v4();
	this._tracks = options.tracks || [];
}

ZombieMediaStream.prototype.url = function () {
	return "blob:/zombese/streams/" + this.id;
};

ZombieMediaStream.prototype.getAudioTracks = function () {
	return _.filter(this._tracks, {kind: "audio"});
};

ZombieMediaStream.prototype.getVideoTracks = function () {
	return _.filter(this._tracks, {kind: "video"});
};

ZombieMediaStream.prototype.getTracks = function () {
	return _.clone(this._tracks);
};

module.exports = ZombieMediaStream;
