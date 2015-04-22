"use strict";
var Bluebird = require("bluebird");
var Enforcer = require("gulp-istanbul-enforcer");
var Fs       = require("fs");
var Gulp     = require("gulp");
var Istanbul = require("gulp-istanbul");
var Jscs     = require("gulp-jscs");
var Jshint   = require("gulp-jshint");
var Mocha    = require("gulp-mocha");
var Path     = require("path");
var Stylish  = require("jshint-stylish");

var consume = require("stream-consume");
var _       = require("lodash");

var paths = {
	jscs : Path.join(__dirname, ".jscsrc"),

	jshint : {
		source : Path.join(__dirname, ".jshintrc"),
		test   : Path.join(__dirname, "test", ".jshintrc")
	},

	source : [
		Path.join(__dirname, "*.js"),
		Path.join(__dirname, "lib", "**", "*.js")
	],

	test : [
		Path.join(__dirname, "test", "helpers", "setup.js"),
		Path.join(__dirname, "test", "**", "*_spec.js")
	]
};

function lint (options, files) {
	return Gulp.src(files)
	.pipe(new Jshint(options))
	.pipe(Jshint.reporter(Stylish))
	.pipe(Jshint.reporter("fail"));
}

function style (options, files) {
	return Gulp.src(files).pipe(new Jscs(options));
}

function loadOptions (path) {
	return Bluebird.fromNode(function (callback) {
		Fs.readFile(path, { encoding : "utf8" }, callback);
	})
	.then(function (contents) {
		return JSON.parse(contents);
	});
}

function promisefy (stream) {
	var promise = new Bluebird(function (resolve, reject) {
		stream.once("finish", resolve);
		stream.once("error", reject);
	});
	consume(stream);
	return promise;
}

Gulp.task("lint", [ "lint-source", "lint-test" ]);

Gulp.task("lint-source", function () {
	return loadOptions(paths.jshint.source)
	.then(function (options) {
		return promisefy(lint(options, paths.source));
	});
});

Gulp.task("lint-test", function () {
	return Bluebird.join(
		loadOptions(paths.jshint.source),
		loadOptions(paths.jshint.test)
	)
	.spread(function (source, test) {
		var options = _.merge(source, test);
		return promisefy(lint(options, paths.test));
	});
});

Gulp.task("style", function (done) {
	return loadOptions(paths.jscs)
	.then(function (options) {
		style(options, paths.source.concat(paths.test))
		.on("end", done)
		.on("error", done);
	});
});

Gulp.task("test-unit", [ "lint", "style" ], function (done) {
	var stream = Gulp.src(paths.source)
	.pipe(new Istanbul())
	.on("finish", function () {
		var stream = Gulp.src(paths.test)
		.pipe(new Mocha())
		.pipe(Istanbul.writeReports())
		.on("end", done)
		.on("error", done);
		consume(stream);
	});
	consume(stream);
});

Gulp.task("coverage", [ "test-unit" ], function () {
	var options = {
		thresholds : {
			statements : 100,
			branches   : 100,
			lines      : 100,
			functions  : 100
		},

		coverageDirectory : "coverage",

		rootDirectory : ""
	};

	return Gulp.src(".")
	.pipe(new Enforcer(options));
});

Gulp.task("test", [ "test-unit", "coverage" ]);

Gulp.task("default", [ "test" ]);
