"use strict";
var expect                      = require("chai").expect;
var ZombieRTCSessionDescription = require("../../lib/webrtc/ZombieRTCSessionDescription");

describe("A ZombieRTCSessionDescription", function () {
	var sessionDescription;
	var rawSDP = "candidate";

	before(function () {
		sessionDescription = new ZombieRTCSessionDescription(rawSDP);
	});

	it("sets the sdp property", function () {
		expect(sessionDescription).to.have.property("sdp");
		expect(sessionDescription.sdp).to.equal(rawSDP);
	});
});
