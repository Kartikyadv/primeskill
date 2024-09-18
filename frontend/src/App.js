import React, { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home.js";
import Profile from "./pages/Profile";
import Signup from "./pages/Signup.js";
import Login from "./pages/Login.js";
import ProtectedRoute from "./utils/ProtectedRoute.js";
import Chats from "./pages/Chats.js";
import { SocketProvider } from "./context/SocketProvider.js";
import Call from "./pages/Call.js";
import CallNotification from "./components/call/CallNotification.js";
import { WebRTCProvider } from "./context/WebRTCProvider.js";

const App = () => {

  return (
    <SocketProvider>
      {/* <WebRTCProvider> */}
    <div className="h-screen flex flex-col">
      <Navbar />
      <CallNotification/>
      <div className="flex-grow">
    <Routes>
      <Route path="/" element={ <ProtectedRoute> <Home /> </ProtectedRoute>}/>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/profile/:userid" element={ <ProtectedRoute> <Profile /> </ProtectedRoute> }/>
      <Route path="/chats" element={<ProtectedRoute> <Chats /> </ProtectedRoute> }/>
      <Route path="/call/:otherParticipantId" element={<ProtectedRoute> <Call /> </ProtectedRoute>}/>
    </Routes>
      </div>
    </div>
    {/* </WebRTCProvider> */}
    </SocketProvider>
  );
};

export default App;
