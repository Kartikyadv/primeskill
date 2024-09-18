// src/components/call/CallNotification.js
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { IoCall } from "react-icons/io5";
import { MdCallEnd } from "react-icons/md";
import { acceptCall, rejectCall } from "../../redux/call/callSlice";

const CallNotification = () => {
  const dispatch = useDispatch();
  const callIncoming = useSelector((store) => store.call.callIncoming);
  const caller = useSelector((store) => store.call.caller);

  if (!callIncoming) return null;

  const handleAccept = () => {
    dispatch(acceptCall());
  };
  
  const handleReject = () => {
    dispatch(rejectCall());
  };

  return (
    <div className="fixed top-4 right-4 z-50 bg-white border border-gray-200 shadow-lg rounded-lg p-4 w-80 flex items-center space-x-4">
      <div className="text-white">
        <img className="h-12 w-12 rounded-full" src={caller?.avatar || "/default-avatar.png"} alt="Caller" />
      </div>

      <div className="flex-1">
        <p className="text-lg font-semibold text-gray-900">Incoming Call</p>
        <p className="text-gray-500">{caller?.name || "Unknown"}</p>
      </div>

      <div className="flex space-x-2">
        <button className="bg-green-500 text-white rounded-full p-2 hover:bg-green-600 focus:outline-none" onClick={handleAccept}>
          <IoCall className="h-5 w-5" />
        </button>
        <button className="bg-red-500 text-white rounded-full p-2 hover:bg-red-600 focus:outline-none" onClick={handleReject}>
          <MdCallEnd className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default CallNotification;
