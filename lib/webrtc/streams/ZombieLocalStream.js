"use strict";
var URL = require("url");

var ZombieMediaStream = require("./ZombieMediaStream");

function ZombieLocalStream () {
	ZombieMediaStream.call(this);
}

ZombieLocalStream.prototype             = Object.create(ZombieMediaStream.prototype);
ZombieLocalStream.prototype.constructor = ZombieLocalStream;

ZombieLocalStream.prototype.url = function () {
	var url = ZombieMediaStream.prototype.url.call(this);

	return URL.resolve(url, "local/" + this.id);
};

module.exports = ZombieLocalStream;
