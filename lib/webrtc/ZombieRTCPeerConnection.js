"use strict";

var _ = require("lodash");

var ZombieMediaStreamEvent          = require("./events/ZombieMediaStreamEvent");
var ZombieRTCPeerConnectionIceEvent = require("./events/ZombieRTCPeerConnectionIceEvent");
var ZombieRTCSessionDescription     = require("./ZombieRTCSessionDescription");

var CONNECTION_STATES = [
	"new",
	"checking",
	"connected",
	"completed",
	"failed",
	"disconnected",
	"closed"
];

function ZombieRTCPeerConnection () {
	this.onaddstream                = null;
	this.onicecandidate             = null;
	this.oniceconnectionstatechange = null;
	this.localDescription           = null;
	this.remoteDescription          = null;

	var iceConnectionState = "new";
	Object.defineProperty(this, "iceConnectionState", {
		set : function (state) {
			if (!_.contains(CONNECTION_STATES, state)) {
				throw new Error("Invalid connection state: '" + state + "'");
			}

			var oldState = iceConnectionState;
			iceConnectionState = state;

			if (oldState !== state && this.oniceconnectionstatechange) {
				process.nextTick(this.oniceconnectionstatechange);
			}
		},
		get : function () {
			return iceConnectionState;
		},

		enumerable   : true,
		configurable : false
	});
}

ZombieRTCPeerConnection.prototype.createAnswer = function (successCallback) {
	var answer = new ZombieRTCSessionDescription();

	process.nextTick(successCallback.bind(null, answer));
};

ZombieRTCPeerConnection.prototype.createOffer = function (successCallback) {
	var offer = new ZombieRTCSessionDescription();

	process.nextTick(successCallback.bind(null, offer));
};

ZombieRTCPeerConnection.prototype.close = function () {
	this.iceConnectionState = "closed";
};

ZombieRTCPeerConnection.prototype.setLocalDescription = function (description, successCallback) {
	this.localDescription = description;
	process.nextTick(successCallback);
};

ZombieRTCPeerConnection.prototype.setRemoteDescription = function (description, successCallback) {
	this.remoteDescription = description;
	process.nextTick(successCallback);
};

ZombieRTCPeerConnection.prototype.addIceCandidate = function (candidate, successCallback) {
	var event;

	if (this.onicecandidate) {
		event = new ZombieRTCPeerConnectionIceEvent(candidate);
		process.nextTick(this.onicecandidate.bind(null, event));
	}

	process.nextTick(successCallback);
};

ZombieRTCPeerConnection.prototype.addStream = function (stream) {
	var event;

	if (this.onaddstream) {
		event = new ZombieMediaStreamEvent(stream);
		process.nextTick(this.onaddstream.bind(null, event));
	}
};

module.exports = ZombieRTCPeerConnection;
