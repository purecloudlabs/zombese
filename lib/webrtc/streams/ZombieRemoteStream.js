"use strict";
var URL = require("url");

var ZombieMediaStream = require("./ZombieMediaStream");

function ZombieRemoteStream () {
	ZombieMediaStream.call(this);
}

ZombieRemoteStream.prototype             = Object.create(ZombieMediaStream.prototype);
ZombieRemoteStream.prototype.constructor = ZombieRemoteStream;

ZombieRemoteStream.prototype.url = function () {
	var url = ZombieMediaStream.prototype.url.call(this);

	return URL.resolve(url, "remote/" + this.id);
};

module.exports = ZombieRemoteStream;
