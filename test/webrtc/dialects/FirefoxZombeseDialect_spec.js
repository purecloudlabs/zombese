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
			var peerConnection = new window.mozRTCPeerConnection();
			expect(peerConnection).to.be.an.instanceOf(ZombieRTCPeerConnection);

			var peerConnection2 = new window.RTCPeerConnection();
			expect(peerConnection2).to.be.an.instanceOf(ZombieRTCPeerConnection);
		});

		it("creates mozRTCSessionDescription", function () {
			expect(window.mozRTCSessionDescription).to.equal(ZombieRTCSessionDescription);
			expect(window.RTCSessionDescription).to.equal(ZombieRTCSessionDescription);
		});

		it("creates mozRTCIceCandidate", function () {
			expect(window.mozRTCIceCandidate).to.equal(ZombieRTCIceCandidate);
			expect(window.RTCIceCandidate).to.equal(ZombieRTCIceCandidate);
		});

		it("creates mozGetUserMedia", function () {
			expect(window.navigator.mozGetUserMedia).to.be.a("function");
			expect(window.navigator.mediaDevices.getUserMedia).to.be.a("function");
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

			describe("when constraints are provided", function () {
				it("will create an audio track if an audio track constraint exists", function (done) {
					window.navigator.mozGetUserMedia({audio: true}, function (stream) {
						expect(stream.getAudioTracks(), "audio tracks").to.have.length(1);
						expect(stream.getVideoTracks(), "video tracks").to.have.length(0);
						done();
					});
				});

				it("will create an video track if an video track constraint exists", function (done) {
					window.navigator.mozGetUserMedia({video: true}, function (stream) {
						expect(stream.getVideoTracks(), "video tracks").to.have.length(1);
						expect(stream.getAudioTracks(), "audio tracks").to.have.length(0);
						done();
					});
				});

				it("can create media with the promise spec", function (done) {
					window.navigator.mediaDevices.getUserMedia({}).then(function (stream) {
						expect(stream instanceof ZombieLocalStream).to.be.true;
						done();
					}).catch(e => {
						console.log("Got an error", e);
					});
				});
			});
		});
	});
});
