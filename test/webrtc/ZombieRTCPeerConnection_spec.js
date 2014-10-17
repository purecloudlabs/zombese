"use strict";
var expect                       = require("chai").expect;
var sinon                        = require("sinon");
var ZombieRTCPeerConnection      = require("../../lib/webrtc/ZombieRTCPeerConnection");
var ZombieRTCSessionDescription  = require("../../lib/webrtc/ZombieRTCSessionDescription");
var ZombieMediaStreamEvent       = require("../../lib/webrtc/events/ZombieMediaStreamEvent");
var ZombiePeerConnectionIceEvent = require("../../lib/webrtc/events/ZombiePeerConnectionIceEvent");

describe("A ZombieRTCPeerConnection", function () {
	var connection;

	before(function () {
		connection = new ZombieRTCPeerConnection();
	});

	it("is initially in the 'new' iceconnectionstate", function () {
		expect(connection.iceConnectionState, "wrong state").to.equal("new");
	});

	describe("changing states", function () {
		describe("without an oniceconnectionstatechange handler", function () {
			before(function () {
				connection.iceConnectionState = "connected";
			});

			after(function () {
				connection.iceConnectionState = "new";
			});

			it("changes state without blowing up", function () {
				expect(connection.iceConnectionState).to.equal("connected");
			});
		});

		describe("with an oniceconnectionstatechange handler", function () {
			var oniceconnectionstatechange;

			before(function () {
				oniceconnectionstatechange = sinon.spy();
				connection.oniceconnectionstatechange = oniceconnectionstatechange;
			});

			after(function () {
				delete connection.oniceconnectionstatechange;
			});

			describe("to the same state", function () {
				before(function () {
					connection.iceConnectionState = "new";
				});

				after(function () {
					oniceconnectionstatechange.reset();
				});

				it("doesn't invoke the oniceconnectionstatechange handler", function () {
					expect(oniceconnectionstatechange.called).to.be.false;
				});
			});

			describe("to a new state", function () {
				before(function () {
					connection.iceConnectionState = "connected";
				});

				after(function () {
					connection.iceConnectionState = "new";
					oniceconnectionstatechange.reset();
				});

				it("invokes the oniceconnectionstatechange handler", function () {
					expect(oniceconnectionstatechange.calledOnce).to.be.true;
				});
			});
		});

		describe("to an invalid state", function () {
			var state = "super-invalid-state";
			var error;

			before(function () {
				try {
					connection.iceConnectionState = state;
				}
				catch (e) {
					error = e;
				}
			});

			it("throws an error", function () {
				expect(error).to.be.an.instanceof(Error);
				expect(error.message).to.equal("Invalid connection state: '" + state + "'");
			});
		});
	});

	describe("creating an answer", function () {
		var success = sinon.spy();

		before(function () {
			connection.createAnswer(success);
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

		before(function () {
			connection.createOffer(success);
		});

		it("invokes the success callback with the offer", function () {
			expect(success.calledOnce).to.be.true;
			expect(success.calledWith(
				sinon.match.instanceOf(ZombieRTCSessionDescription)
			)).to.be.true;
		});
	});

	describe("being closed", function () {
		before(function () {
			connection.close();
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
		var success = sinon.spy();

		before(function () {
			connection.setLocalDescription(description, success);
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
		var description = "description";
		var success = sinon.spy();

		before(function () {
			connection.setRemoteDescription(description, success);
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

	describe("adding an ice candidate", function () {
		describe("with an onicecandidate handler", function () {
			var onicecandidate = sinon.spy();
			var success = sinon.spy();

			before(function () {
				connection.onicecandidate = onicecandidate;
				connection.addIceCandidate("candidate", success);
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

			before(function () {
				connection.addIceCandidate("candidate", success);
			});

			it("invokes the success callback", function () {
				expect(success.calledOnce).to.be.true;
			});
		});
	});

	describe("adding a stream", function () {
		describe("with an onaddstream handler", function () {
			var onaddstream            = sinon.spy();

			before(function () {
				connection.onaddstream = onaddstream;
				connection.addStream("stream");
			});

			after(function () {
				delete connection.onaddstream;
			});

			it("invokes the onaddstream handler", function () {
				expect(onaddstream.calledOnce).to.be.true;
				expect(onaddstream.calledWith(
					sinon.match.instanceOf(ZombieMediaStreamEvent)
				)).to.be.true;
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