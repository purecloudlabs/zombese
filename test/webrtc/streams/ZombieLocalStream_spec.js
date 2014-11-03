"use strict";
var expect            = require("chai").expect;
var ZombieLocalStream = require("../../../lib/webrtc/streams/ZombieLocalStream");
var ZombieMediaStream = require("../../../lib/webrtc/streams/ZombieMediaStream");

describe("A zombese local media stream", function () {
	var stream;

	before(function () {
		stream = new ZombieLocalStream();
	});

	it("is a ZombieMediaStream", function () {
		expect(stream, "stream").to.be.an.instanceOf(ZombieMediaStream);
	});

	describe("rendered as a string", function () {
		var url;

		before(function () {
			url = stream.url();
		});

		it("returns a specialized blob URL", function () {
			expect(url, "url").to.equal("blob:/zombese/streams/local/" + stream.id);
		});
	});
});
