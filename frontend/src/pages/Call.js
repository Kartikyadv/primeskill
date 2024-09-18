import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useSocketContext } from "../context/SocketProvider";
import { useDispatch } from "react-redux";
import { receiveCall } from "../redux/call/callSlice";

const VideoCall = () => {
  const { otherParticipantId } = useParams();
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const { socket } = useSocketContext();
  const [peerConnection, setPeerConnection] = useState(null);
  // const [offeraccepted, setofferaccepted] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    const pc = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });
    console.log(pc)
    setPeerConnection(pc);

    const handleIceCandidate = (event) => {
      console.log("sending ice candidate");

      if (event?.candidate) {
        socket.emit("ice-candidate", {
          candidate: event?.candidate,
          to: otherParticipantId,
        });
      }
    };

    const handleTrackEvent = (event) => {
      console.log("recieving remote video");
      remoteVideoRef.current.srcObject = event?.streams[0];
    };

    pc.addEventListener("icecandidate", handleIceCandidate);
    pc.addEventListener("track", handleTrackEvent);

    const handleOffer = async (data) => {
      console.log("recived offer");
      console.log(data.caller)
      dispatch(receiveCall(data?.caller));
      if (data?.from === otherParticipantId) {
        await pc.setRemoteDescription(new RTCSessionDescription(data?.offer));
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        console.log("sending answer");
        socket.emit("answer", {
          answer,
          to: otherParticipantId,
        });
        // setofferaccepted(true)
      }
    };

    const handleAnswer = async (data) => {
      console.log("recieved answer");
      if (data?.from === otherParticipantId) {
        await pc.setRemoteDescription(new RTCSessionDescription(data?.answer));
      }
    };

    const handleIceCandidateReceived = async (data) => {
      console.log("recieved ice candidate");
      console.log(data);
      // console.log(offeraccepted)
      // if(offeraccepted){
      if (data?.from === otherParticipantId) {
        try {
          await pc.addIceCandidate(new RTCIceCandidate(data?.candidate));
        } catch (error) {
          console.error("Error adding received ice candidate", error);
        }
      }
      // }
    };

    if (socket) {
      socket.on("offer", handleOffer);
      socket.on("answer", handleAnswer);
      socket.on("ice-candidate", handleIceCandidateReceived);
    }

    return () => {
      pc.close();
      setPeerConnection(null);
      if (socket) {
        socket.off("offer", handleOffer);
        socket.off("answer", handleAnswer);
        socket.off("ice-candidate", handleIceCandidateReceived);
      }
    };
  }, [socket, otherParticipantId]);

  useEffect(() => {
    const getLocalStream = async () => {
      try {
        const localStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        localVideoRef.current.srcObject = localStream;

        localStream.getTracks().forEach((track) => {
          if (peerConnection && peerConnection.signalingState !== "closed") {
            peerConnection.addTrack(track, localStream);
          }
        });
      } catch (error) {
        console.error("Error accessing media devices.", error);
      }
    };

    if (peerConnection) {
      getLocalStream();
    }

    return () => {
      if (localVideoRef.current && localVideoRef.current.srcObject) {
        localVideoRef.current.srcObject
          .getTracks()
          .forEach((track) => track.stop());
      }
    };
  }, [peerConnection]);

  const startCall = async () => {
    console.log("sending offer");
    if (peerConnection && socket) {
      const offer = await peerConnection.createOffer();
      await peerConnection.setLocalDescription(offer);
      socket.emit("offer", {
        offer: offer,
        to: otherParticipantId,
      });

      // setofferaccepted(true)
    }
  };

  const endCall = () => {
    if (peerConnection) {
      peerConnection.close();
      setPeerConnection(null);
    }

    if (localVideoRef.current && localVideoRef.current.srcObject) {
      localVideoRef.current.srcObject
        .getTracks()
        .forEach((track) => track.stop());
      localVideoRef.current.srcObject = null;
    }

    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = null;
    }

    if (socket) {
      socket.emit("end-call", {
        to: otherParticipantId,
      });
    }
  };

  return (
    <div className="pt-24 bg-black/95 h-screen flex flex-col">
      <div className="relative flex-grow rounded-lg h-[90%]">
        <div className="relative h-[90%]">
          <video
            ref={remoteVideoRef}
            className="w-full h-[90%] bg-red-300"
            autoPlay
          ></video>
          <div className="absolute inset-0 flex items-end justify-end md:p-4 mr-8 md:mr-20">
            <video
              ref={localVideoRef}
              className="h-36 w-32 md:w-44 md:h-44 md:rounded-full md:object-cover"
              autoPlay
              muted
            ></video>
          </div>
        </div>
        <div className="flex w-full justify-center">
          <div className="flex w-72 justify-between">
            <button
              className="bg-blue-600 text-white py-2 px-6 rounded-full hover:bg-blue-700 focus:ring-2 focus:ring-blue-500"
              type="button"
              onClick={startCall}
            >
              Start Call
            </button>
            <button
              className="bg-red-600 text-white py-2 px-6 rounded-full hover:bg-red-700 focus:ring-2 focus:ring-red-500"
              type="button"
              onClick={endCall}
            >
              End Call
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoCall;