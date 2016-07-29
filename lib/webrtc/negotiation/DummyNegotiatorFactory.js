"use strict";
var DummyNegotiator = require("./DummyNegotiator");

function createNegotiator () {
	return new DummyNegotiator();
}

module.exports = {
	createNegotiator: createNegotiator
};
