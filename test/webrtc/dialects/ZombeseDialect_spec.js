"use strict";
var expect = require("chai").expect;

var ZombeseDialect    = require("../../../lib/webrtc/dialects/ZombeseDialect");
var ZombieMediaStream = require("../../../lib/webrtc/streams/ZombieMediaStream");

describe("A ZombeseDialect", function () {
	var dialect;

	before(function () {
		dialect = new ZombeseDialect();
	});

	describe("teaching a window", function () {
		var window = {};

		before(function () {
			dialect.teach(window);
		});

		it("mocks the URL API", function () {
			expect(window.URL.createObjectURL).to.be.a("function");
		});

		describe("creating an object URL", function () {
			describe("for a zombese object", function () {
				var blob;
				var stream;

				before(function () {
					stream = new ZombieMediaStream();
					blob   = window.URL.createObjectURL(stream);
				});

				it("should return a blob", function () {
					expect(blob).to.equal(stream.url());
				});
			});

			describe("for a non-zombese object", function () {
				it("fails", function () {
					expect(function () {
						window.URL.createObjectURL({});
					}).to.throw(/not a zombese object/i);
				});
			});
		});
	});
});
