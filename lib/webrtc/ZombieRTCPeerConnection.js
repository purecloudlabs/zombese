"use strict";

var ZombieMediaStreamEvent       = require("./events/ZombieMediaStreamEvent");
var ZombiePeerConnectionIceEvent = require("./events/ZombiePeerConnectionIceEvent");
var ZombieRTCSessionDescription  = require("./ZombieRTCSessionDescription");
var _                            = require("lodash");

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

			if (oldState !== state) {
				if (this.oniceconnectionstatechange) {
					this.oniceconnectionstatechange();
				}
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

	successCallback(answer);
};

ZombieRTCPeerConnection.prototype.createOffer = function (successCallback) {
	var offer = new ZombieRTCSessionDescription();

	successCallback(offer);
};

ZombieRTCPeerConnection.prototype.close = function () {
	this.iceConnectionState = "closed";
};

ZombieRTCPeerConnection.prototype.setLocalDescription = function (description, successCallback) {
	this.localDescription = description;
	successCallback();
};

ZombieRTCPeerConnection.prototype.setRemoteDescription = function (description, successCallback) {
	this.remoteDescription = description;
	successCallback();
};

ZombieRTCPeerConnection.prototype.addIceCandidate = function (candidate, successCallback) {
	if (this.onicecandidate) {
		var event = new ZombiePeerConnectionIceEvent(candidate);
		this.onicecandidate(event);
	}

	successCallback();
};

ZombieRTCPeerConnection.prototype.addStream = function (stream) {
	if (this.onaddstream) {
		var event = new ZombieMediaStreamEvent(stream);
		this.onaddstream(event);
	}
};

module.exports = ZombieRTCPeerConnection;
