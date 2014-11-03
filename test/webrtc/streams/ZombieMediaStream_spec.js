"use strict";
var expect            = require("chai").expect;
var ZombieMediaStream = require("../../../lib/webrtc/streams/ZombieMediaStream");

describe("A Zombie media stream", function () {
	var stream;

	before(function () {
		stream = new ZombieMediaStream();
	});

	it("has an ID", function () {
		expect(stream, "id").to.have.property("id")
		.that.is.a("string")
		.and.has.length.greaterThan(0);
	});

	describe("rendered as a string", function () {
		var url;

		before(function () {
			url = stream.url();
		});

		it("returns a non-specialized blob URL", function () {
			expect(url, "url").to.equal("blob:/zombese/streams/" + stream.id);
		});
	});
});
