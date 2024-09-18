// import React, { createContext, useContext } from 'react';
// import { useWebRTC } from './useWebRTC';

// const WebRTCContext = createContext();


// export const WebRTCProvider = ({ children }) => {
//   const { localStream,
//     remoteStream,
//     isCalling,
//     isReceivingCall,
//     startCall,
//     answerCall,
//     startLocalStream } = useWebRTC();
//   return (
//     <WebRTCContext.Provider value={{ localStream,
//         remoteStream,
//         isCalling,
//         isReceivingCall,
//         startCall,
//         answerCall,
//         startLocalStream }}>
//       {children}
//     </WebRTCContext.Provider>
//   );
// };

// export const useWebRTCContext = () => {
//   return useContext(WebRTCContext);
// };
