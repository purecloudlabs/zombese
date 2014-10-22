"use strict";

function ZombeseDialect () {

}

ZombeseDialect.prototype.teach = function (window) {
	window.URL = window.URL || {};
	window.URL.createObjectURL = function () {
		return "blob:http%3A//zombese/braaaaaiiiiiinnnssssssss";
	};

	return window;
};

module.exports = ZombeseDialect;