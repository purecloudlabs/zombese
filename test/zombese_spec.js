"use strict";
var zombese   = require("..");
var expect    = require("chai").expect;
var Browser   = require("zombie");
var utilities = require("./helpers/utilities");
var sinon     = require("sinon");

var FirefoxZombeseDialect = require("../lib/webrtc/dialects/FirefoxZombeseDialect");

describe("zombese", function () {
	describe("dialects", function () {
		it("has a default dialect that is set to FirefoxZombeseDialect", function () {
			expect(zombese.dialects).to.have.property("default");
			expect(zombese.dialects.default).to.equal(FirefoxZombeseDialect);
		});

		it("has a firefox dialect", function () {
			expect(zombese.dialects).to.have.property("firefox");
			expect(zombese.dialects.firefox).to.equal(FirefoxZombeseDialect);
		});
	});

	describe("specifying the dialect to use", function () {
		var browser;
		var window;
		var dialect = new zombese.dialects.firefox();
		var teach;

		before(function () {
			teach = sinon.stub(dialect, "teach");
			Browser.extend(zombese(dialect));
			browser = new Browser();
			window = browser.open({ name : "foo" });
		});

		after(function () {
			teach.restore();
			utilities.removeExtensions();
		});

		it("teaches the new window the dialect", function () {
			expect(teach.calledOnce).to.be.true;
		});
	});

	describe("not specifying the dialect to use", function () {
		var browser;
		var window;
		var teach;

		before(function () {
			teach = sinon.stub(zombese.dialects.default.prototype, "teach");
			Browser.extend(zombese());
			browser = new Browser();
			window = browser.open({ name : "foo" });
		});

		after(function () {
			teach.restore();
			utilities.removeExtensions();
		});

		it("teaches the new window the default dialect", function () {
			expect(teach.calledOnce).to.be.true;
		});
	});
});
