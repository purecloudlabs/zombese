"use strict";
var expect = require("chai").expect;

var ZombieRTCIceCandidate = require("../../lib/webrtc/ZombieRTCIceCandidate");

describe("A ZombieRTCIceCandidate", function () {
	var candidate;
	var rawCandidate = "candidate";

	before(function () {
		candidate = new ZombieRTCIceCandidate(rawCandidate);
	});

	it("sets the candidate property", function () {
		expect(candidate).to.have.property("candidate");
		expect(candidate.candidate).to.equal(rawCandidate);
	});
});