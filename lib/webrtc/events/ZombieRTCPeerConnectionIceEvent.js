"use strict";

function ZombieRTCPeerConnectionIceEvent (candidate) {
	this.candidate = candidate || null;
}

module.exports = ZombieRTCPeerConnectionIceEvent;
