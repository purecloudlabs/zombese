"use strict";
var zombese   = require("..");
var expect    = require("chai").expect;
var Browser   = require("zombie");
var utilities = require("./helpers/utilities");
var sinon     = require("sinon");

var ZombieRTCPeerConnection     = require("../lib/webrtc/ZombieRTCPeerConnection");
var ZombieRTCIceCandidate       = require("../lib/webrtc/ZombieRTCIceCandidate");
var ZombieRTCSessionDescription = require("../lib/webrtc/ZombieRTCSessionDescription");
var ZombieMediaStream           = require("../lib/webrtc/ZombieMediaStream");

describe("zombese", function () {
	describe("specifying the dialect to use", function () {
		var browser;
		var window;

		before(function () {
			Browser.extend(zombese(new zombese.dialects.firefox()));
			browser = new Browser();
			window = browser.open({ name : "foo" });
		});

		after(function () {
			utilities.removeExtensions();
		});

		describe("webrtc api", function () {
			it("zombieRTCPeerConnection", function () {
				expect(window).to.have.property("zombieRTCPeerConnection");
				expect(window.zombieRTCPeerConnection).to.equal(ZombieRTCPeerConnection);
			});

			it("zombieRTCSessionDescription", function () {
				expect(window).to.have.property("zombieRTCSessionDescription");
				expect(window.zombieRTCSessionDescription).to.equal(ZombieRTCSessionDescription);
			});

			it("zombieRTCIceCandidate", function () {
				expect(window).to.have.property("zombieRTCIceCandidate");
				expect(window.zombieRTCIceCandidate).to.equal(ZombieRTCIceCandidate);
			});

			it("zombieURL", function () {
				expect(window).to.have.property("zombieURL");
			});

			it("zombieURL.createObjectURL", function () {
				expect(window.zombieURL).to.have.property("createObjectURL");
				expect(window.zombieURL.createObjectURL).to.be.a("function");
			});

			describe("zombieURL.createObjectURL", function () {
				var blob;

				before(function () {
					blob = window.zombieURL.createObjectURL();
				});

				it("should return a blob", function () {
					expect(blob).to.equal("blob:http%3A//zombese/braaaaaiiiiiinnnssssssss");
				});
			});
		});

		describe("media api", function () {
			it("zombieGetUserMedia", function () {
				expect(window.navigator).to.have.property("zombieGetUserMedia");
				expect(window.navigator.zombieGetUserMedia).to.be.a("function");
			});

			describe("zombieGetUserMedia", function () {
				var success = sinon.spy();

				before(function () {
					window.navigator.zombieGetUserMedia({}, success);
				});

				it("calls the success callback with the media event", function () {
					expect(success.calledOnce).to.be.true;
					expect(success.calledWith(sinon.match.instanceOf(ZombieMediaStream))).to.be.true;
				});
			});
		});
	});

	describe("not specifying the dialect to use", function () {
		var browser;
		var window;

		before(function () {
			Browser.extend(zombese());
			browser = new Browser();
			window = browser.open({ name : "foo" });
		});

		after(function () {
			utilities.removeExtensions();
		});

		it("has a firefox dialect", function () {
			expect(zombese.dialects).to.have.property("firefox");
		});

		describe("webrtc api", function () {
			it("zombieRTCPeerConnection", function () {
				expect(window).to.have.property("zombieRTCPeerConnection");
				expect(window.zombieRTCPeerConnection).to.equal(ZombieRTCPeerConnection);
			});

			it("zombieRTCSessionDescription", function () {
				expect(window).to.have.property("zombieRTCSessionDescription");
				expect(window.zombieRTCSessionDescription).to.equal(ZombieRTCSessionDescription);
			});

			it("zombieRTCIceCandidate", function () {
				expect(window).to.have.property("zombieRTCIceCandidate");
				expect(window.zombieRTCIceCandidate).to.equal(ZombieRTCIceCandidate);
			});

			it("zombieURL", function () {
				expect(window).to.have.property("zombieURL");
			});

			it("zombieURL.createObjectURL", function () {
				expect(window.zombieURL).to.have.property("createObjectURL");
				expect(window.zombieURL.createObjectURL).to.be.a("function");
			});

			describe("zombieURL.createObjectURL", function () {
				var blob;

				before(function () {
					blob = window.zombieURL.createObjectURL();
				});

				it("should return a blob", function () {
					expect(blob).to.equal("blob:http%3A//zombese/braaaaaiiiiiinnnssssssss");
				});
			});
		});

		describe("media api", function () {
			it("zombieGetUserMedia", function () {
				expect(window.navigator).to.have.property("zombieGetUserMedia");
				expect(window.navigator.zombieGetUserMedia).to.be.a("function");
			});

			describe("zombieGetUserMedia", function () {
				var success = sinon.spy();

				before(function () {
					window.navigator.zombieGetUserMedia({}, success);
				});

				it("calls the success callback with the media event", function () {
					expect(success.calledOnce).to.be.true;
					expect(success.calledWith(sinon.match.instanceOf(ZombieMediaStream))).to.be.true;
				});
			});
		});
	});
});
