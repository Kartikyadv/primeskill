import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSocketContext } from '../context/SocketProvider';

const VideoCall = () => {
  const { otherParticipantId } = useParams(); // Get the other participant's ID from the URL params
  const localVideoRef = useRef(null); // Reference to the local video element
  const remoteVideoRef = useRef(null); // Reference to the remote video element
  const { socket } = useSocketContext(); // Get the socket instance from context
  const [peerConnection, setPeerConnection] = useState(null); // State to manage the RTCPeerConnection

  useEffect(() => {
    // Create a new RTCPeerConnection instance with ICE servers
    const pc = new RTCPeerConnection({
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        // You can add TURN servers here for better connectivity
      ],
    });

    setPeerConnection(pc); // Set the RTCPeerConnection instance in state

    // Handle ICE candidates and send them to the other participant
    const handleIceCandidate = (event) => {
      if (event.candidate) {
        socket.emit('ice-candidate', {
          candidate: event.candidate,
          to: otherParticipantId,
        });
      }
    };

    // Handle the track event and set the remote video stream
    const handleTrackEvent = (event) => {
      remoteVideoRef.current.srcObject = event.streams[0];
    };

    // Add event listeners for ICE candidates and track events
    pc.addEventListener('icecandidate', handleIceCandidate);
    pc.addEventListener('track', handleTrackEvent);

    // Socket event handler for receiving an offer from the other participant
    const handleOffer = async (data) => {
      if (data.from === otherParticipantId) {
        await pc.setRemoteDescription(new RTCSessionDescription(data.offer)); // Set the remote offer description
        const answer = await pc.createAnswer(); // Create an answer
        await pc.setLocalDescription(answer); // Set the local answer description
        socket.emit('answer', {
          answer,
          to: otherParticipantId,
        }); // Send the answer to the other participant
      }
    };

    // Socket event handler for receiving an answer from the other participant
    const handleAnswer = async (data) => {
      if (data.from === otherParticipantId) {
        await pc.setRemoteDescription(new RTCSessionDescription(data.answer)); // Set the remote answer description
      }
    };

    // // Socket event handler for receiving ICE candidates from the other participant
    const handleIceCandidateReceived = async (data) => {
      if (data.from === otherParticipantId) {
        try {
          await pc.addIceCandidate(new RTCIceCandidate(data.candidate)); // Add the received ICE candidate
        } catch (error) {
          console.error('Error adding received ice candidate', error);
        }
      }
    };

    // Register socket event handlers
    if (socket) {
      socket.on('offer', handleOffer);
      socket.on('answer', handleAnswer);
      socket.on('ice-candidate', handleIceCandidateReceived);
    }

    // Clean up on component unmount
    return () => {
      pc.close(); // Close the RTCPeerConnection
      setPeerConnection(null); // Clear the peer connection state
      if (socket) {
        socket.off('offer', handleOffer);
        socket.off('answer', handleAnswer);
        socket.off('ice-candidate', handleIceCandidateReceived);
      }
    };
  }, [socket, otherParticipantId]); // Re-run effect if socket or otherParticipantId changes

  useEffect(() => {
    // Function to get local media stream and add tracks to the peer connection
    const getLocalStream = async () => {
      try {
        const localStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        localVideoRef.current.srcObject = localStream; // Set the local video stream

        localStream.getTracks().forEach((track) => {
          if (peerConnection && peerConnection.signalingState !== 'closed') {
            peerConnection.addTrack(track, localStream); // Add each track to the peer connection
          }
        });
      } catch (error) {
        console.error('Error accessing media devices.', error);
      }
    };

    if (peerConnection) {
      getLocalStream(); // Get local media stream if peer connection is available
    }

    // Clean up on component unmount
    return () => {
      if (localVideoRef.current && localVideoRef.current.srcObject) {
        localVideoRef.current.srcObject.getTracks().forEach((track) => track.stop()); // Stop all tracks
      }
    };
  }, [peerConnection]); // Re-run effect if peerConnection changes

  // Function to start the call by creating and sending an offer
  const startCall = async () => {
    if (peerConnection && socket) {
      const offer = await peerConnection.createOffer(); // Create an offer
      await peerConnection.setLocalDescription(offer); // Set the local offer description
      socket.emit('offer', {
        offer: offer,
        to: otherParticipantId,
      }); // Send the offer to the other participant
    }
  };
  
  // Function to end the call
  const endCall = () => {
    if (peerConnection) {
      peerConnection.close(); // Close the peer connection
      setPeerConnection(null); // Reset the peer connection state
    }

    if (localVideoRef.current && localVideoRef.current.srcObject) {
      localVideoRef.current.srcObject.getTracks().forEach((track) => track.stop()); // Stop all local tracks
      localVideoRef.current.srcObject = null; // Clear the local video element
    }

    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = null; // Clear the remote video element
    }

    if (socket) {
      socket.emit('end-call', {
        to: otherParticipantId,
      }); // Notify the other participant to end the call
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
              onClick={startCall} // Start call on button click
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
