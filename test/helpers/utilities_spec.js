"use strict";
var Browser   = require("zombie");
var zombese   = require("../..");
var utilities = require("./utilities");
var expect    = require("chai").expect;

describe("The helper utilities", function () {
	describe("removing extensions", function () {
		before(function () {
			Browser.extend(zombese());
		});

		after(function () {
			utilities.removeExtensions();
		});

		it("has extensions before being cleared", function () {
			/* jscs: disable disallowDanglingUnderscores */
			expect(Browser._extensions, "no extensions").not.to.have.length(0);
			/* jscs: enable disallowDanglingUnderscores */
		});

		describe("after being cleared", function () {
			before(function () {
				utilities.removeExtensions();
			});

			it("has no extensions", function () {
				/* jscs: disable disallowDanglingUnderscores */
				expect(Browser._extensions, "found extensions").to.have.length(0);
				/* jscs: enable disallowDanglingUnderscores */
			});
		});
	});
});