"use strict";
var ZombieMediaStreamEvent          = require("./events/ZombieMediaStreamEvent");
var ZombieRemoteStream              = require("./streams/ZombieRemoteStream");
var ZombieRTCPeerConnectionIceEvent = require("./events/ZombieRTCPeerConnectionIceEvent");
var ZombieRTCSessionDescription     = require("./ZombieRTCSessionDescription");
var Promise                         = require("es6-promise").Promise;

var _ = require("lodash");

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

	this._remoteStreams = [];
	this._localStreams = [];

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

	if (typeof successCallback === "function") {
		process.nextTick(successCallback.bind(null, answer));
	}

	return Promise.resolve(answer);
};

ZombieRTCPeerConnection.prototype.createOffer = function (successCallback) {
	var offer = new ZombieRTCSessionDescription();
	var self  = this;

	process.nextTick(function () {
		successCallback(offer);
		if (typeof self.onicecandidate === "function") {
			self.onicecandidate(new ZombieRTCPeerConnectionIceEvent());
		}
	});
};

ZombieRTCPeerConnection.prototype.close = function () {
	this.iceConnectionState = "closed";
};

ZombieRTCPeerConnection.prototype.getRemoteStreams = function () {
	return _.clone(this._remoteStreams);
};

ZombieRTCPeerConnection.prototype.setLocalDescription = function (description, successCallback) {
	this.localDescription = description;

	if (typeof successCallback === "function") {
		process.nextTick(successCallback);
	}

	return Promise.resolve();
};

ZombieRTCPeerConnection.prototype.setRemoteDescription = function (description, successCallback) {
	var stream = new ZombieRemoteStream();
	this._remoteStreams.push(stream);

	if (this.onaddstream) {
		var event = new ZombieMediaStreamEvent(stream);
		process.nextTick(this.onaddstream.bind(null, event));
	}

	this.remoteDescription = description;
	if (successCallback) {
		process.nextTick(successCallback);
	}
	return Promise.resolve();
};

ZombieRTCPeerConnection.prototype.addIceCandidate = function (candidate, successCallback) {
	process.nextTick(successCallback);
};

ZombieRTCPeerConnection.prototype.addStream = function (stream) {
  this._localStreams.push(stream);
};

ZombieRTCPeerConnection.prototype.getLocalStreams = function () {
	return _.clone(this._localStreams);
};

module.exports = ZombieRTCPeerConnection;
