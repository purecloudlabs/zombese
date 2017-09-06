"use strict";
var ZombeseDialect              = require("./ZombeseDialect");
var ZombieLocalStream           = require("../streams/ZombieLocalStream");
var ZombieMediaStreamTrack      = require("../streams/ZombieMediaStreamTrack");
var DummyNegotiationFactory     = require("../negotiation/DummyNegotiatorFactory");
var ZombieRTCPeerConnection     = require("../ZombieRTCPeerConnection");
var ZombieRTCIceCandidate       = require("../ZombieRTCIceCandidate");
var ZombieRTCSessionDescription = require("../ZombieRTCSessionDescription");

function FirefoxZombeseDialect (sessionNegotiatorFactory) {
	ZombeseDialect.call(this);
	this._sessionNegotiatorFactory = sessionNegotiatorFactory || DummyNegotiationFactory;
}

FirefoxZombeseDialect.prototype = Object.create(ZombeseDialect.prototype);

FirefoxZombeseDialect.prototype.teach = function (window) {
	ZombeseDialect.prototype.teach.call(this, window);

	var self = this;
	var navigator = window.navigator;

	window.RTCPeerConnection 				= window.mozRTCPeerConnection     = function () {
		var negotiator = self._sessionNegotiatorFactory.createNegotiator();
		return new ZombieRTCPeerConnection(negotiator);
	};
	window.RTCSessionDescription 		= window.mozRTCSessionDescription = ZombieRTCSessionDescription;
	window.RTCIceCandidate 					= window.mozRTCIceCandidate       = ZombieRTCIceCandidate;
	window.MediaStreamTrack         = ZombieMediaStreamTrack;

	navigator.mediaDevices = {};
	var mediaDevices = navigator.mediaDevices;
	mediaDevices.getUserMedia = navigator.mozGetUserMedia = function (constraints, successCallback) {
		var stream = new ZombieLocalStream(constraints);

		process.nextTick(successCallback.bind(null, stream));
	};

	return window;
};

FirefoxZombeseDialect.prototype.userAgent =
	"Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:36.0) Gecko/20100101 Firefox/36.0";

module.exports = FirefoxZombeseDialect;
