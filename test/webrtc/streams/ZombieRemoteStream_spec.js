"use strict";
var expect             = require("chai").expect;
var UUID               = require("node-uuid");
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

	it("will accept an id option in the constructor arguments", function () {
		var id = UUID.v4();
		var testStream = new ZombieRemoteStream({id: id});
		expect(testStream.id).to.equal(id);
	});

	it("will initialize the tracks list from an optional constructor argument", function () {
		var tracks = [
			{kind: "audio"},
			{kind: "video"}
		];
		var testStream = new ZombieRemoteStream({tracks: tracks});
		expect(testStream.getTracks()).to.deep.equal(tracks);
	});

	it("defaults to an empty audio track list", function () {
		var audioTracks = stream.getAudioTracks();
		expect(audioTracks, "audio tracks").to.deep.equal([]);
	});

	it("defaults to an empty video track list", function () {
		var videoTracks = stream.getVideoTracks();
		expect(videoTracks, "video tracks").to.deep.equal([]);
	});

	it("has an empty track list", function () {
		var tracks = stream.getTracks();
		expect(tracks, "tracks").to.deep.equal([]);
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
