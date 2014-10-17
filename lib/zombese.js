"use strict";
var ZombieRTCPeerConnection     = require("./webrtc/ZombieRTCPeerConnection");
var ZombieRTCIceCandidate       = require("./webrtc/ZombieRTCIceCandidate");
var ZombieRTCSessionDescription = require("./webrtc/ZombieRTCSessionDescription");
var ZombieMediaStream           = require("./webrtc/ZombieMediaStream");
var ZombeseDialect              = require("./webrtc/dialects/ZombeseDialect");
var FirefoxZombeseDialect       = require("./webrtc/dialects/FirefoxZombeseDialect");

function isDialect (dialect) {
	if (dialect) {
		return dialect instanceof ZombeseDialect;
	}
	else {
		return false;
	}
}

function zombese (dialect) {
	if (!isDialect(dialect)) {
		dialect = new FirefoxZombeseDialect();
	}

	return function (browser) {
		function teach (window) {
			var navigator = window.navigator;

			window.zombieRTCPeerConnection     = ZombieRTCPeerConnection;
			window.zombieRTCSessionDescription = ZombieRTCSessionDescription;
			window.zombieRTCIceCandidate       = ZombieRTCIceCandidate;
			window.zombieURL                   = {};

			window.zombieURL.createObjectURL = function () {
				return "blob:http%3A//zombese/braaaaaiiiiiinnnssssssss";
			};

			navigator.zombieGetUserMedia = function (constraints, successCallback) {
				var stream = new ZombieMediaStream();
				successCallback(stream);
			};

			return dialect.teach(window);
		}

		// Teach new window show to speak Zombese.
		browser.on("opened", teach);

		return browser;
	};
}

zombese.dialects = {
	firefox : FirefoxZombeseDialect
};

module.exports = zombese;
