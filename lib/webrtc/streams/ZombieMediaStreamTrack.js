"use strict";
var UUID = require("node-uuid");

function ZombieMediaStreamTrack () {
	this.id      = UUID.v4();
	this.enabled = true;
	this.readyState = "live";
}

ZombieMediaStreamTrack.prototype.stop = function () {
	this.readyState = "ended";
};

module.exports = ZombieMediaStreamTrack;
