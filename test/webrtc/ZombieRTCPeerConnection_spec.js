"use strict";
var Sinon                           = require("sinon");
var ZombieMediaStreamEvent          = require("../../lib/webrtc/events/ZombieMediaStreamEvent");
var ZombieRemoteStream              = require("../../lib/webrtc/streams/ZombieRemoteStream");
var ZombieRTCPeerConnection         = require("../../lib/webrtc/ZombieRTCPeerConnection");
var ZombieRTCPeerConnectionIceEvent = require("../../lib/webrtc/events/ZombieRTCPeerConnectionIceEvent");
var ZombieRTCSessionDescription     = require("../../lib/webrtc/ZombieRTCSessionDescription");

var expect = require("chai").expect;

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
					connection.oniceconnectionstatechange = handler = Sinon.spy();
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
					connection.oniceconnectionstatechange = handler = Sinon.spy();
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
				connection.oniceconnectionstatechange = handler = Sinon.spy();

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
		var success = Sinon.spy();

		before(function (done) {
			connection.createAnswer(success);
			expect(success.called, "synchronous").to.be.false;
			process.nextTick(done);
		});

		it("invokes the success callback with the answer", function () {
			expect(success.calledOnce).to.be.true;
			expect(success.calledWith(
				Sinon.match.instanceOf(ZombieRTCSessionDescription)
			)).to.be.true;
		});
	});

	describe("creating an offer", function () {
		describe("with an ICE candidate handler", function () {
			var ice     = Sinon.spy();
			var success = Sinon.spy();

			before(function (done) {
				connection.onicecandidate = ice;
				connection.createOffer(success);
				expect(success.called, "synchronous").to.be.false;
				process.nextTick(done);
			});

			after(function () {
				delete connection.onicecandidate;
			});

			it("invokes the success callback with the offer", function () {
				expect(success.calledOnce).to.be.true;
				expect(success.calledWith(
					Sinon.match.instanceOf(ZombieRTCSessionDescription)
				)).to.be.true;
			});

			it("signals when ICE gathering has completed", function () {
				expect(ice.called, "ICE event").to.be.true;
				expect(ice.firstCall.args[0], "ICE candidate")
				.to.be.an.instanceOf(ZombieRTCPeerConnectionIceEvent)
				.and.to.have.property("candidate").that.is.null;

				Sinon.assert.callOrder(success, ice);
			});
		});

		describe("without an ICE candidate handler", function () {
			var success = Sinon.spy();

			before(function (done) {
				connection.createOffer(success);
				expect(success.called, "synchronous").to.be.false;
				process.nextTick(done);
			});

			it("invokes the success callback with the offer", function () {
				expect(success.calledOnce).to.be.true;
				expect(success.calledWith(
					Sinon.match.instanceOf(ZombieRTCSessionDescription)
				)).to.be.true;
			});
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
		var success     = Sinon.spy();

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
			var connection  = new ZombieRTCPeerConnection();
			var description = "description";
			var handler     = Sinon.spy();
			var success     = Sinon.spy();
			var result      = null;

			before(function (done) {
				connection.onaddstream = handler;
				result = connection.setRemoteDescription(description, success);
				expect(success.called, "synchronous callback").to.be.false;
				expect(handler.called, "synchronous handler").to.be.false;
				process.nextTick(done);
			});

			it("sets the description", function () {
				expect(connection.remoteDescription).to.equal(description);
			});

			it("returns a Promise that resolves", function () {
				return result
					.then(function () {
						// This is hear to make sure a 'thenable' is returned
						return;
					});
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

			it("saves a reference to the media stream", function () {
				expect(connection.getRemoteStreams()).to.deep.equal([ handler.firstCall.args[0].stream ]);
			});
		});

		describe("without an 'onaddstream' handler", function () {
			var connection  = new ZombieRTCPeerConnection();
			var description = "description";
			var success     = Sinon.spy();
			var result      = null;

			before(function (done) {
				result = connection.setRemoteDescription(description, success);
				expect(success.called, "synchronous callback").to.be.false;
				process.nextTick(done);
			});

			after(function () {
				delete connection.remoteDescription;
			});

			it("sets the description", function () {
				expect(connection.remoteDescription).to.equal(description);
			});

			it("returns a Promise that resolves", function () {
				return result
					.then(function () {
						// This is hear to make sure a 'thenable' is returned
						return;
					});
			});

			it("invokes the success callback", function () {
				expect(success.calledOnce).to.be.true;
			});

			it("receives at least on media stream", function () {
				expect(connection.getRemoteStreams()).to.have.length.greaterThan(0);
				expect(connection.getRemoteStreams()[0]).to.be.an.instanceOf(ZombieRemoteStream);
			});
		});

		describe("without a success callback", function () {
			var connection  = new ZombieRTCPeerConnection();
			var description = "description";
			var result      = null;

			before(function () {
				result = connection.setRemoteDescription(description);
			});

			after(function () {
				delete connection.remoteDescription;
			});

			it("sets the description", function () {
				expect(connection.remoteDescription).to.equal(description);
			});

			it("returns a Promise that resolves", function () {
				return result
					.then(function () {
						// This is hear to make sure a 'thenable' is returned
						return;
					});
			});
		});
	});

	describe("adding an ice candidate", function () {
		var success = Sinon.spy();

		before(function (done) {
			connection.onicecandidate = Sinon.spy();
			connection.addIceCandidate("candidate", success);
			expect(success.called, "synchronous").to.be.false;
			process.nextTick(done);
		});

		after(function () {
			delete connection.onicecandidate;
		});

		it("invokes the success callback", function () {
			expect(success.calledOnce).to.be.true;
		});

		// 'onicecandidate' is for receiving local candidates while 'addIceCandidate'
		// is for processing remote candidates.
		it("does not invoke the 'onicecandidate' handler", function () {
			expect(connection.onicecandidate.called).to.be.false;
		});
	});

	describe("adding a stream", function () {
		describe("with an onaddstream handler", function () {
			var onaddstream = Sinon.spy();

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

  describe("listing local streams", function () {
    it("should default to an empty list", function () {
		  var newConnection = new ZombieRTCPeerConnection();
      expect(newConnection.getLocalStreams()).to.deep.equal([]);
    });
    
    it("should include streams added with addStream", function () {
		  var newConnection = new ZombieRTCPeerConnection();
      newConnection.addStream("stream");
      expect(newConnection.getLocalStreams()).to.deep.equal(["stream"]);
    });
  });
});
