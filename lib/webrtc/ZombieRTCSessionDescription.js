"use strict";

function ZombieRTCSessionDescription (rtcSessionDescriptionInit) {
	rtcSessionDescriptionInit = rtcSessionDescriptionInit || {};
	this.sdp = rtcSessionDescriptionInit.sdp || "";
	this.type = rtcSessionDescriptionInit.type || "";
}

module.exports = ZombieRTCSessionDescription;
