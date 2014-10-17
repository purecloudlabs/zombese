"use strict";
var Browser = require("zombie");

module.exports = {

	removeExtensions: function () {
		// Zombie does not expose a clean way to clear extensions.
		/* jscs: disable disallowDanglingUnderscores */
		Browser._extensions = [];
		/* jscs: enable disallowDanglingUnderscores */
	}

};
