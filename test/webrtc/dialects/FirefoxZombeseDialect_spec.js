"use strict";
var FirefoxZombeseDialect       = require("../../../lib/webrtc/dialects/FirefoxZombeseDialect");
var Sinon                       = require("sinon");
var ZombieLocalStream           = require("../../../lib/webrtc/streams/ZombieLocalStream");
var ZombieMediaStreamTrack      = require("../../../lib/webrtc/streams/ZombieMediaStreamTrack");
var ZombieRTCPeerConnection     = require("../../../lib/webrtc/ZombieRTCPeerConnection");
var ZombieRTCIceCandidate       = require("../../../lib/webrtc/ZombieRTCIceCandidate");
var ZombieRTCSessionDescription = require("../../../lib/webrtc/ZombieRTCSessionDescription");

var expect = require("chai").expect;

describe("The Firefox dialect", function () {
	var dialect;

	before(function () {
		dialect = new FirefoxZombeseDialect();
	});

	it("specifies a user agent", function () {
		expect(dialect.userAgent).to.equal(
			"Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:36.0) Gecko/20100101 Firefox/36.0"
		);
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

		it("creates MediaStreamTrack", function () {
			expect(window.MediaStreamTrack).to.equal(ZombieMediaStreamTrack);
		});

		describe("getting the local media stream", function () {
			var success = Sinon.spy();

			before(function (done) {
				window.navigator.mozGetUserMedia({}, success);
				expect(success.called, "synchronous").to.be.false;
				process.nextTick(done);
			});

			it("calls the success callback with the media event", function () {
				expect(success.calledOnce).to.be.true;
				expect(success.calledWith(Sinon.match.instanceOf(ZombieLocalStream))).to.be.true;
			});
		});
	});
});
