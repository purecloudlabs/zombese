"use strict";
var Browser   = require("zombie");
var zombese   = require("../..");
var utilities = require("./utilities");
var expect    = require("chai").expect;

describe("The helper utilities", function () {

	it("can clear the loaded browser extensions", function () {
		Browser.extend(zombese());
		/* jscs: disable disallowDanglingUnderscores */
		expect(Browser._extensions, "no extensions").not.to.have.length(0);
		utilities.removeExtensions();
		expect(Browser._extensions, "found extensions").to.have.length(0);
		/* jscs: enable disallowDanglingUnderscores */
	});
});
