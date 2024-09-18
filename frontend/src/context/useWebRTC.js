// import React, { createContext, useContext, useEffect, useRef, useState } from "react";
// import { useSocketContext } from "./SocketProvider"; // Ensure this is correctly imported
// import { useDispatch, useSelector } from "react-redux";
// import { receiveCall } from "../redux/call/callSlice";

// export const useWebRTC = () => {
//     const [localStream, setLocalStream] = useState(null);
//     const [remoteStream, setRemoteStream] = useState(null);
//     const [isCalling, setIsCalling] = useState(false);
//     const [isReceivingCall, setIsReceivingCall] = useState(false);
//     const [caller, setCaller] = useState(null);
  
//     const peerConnection = useRef(null);
//     const { socket } = useSocketContext();
  
//     useEffect(() => {
  
//       socket.on('call-made', async (data) => {
//         setIsReceivingCall(true);
//         setCaller(data);
//       });
  
//       socket.on('answer-made', async (data) => {
//         await peerConnection.current.setRemoteDescription(
//           new RTCSessionDescription(data.answer)
//         );
//       });
  
//       socket.on('ice-candidate', (data) => {
//         peerConnection.current.addIceCandidate(new RTCIceCandidate(data.candidate));
//       });
  
//       return () => {
//         socket.disconnect();
//       };
//     }, []);
  
//     const createPeerConnection = () => {
//       const pc = new RTCPeerConnection({
//         iceServers: [
//           {
//             urls: 'stun:stun.l.google.com:19302',
//           },
//         ],
//       });
  
//       pc.onicecandidate = (event) => {
//         if (event.candidate) {
//           socket.emit('ice-candidate', {
//             candidate: event.candidate,
//           });
//         }
//       };
  
//       pc.ontrack = (event) => {
//         setRemoteStream(event.streams[0]);
//       };
  
//       return pc;
//     };
  
//     const startCall = async () => {
//       setIsCalling(true);
//       peerConnection.current = createPeerConnection();
  
//       localStream.getTracks().forEach((track) => {
//         peerConnection.current.addTrack(track, localStream);
//       });
  
//       const offer = await peerConnection.current.createOffer();
//       await peerConnection.current.setLocalDescription(new RTCSessionDescription(offer));
  
//       socket.emit('call-user', {
//         offer,
//       });
//     };
  
//     const answerCall = async () => {
//       setIsReceivingCall(false);
//       peerConnection.current = createPeerConnection();
  
//       localStream.getTracks().forEach((track) => {
//         peerConnection.current.addTrack(track, localStream);
//       });
  
//       await peerConnection.current.setRemoteDescription(
//         new RTCSessionDescription(caller.offer)
//       );
  
//       const answer = await peerConnection.current.createAnswer();
//       await peerConnection.current.setLocalDescription(new RTCSessionDescription(answer));
  
//       socket.emit('make-answer', {
//         answer,
//         to: caller.from,
//       });
//     };
  
//     const startLocalStream = async () => {
//       const stream = await navigator.mediaDevices.getUserMedia({
//         video: true,
//         audio: true,
//       });
//       setLocalStream(stream);
//     };

//   return { localStream,
//     remoteStream,
//     isCalling,
//     isReceivingCall,
//     startCall,
//     answerCall,
//     startLocalStream };
// };
