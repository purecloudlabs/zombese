"use strict";
var UUID = require("uuid");

function ZombieMediaStreamTrack (kind) {
	this.id      = UUID.v4();
	this.kind    = kind || "audio";
	this.enabled = true;
	this.readyState = "live";
}

ZombieMediaStreamTrack.prototype.stop = function () {
	this.readyState = "ended";
};

module.exports = ZombieMediaStreamTrack;
