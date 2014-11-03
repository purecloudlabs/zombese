"use strict";
var expect = require("chai").expect;
var sinon  = require("sinon");

var FirefoxZombeseDialect       = require("../../../lib/webrtc/dialects/FirefoxZombeseDialect");
var ZombieLocalStream           = require("../../../lib/webrtc/streams/ZombieLocalStream");
var ZombieRTCPeerConnection     = require("../../../lib/webrtc/ZombieRTCPeerConnection");
var ZombieRTCIceCandidate       = require("../../../lib/webrtc/ZombieRTCIceCandidate");
var ZombieRTCSessionDescription = require("../../../lib/webrtc/ZombieRTCSessionDescription");

describe("A Firefox dialect", function () {
	var dialect;

	before(function () {
		dialect = new FirefoxZombeseDialect();
	});

	describe("teaching a window", function () {
		var window = {
			navigator : {}
		};

		before(function () {
			dialect.teach(window);
		});

		it("creates mozRTCPeerConnection", function () {
			expect(window.mozRTCPeerConnection).to.equal(ZombieRTCPeerConnection);
		});

		it("creates mozRTCSessionDescription", function () {
			expect(window.mozRTCSessionDescription).to.equal(ZombieRTCSessionDescription);
		});

		it("creates mozRTCIceCandidate", function () {
			expect(window.mozRTCIceCandidate).to.equal(ZombieRTCIceCandidate);
		});

		it("creates mozGetUserMedia", function () {
			expect(window.navigator.mozGetUserMedia).to.be.a("function");
		});

		describe("getting the local media stream", function () {
			var success = sinon.spy();

			before(function (done) {
				window.navigator.mozGetUserMedia({}, success);
				expect(success.called, "synchronous").to.be.false;
				process.nextTick(done);
			});

			it("calls the success callback with the media event", function () {
				expect(success.calledOnce).to.be.true;
				expect(success.calledWith(sinon.match.instanceOf(ZombieLocalStream))).to.be.true;
			});
		});
	});
});
