"use strict";
var UUID = require("node-uuid");

function ZombieMediaStream () {
	this.id   = UUID.v4();
}

ZombieMediaStream.prototype.url = function () {
	return "blob:/zombese/streams/" + this.id;
};

module.exports = ZombieMediaStream;
