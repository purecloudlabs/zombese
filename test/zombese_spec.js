"use strict";
var zombese   = require("..");
var expect    = require("chai").expect;
var Browser   = require("zombie");
var utilities = require("./helpers/utilities");
var Sinon     = require("sinon");

var FirefoxZombeseDialect = require("../lib/webrtc/dialects/FirefoxZombeseDialect");

describe("zombese", function () {
	describe("dialects", function () {
		it("has a default dialect that is set to FirefoxZombeseDialect", function () {
			expect(zombese.dialects).to.have.property("Default");
			expect(zombese.dialects.Default).to.equal(FirefoxZombeseDialect);
		});

		it("has a firefox dialect", function () {
			expect(zombese.dialects).to.have.property("Firefox");
			expect(zombese.dialects.Firefox).to.equal(FirefoxZombeseDialect);
		});
	});

	describe("specifying the dialect to use", function () {
		var dialect = new zombese.dialects.Firefox();

		var browser;
		var teach;
		var window;

		before(function () {
			teach = Sinon.stub(dialect, "teach");
			Browser.extend(zombese(dialect));

			browser = new Browser();
			window  = browser.open({ name : "foo" });
		});

		after(function () {
			teach.restore();
			utilities.removeExtensions();
		});

		it("teaches the new window the dialect", function () {
			expect(teach.calledOnce).to.be.true;
		});

		it("configures the browser instance", function () {
			expect(browser.userAgent).to.equal(dialect.userAgent);
			expect(browser.window.navigator.userAgent).to.equal(dialect.userAgent);
		});
	});

	describe("not specifying the dialect to use", function () {
		var browser;
		var Default;
		var window;
		var teach;

		before(function () {
			var dialect = new zombese.dialects.Default();

			teach   = Sinon.stub(dialect, "teach");
			Default = Sinon.stub(zombese.dialects, "Default");
			Default.returns(dialect);

			Browser.extend(zombese());
			browser = new Browser();
			window = browser.open({ name : "foo" });
		});

		after(function () {
			Default.restore();
			teach.restore();
			utilities.removeExtensions();
		});

		it("teaches the new window the default dialect", function () {
			expect(Default.calledOnce).to.be.true;
			expect(teach.calledOnce).to.be.true;
		});
	});
});
