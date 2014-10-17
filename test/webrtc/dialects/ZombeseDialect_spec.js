"use strict";
var expect = require("chai").expect;

var ZombeseDialect = require("../../../lib/webrtc/dialects/ZombeseDialect");

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

		it("creates URL.createObjectURL", function () {
			expect(window.URL.createObjectURL).to.be.a("function");
		});

		describe("URL.createObjectURL", function () {
			var blob;

			before(function () {
				blob = window.URL.createObjectURL();
			});

			it("should return a blob", function () {
				expect(blob).to.equal("blob:http%3A//zombese/braaaaaiiiiiinnnssssssss");
			});
		});
	});
});
