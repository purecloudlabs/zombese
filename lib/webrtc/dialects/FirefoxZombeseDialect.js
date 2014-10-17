"use strict";
var ZombeseDialect              = require("./ZombeseDialect");
var ZombieRTCPeerConnection     = require("../ZombieRTCPeerConnection");
var ZombieRTCIceCandidate       = require("../ZombieRTCIceCandidate");
var ZombieRTCSessionDescription = require("../ZombieRTCSessionDescription");
var ZombieMediaStream           = require("../ZombieMediaStream");

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

	navigator.mozGetUserMedia = function (constraints, successCallback) {
		var stream = new ZombieMediaStream();
		successCallback(stream);
	};

	return window;
};

module.exports = FirefoxZombeseDialect;
