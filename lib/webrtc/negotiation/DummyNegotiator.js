"use strict";
var ZombieRTCSessionDescription = require("../ZombieRTCSessionDescription");
var ZombieRemoteStream          = require("../streams/ZombieRemoteStream");

function DummyNegotiator() {
	// The dummy negotiator always seems a single remote stream
	this._remoteStream = new ZombieRemoteStream();
}

DummyNegotiator.prototype.createAnswer = function () {
	return new ZombieRTCSessionDescription();
};

DummyNegotiator.prototype.extractRemoteStreams = function () {
	return [this._remoteStream];
};

module.exports = DummyNegotiator;
