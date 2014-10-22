"use strict";
var Browser = require("zombie");

before(function () {
	Browser.default.silent = true;
});
