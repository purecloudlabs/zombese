"use strict";
var expect            = require("chai").expect;
var UUID              = require("uuid");

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

	it("will accept an id option in the constructor arguments", function () {
		var id = UUID.v4();
		var testStream = new ZombieMediaStream({id: id});
		expect(testStream.id).to.equal(id);
	});

	it("will default to having no tracks", function () {
		expect(stream.getTracks()).to.have.length(0);
	});

	it("will initialize the tracks list from an optional constructor argument", function () {
		var tracks = [
			{kind: "audio"},
			{kind: "video"}
		];
		var testStream = new ZombieMediaStream({tracks: tracks});
		expect(testStream.getTracks()).to.deep.equal(tracks);
	});

	describe("audio track list", function () {
		it("will include only tracks with kind=audio", function () {
			var tracks = [
				{kind: "data"},
				{kind: "audio"},
				{kind: "video"}
			];
			var testStream = new ZombieMediaStream({tracks: tracks});
			expect(testStream.getAudioTracks()).to.deep.equal([{kind: "audio"}]);
		});
	});

	describe("video track list", function () {
		it("will include only tracks with kind=video", function () {
			var tracks = [
				{kind: "data"},
				{kind: "audio"},
				{kind: "video"}
			];
			var testStream = new ZombieMediaStream({tracks: tracks});
			expect(testStream.getVideoTracks()).to.deep.equal([{kind: "video"}]);
		});
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
