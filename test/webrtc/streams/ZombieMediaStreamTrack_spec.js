"use strict";
var expect                 = require("chai").expect;
var ZombieMediaStreamTrack = require("../../../lib/webrtc/streams/ZombieMediaStreamTrack");

describe("A Zombie media stream track", function () {
	var streamTrack;

	before(function () {
		streamTrack = new ZombieMediaStreamTrack();
	});

	it("has an ID", function () {
		expect(streamTrack, "id").to.have.property("id")
		.that.is.a("string")
		.and.has.length.greaterThan(0);
	});

	it("is in a ready state", function () {
		expect(streamTrack, "readyState").to.have.property("readyState", "live");
	});

	it("is enabled", function () {
		expect(streamTrack, "enabled").to.have.property("enabled", true);
	});

	describe("stopping the track", function () {
		before(function () {
			streamTrack.stop();
		});

		it("puts it in an ended state", function () {
			expect(streamTrack, "readyState").to.have.property("readyState", "ended");
		});
	});
});
