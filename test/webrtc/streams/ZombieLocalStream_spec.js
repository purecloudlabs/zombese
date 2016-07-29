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

	it("defaults to an empty audio track list", function () {
		var audioTracks = stream.getAudioTracks();
		expect(audioTracks, "audio tracks").to.deep.equal([]);
	});

	it("defaults to an empty video track list", function () {
		var videoTracks = stream.getVideoTracks();
		expect(videoTracks, "video tracks").to.deep.equal([]);
	});

	it("defaults to an empty track list", function () {
		var tracks = stream.getTracks();
		expect(tracks, "tracks").to.deep.equal([]);
	});

	describe("when constraints are provided", function () {
		it("will create an audio track if an audio track constraint exists", function () {
			var newStream = new ZombieLocalStream({audio: true});
			expect(newStream.getAudioTracks(), "audio tracks").to.have.length(1);
			expect(newStream.getVideoTracks(), "video tracks").to.have.length(0);
		});

		it("will create an video track if an video track constraint exists", function () {
			var newStream = new ZombieLocalStream({video: true});
			expect(newStream.getVideoTracks(), "video tracks").to.have.length(1);
			expect(newStream.getAudioTracks(), "audio tracks").to.have.length(0);
		});
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
