import React, { useEffect, useState } from "react";
import dummyuser from "../../images/dummyuser.jpg";
import { useDispatch, useSelector } from "react-redux";
import axiosInstance from "../../config/axiosConfig";
import { BACKENDURL } from "../../config/data";
import { getOtherUserName } from "../../utils/controllers";
import { useSocketContext } from "../../context/SocketProvider";

const Conversation = ({ conversation, selectedConversationId, onConversationSelect }) => {
  const currentuserid = useSelector((store) => store.user.user.userid);
  const dispatch = useDispatch();
  const [lastMessage, setLastMessage] = useState(null);
  const [otherParticipant, setotherParticipant] = useState(null);
  const {onlineUsers}  = useSocketContext();
  const [isOnline,setisOnline] = useState(false);

  useEffect(()=>{
    const otherparticipant = getOtherUserName(currentuserid,conversation?.participants);
    setotherParticipant(otherparticipant)
    setisOnline(onlineUsers.includes(otherparticipant?._id))
  },[dispatch,onlineUsers]);
  
  useEffect(() => {
    const fetchLastMessage = async () => {
      const res = await axiosInstance.get(
        `${BACKENDURL}api/message/singlemessage/${conversation?.lastMessageId}`
      );
      setLastMessage(res?.data?.message?.content);
    };
    if (conversation?.lastMessageId) fetchLastMessage();
  }, [conversation,selectedConversationId]);

  return (
    <div
      onClick={() => onConversationSelect(conversation?._id)}
      className={`flex items-center py-4 md:p-4 hover:bg-gray-200 rounded-lg cursor-pointer select-none transition-all duration-200 ease-in-out ${
        selectedConversationId === conversation?._id ? "bg-gray-200 shadow-lg scale-95 text-gray-900" : ""
      }`}
    >
      <div className="relative ">
      <img src={dummyuser} alt="User" className="w-12 h-12 rounded-full md:mr-4 border-2 border-gray-300" />

      <div className="absolute right-0 -bottom-1">{isOnline? "🟢": ""}</div>
      </div>
      <div className="hidden md:block w-full pl-4">
        <div className="font-semibold ">{otherParticipant?.name}</div>
        <div className="text-sm  truncate">{lastMessage?.slice(0,10)}{lastMessage?.length>10 ? "...": null}</div>
      </div>
    </div>
  );
};

export default Conversation;
