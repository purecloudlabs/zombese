"use strict";
var ZombeseDialect              = require("./ZombeseDialect");
var ZombieLocalStream           = require("../streams/ZombieLocalStream");
var ZombieMediaStreamTrack      = require("../streams/ZombieMediaStreamTrack");
var ZombieRTCPeerConnection     = require("../ZombieRTCPeerConnection");
var ZombieRTCIceCandidate       = require("../ZombieRTCIceCandidate");
var ZombieRTCSessionDescription = require("../ZombieRTCSessionDescription");

function FirefoxZombeseDialect () {
	ZombeseDialect.call(this);
}

FirefoxZombeseDialect.prototype = Object.create(ZombeseDialect.prototype);

FirefoxZombeseDialect.prototype.teach = function (window) {
	ZombeseDialect.prototype.teach.call(this, window);

	var navigator = window.navigator;

	window.mozRTCPeerConnection     = ZombieRTCPeerConnection;
	window.mozRTCSessionDescription = ZombieRTCSessionDescription;
	window.mozRTCIceCandidate       = ZombieRTCIceCandidate;
	window.MediaStreamTrack         = ZombieMediaStreamTrack;

	navigator.mozGetUserMedia = function (constraints, successCallback) {
		var stream = new ZombieLocalStream(constraints);

		process.nextTick(successCallback.bind(null, stream));
	};

	return window;
};

FirefoxZombeseDialect.prototype.userAgent =
	"Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:36.0) Gecko/20100101 Firefox/36.0";

module.exports = FirefoxZombeseDialect;
