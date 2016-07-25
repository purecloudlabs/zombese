"use strict";
var Bluebird = require("bluebird");
var Browser  = require("zombie");
var Nock     = require("nock");
var Path     = require("path");
var Sinon    = require("sinon");
var Zombese  = require("../..");

var expect = require("chai").expect;

describe("The Kurento Utils adapter", function () {
	var teachDialect = new Zombese();

	before(function () {
		var page     = Path.join(__dirname, "fixtures", "kurento.html");
		var polyfill = Path.join(__dirname, "..", "bower_components", "adapter.js", "adapter-0.2.10.js");
		var scope    = new Nock("http://localhost").persist();
		var script   = Path.join(__dirname, "..", "bower_components", "kurento-utils", "js", "kurento-utils.js");

		// Base Kurento page.
		scope.get("/").replyWithFile(200, page);
		// adapter.js polyfill.
		scope.get("/adapter.js").replyWithFile(200, polyfill);
		// Kurento Utils script.
		scope.get("/kurento-utils.js").replyWithFile(200, script);
	});

	after(function () {
		Nock.cleanAll();
	});

	describe("initiating an offer", function () {
		var browser;
		var handleError;
		var handleOffer;
		var webRtcPeer;

		var finished = new Bluebird(function (resolve, reject) {
			handleError = Sinon.spy(reject);
			handleOffer = Sinon.spy(resolve);
		});

		before(function () {
			browser = new Browser();
			teachDialect(browser);

			return browser.visit("/")
			.then(function () {
				var localVideo  = browser.query("#local");
				var remoteVideo = browser.query("#remote");

				webRtcPeer = browser.window.kurentoUtils.WebRtcPeer.startSendRecv(
					localVideo, remoteVideo, handleOffer, handleError
				);
				return finished;
			});
		});

		after(function () {
			browser.destroy();
		});

		it("generates an offer", function () {
			expect(handleError.called).to.be.false;
			expect(handleOffer.called).to.be.true;
			expect(handleOffer.firstCall.args[0]).to.exist;
		});

		it("configures the local media stream", function () {
			expect(browser.query("#local").src).to.contain("zombese/streams/local");
		});

		describe("then receiving an answer", function () {
			before(function (done) {
				webRtcPeer.processSdpAnswer(null, done);
			});

			it("configures the remote media stream", function () {
				expect(browser.query("#remote").src).to.contain("zombese/streams/remote");
			});
		});
	});
});
