"use strict";
var expect = require("chai").expect;
var sinon  = require("sinon");

var ZombieMediaStreamEvent       = require("../../lib/webrtc/events/ZombieMediaStreamEvent");
var ZombiePeerConnectionIceEvent = require("../../lib/webrtc/events/ZombieRTCPeerConnectionIceEvent");
var ZombieRemoteStream           = require("../../lib/webrtc/streams/ZombieRemoteStream");
var ZombieRTCPeerConnection      = require("../../lib/webrtc/ZombieRTCPeerConnection");
var ZombieRTCSessionDescription  = require("../../lib/webrtc/ZombieRTCSessionDescription");

describe("A ZombieRTCPeerConnection", function () {
	var connection;

	before(function () {
		connection = new ZombieRTCPeerConnection();
	});

	it("is initially in the 'new' iceconnectionstate", function () {
		expect(connection.iceConnectionState, "wrong state").to.equal("new");
	});

	describe("changing states", function () {
		describe("without a handler", function () {
			before(function (done) {
				connection.iceConnectionState = "connected";
				// Give async handlers a chance to run.
				process.nextTick(done);
			});

			after(function () {
				connection.iceConnectionState = "new";
			});

			it("changes state", function () {
				expect(connection.iceConnectionState).to.equal("connected");
			});
		});

		describe("with a handler", function () {
			describe("to the same state", function () {
				var handler;

				before(function (done) {
					connection.oniceconnectionstatechange = handler = sinon.spy();
					connection.iceConnectionState         = "new";
					// Give async handlers a chance to run.
					process.nextTick(done);
				});

				after(function () {
					connection.oniceconnectionstatechange = null;
				});

				it("doesn't invoke the handler", function () {
					expect(handler.called).to.be.false;
				});
			});

			describe("to a new state", function () {
				var handler;

				before(function (done) {
					connection.oniceconnectionstatechange = handler = sinon.spy();
					connection.iceConnectionState         = "connected";
					expect(handler.called, "synchronous").to.be.false;
					// Give async handlers a chance to run.
					process.nextTick(done);
				});

				after(function () {
					connection.iceConnectionState         = "new";
					connection.oniceconnectionstatechange = null;
				});

				it("invokes the handler", function () {
					expect(handler.calledOnce).to.be.true;
				});
			});
		});

		describe("to an invalid state", function () {
			var state = "super-invalid-state";

			var error;
			var handler;

			before(function (done) {
				connection.oniceconnectionstatechange = handler = sinon.spy();

				try {
					connection.iceConnectionState = state;
				}
				catch (e) {
					error = e;
				}

				// Give async handlers a chance to process.
				process.nextTick(done);
			});

			after(function () {
				connection.oniceconnectionstatechange = null;
			});

			it("throws an error", function () {
				expect(error).to.be.an.instanceof(Error);
				expect(error.message).to.equal("Invalid connection state: '" + state + "'");
			});

			it("does not invoke the state change handler", function () {
				expect(handler.called, "state change").to.be.false;
			});
		});
	});

	describe("creating an answer", function () {
		var success = sinon.spy();

		before(function (done) {
			connection.createAnswer(success);
			expect(success.called, "synchronous").to.be.false;
			process.nextTick(done);
		});

		it("invokes the success callback with the answer", function () {
			expect(success.calledOnce).to.be.true;
			expect(success.calledWith(
				sinon.match.instanceOf(ZombieRTCSessionDescription)
			)).to.be.true;
		});
	});

	describe("creating an offer", function () {
		var success = sinon.spy();

		before(function (done) {
			connection.createOffer(success);
			expect(success.called, "synchronous").to.be.false;
			process.nextTick(done);
		});

		it("invokes the success callback with the offer", function () {
			expect(success.calledOnce).to.be.true;
			expect(success.calledWith(
				sinon.match.instanceOf(ZombieRTCSessionDescription)
			)).to.be.true;
		});
	});

	describe("being closed", function () {
		before(function (done) {
			connection.close();
			process.nextTick(done);
		});

		after(function () {
			connection.iceConnectionState = "new";
		});

		it("sets the connection state to closed", function () {
			expect(connection.iceConnectionState).to.equal("closed");
		});
	});

	describe("setting local description", function () {
		var description = "description";
		var success     = sinon.spy();

		before(function (done) {
			connection.setLocalDescription(description, success);
			expect(success.called, "synchronous").to.be.false;
			process.nextTick(done);
		});

		after(function () {
			delete connection.localDescription;
		});

		it("sets the description", function () {
			expect(connection.localDescription).to.equal(description);
		});

		it("invokes the success callback", function () {
			expect(success.calledOnce).to.be.true;
		});
	});

	describe("setting remote description", function () {
		describe("with an 'onaddstream' handler", function () {
			var description = "description";
			var handler     = sinon.spy();
			var success     = sinon.spy();

			before(function (done) {
				connection.onaddstream = handler;
				connection.setRemoteDescription(description, success);
				expect(success.called, "synchronous callback").to.be.false;
				expect(handler.called, "synchronous handler").to.be.false;
				process.nextTick(done);
			});

			after(function () {
				connection.onaddstream = null;
				delete connection.remoteDescription;
			});

			it("sets the description", function () {
				expect(connection.remoteDescription).to.equal(description);
			});

			it("invokes the success callback", function () {
				expect(success.calledOnce).to.be.true;
			});

			// Need to simulate receiving the remote media stream. Setting the
			// remote description is the closest trigger to when this should happen.
			it("receives a remote media stream", function () {
				expect(handler.calledOnce, "stream event").to.be.true;

				expect(handler.firstCall.args[0], "stream")
				.to.be.an.instanceOf(ZombieMediaStreamEvent)
				.and.to.have.property("stream")
				.that.is.an.instanceOf(ZombieRemoteStream);
			});
		});

		describe("without an 'onaddstream' handler", function () {
			var description = "description";
			var success     = sinon.spy();

			before(function (done) {
				connection.setRemoteDescription(description, success);
				expect(success.called, "synchronous callback").to.be.false;
				process.nextTick(done);
			});

			after(function () {
				delete connection.remoteDescription;
			});

			it("sets the description", function () {
				expect(connection.remoteDescription).to.equal(description);
			});

			it("invokes the success callback", function () {
				expect(success.calledOnce).to.be.true;
			});
		});
	});

	describe("adding an ice candidate", function () {
		describe("with an onicecandidate handler", function () {
			var onicecandidate = sinon.spy();
			var success        = sinon.spy();

			before(function (done) {
				connection.onicecandidate = onicecandidate;
				connection.addIceCandidate("candidate", success);
				expect(success.called, "synchronous callback").to.be.false;
				expect(onicecandidate.called, "synchronous handler").to.be.false;
				process.nextTick(done);
			});

			after(function () {
				delete connection.onicecandidate;
			});

			it("invokes the onicecandidate handler", function () {
				expect(onicecandidate.calledOnce).to.be.true;
				expect(onicecandidate.calledWith(
					sinon.match.instanceOf(ZombiePeerConnectionIceEvent)
				)).to.be.true;
			});

			it("invokes the success callback", function () {
				expect(success.calledOnce).to.be.true;
			});
		});

		describe("without an onicecandidate handler", function () {
			var success = sinon.spy();

			before(function (done) {
				connection.addIceCandidate("candidate", success);
				expect(success.called, "synchronous").to.be.false;
				process.nextTick(done);
			});

			it("invokes the success callback", function () {
				expect(success.calledOnce).to.be.true;
			});
		});
	});

	describe("adding a stream", function () {
		describe("with an onaddstream handler", function () {
			var onaddstream = sinon.spy();

			before(function (done) {
				connection.onaddstream = onaddstream;
				connection.addStream("stream");
				expect(onaddstream.called, "synchronous").to.be.false;
				process.nextTick(done);
			});

			after(function () {
				delete connection.onaddstream;
			});

			// The 'addstream' event refers to receiving a remote stream.
			it("does not invoke the onaddstream handler", function () {
				expect(onaddstream.called).to.be.false;
			});
		});

		describe("without an onaddstream handler", function () {
			it("doesn't explode", function () {
				expect(function () {
					connection.addStream("stream");
				}).to.not.throw(Error);
			});
		});
	});
});
