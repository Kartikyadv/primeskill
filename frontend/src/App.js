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

const App = () => {

  return (
    <SocketProvider>
    <div className="h-screen flex flex-col">
      <Navbar />
      <div className="flex-grow">
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/profile/:userid"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/chats"
            element={
              <ProtectedRoute>
                <Chats />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </div>
    </SocketProvider>
  );
};

export default App;
