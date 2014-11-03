"use strict";
var ZombieMediaStream = require("../streams/ZombieMediaStream");

function ZombeseDialect () {
}

ZombeseDialect.prototype.teach = function (window) {
	window.URL = window.URL || {};

	window.URL.createObjectURL = function (object) {
		if (object instanceof ZombieMediaStream) {
			return object.url();
		}

		throw new Error("Not a Zombese object.");
	};

	return window;
};

module.exports = ZombeseDialect;
