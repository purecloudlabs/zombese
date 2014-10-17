"use strict";
var FS       = require("fs");
var Gulp     = require("gulp");
var Path     = require("path");
var Q        = require("q");
var _        = require("lodash");
var Jshint   = require("gulp-jshint");
var Stylish  = require("jshint-stylish");
var istanbul = require("gulp-istanbul");
var mocha    = require("gulp-mocha");
var Jscs     = require("gulp-jscs");
var enforcer = require("gulp-istanbul-enforcer");

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
	return Q.ninvoke(FS, "readFile", path, { encoding : "utf8" })
	.then(function (contents) {
		return JSON.parse(contents);
	});
}

function promisefy (stream) {
	var deferred = Q.defer();

	stream.once("finish", deferred.resolve.bind(deferred));
	stream.once("error", deferred.reject.bind(deferred));

	return deferred.promise;
}

Gulp.task("lint", [ "lint-source", "lint-test" ]);

Gulp.task("lint-source", function () {
	return loadOptions(paths.jshint.source)
	.then(function (options) {
		return promisefy(lint(options, paths.source));
	});
});

Gulp.task("lint-test", function () {
	return Q.all([
		loadOptions(paths.jshint.source),
		loadOptions(paths.jshint.test)
	])
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
	Gulp.src(paths.source)
	.pipe(istanbul())
	.on("finish", function () {
		Gulp.src(paths.test)
		.pipe(mocha())
		.pipe(istanbul.writeReports())
		.on("end", done)
		.on("error", done);
	});
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
	.pipe(enforcer(options));
});

Gulp.task("test", [ "test-unit", "coverage" ]);

Gulp.task("default", [ "test" ]);