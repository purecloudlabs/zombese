"use strict";
var ZombeseDialect        = require("./webrtc/dialects/ZombeseDialect");
var FirefoxZombeseDialect = require("./webrtc/dialects/FirefoxZombeseDialect");

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
		dialect = new zombese.dialects.Default();
	}

	return function (browser) {
		// Teach new windows how to speak Zombese.
		browser.userAgent = dialect.userAgent;
		browser.on("opened", function (window) {
			dialect.teach(window);
		});

		return browser;
	};
}

zombese.dialects = {
	Default : FirefoxZombeseDialect,
	Firefox : FirefoxZombeseDialect
};

module.exports = zombese;
