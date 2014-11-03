"use strict";
var expect             = require("chai").expect;
var ZombieMediaStream  = require("../../../lib/webrtc/streams/ZombieMediaStream");
var ZombieRemoteStream = require("../../../lib/webrtc/streams/ZombieRemoteStream");

describe("A zombese remote media stream", function () {
	var stream;

	before(function () {
		stream = new ZombieRemoteStream();
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
			expect(url, "url").to.equal("blob:/zombese/streams/remote/" + stream.id);
		});
	});
});
