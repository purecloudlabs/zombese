"use strict";
var expect                       = require("chai").expect;
var FirefoxZombeseDialect        = require("../../../lib/webrtc/dialects/FirefoxZombeseDialect");

describe("A FirefoxZombeseDialect", function () {
	var dialect;

	before(function () {
		dialect = new FirefoxZombeseDialect();
	});

	describe("teaching a window", function () {
		var window = {
			zombieRTCPeerConnection     : "peerConnection",
			zombieRTCSessionDescription : "sessionDescription",
			zombieRTCIceCandidate       : "iceCandidate",
			zombieURL                   : "url",

			navigator : {
				zombieGetUserMedia : "getUserMedia"
			}
		};

		before(function () {
			dialect.teach(window);
		});

		it("maps mozRTCPeerConnection to zombieRTCPeerConnection", function () {
			expect(window, "not mapped").to.have.property("mozRTCPeerConnection");
			expect(window.mozRTCPeerConnection).to.equal(window.zombieRTCPeerConnection);
		});

		it("maps mozRTCSessionDescription to zombieRTCSessionDescription", function () {
			expect(window, "not mapped").to.have.property("mozRTCSessionDescription");
			expect(window.mozRTCSessionDescription).to.equal(window.zombieRTCSessionDescription);
		});

		it("maps mozRTCIceCandidate to zombieRTCIceCandidate", function () {
			expect(window, "not mapped").to.have.property("mozRTCIceCandidate");
			expect(window.mozRTCIceCandidate).to.equal(window.zombieRTCIceCandidate);
		});

		it("maps URL to zombieURL", function () {
			expect(window, "not mapped").to.have.property("URL");
			expect(window.URL).to.equal(window.zombieURL);
		});

		it("maps mozGetUserMedia to zombieGetUserMedia", function () {
			expect(window.navigator, "not mapped").to.have.property("mozGetUserMedia");
			expect(window.navigator.mozGetUserMedia).to.equal(window.navigator.zombieGetUserMedia);
		});
	});
});
