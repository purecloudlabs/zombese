"use strict";
var ZombeseDialect = require("./ZombeseDialect");

function FirefoxZombeseDialect () {
	ZombeseDialect.call(this);
}

FirefoxZombeseDialect.prototype = Object.create(ZombeseDialect.prototype);

FirefoxZombeseDialect.prototype.teach = function (window) {
	var navigator = window.navigator;

	navigator.mozGetUserMedia       = navigator.zombieGetUserMedia;
	window.mozRTCPeerConnection     = window.zombieRTCPeerConnection;
	window.mozRTCSessionDescription = window.zombieRTCSessionDescription;
	window.mozRTCIceCandidate       = window.zombieRTCIceCandidate;
	window.URL                      = window.zombieURL;

	return window;
};

module.exports = FirefoxZombeseDialect;
