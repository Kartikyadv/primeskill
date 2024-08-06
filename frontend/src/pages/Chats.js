import React, { useState } from "react";
import ConversationList from "../components/chats/ConversationList.js";
import MessageContainer from "../components/chats/MessageContainer.js";

const Chats = () => {
  const [selectedConversationId, setSelectedConversationId] = useState(null);

  const handleConversationSelect = (conversationId) => {
    setSelectedConversationId(conversationId);
  };
  return (
    <div className="pt-[82px] h-[100vh] bg-custom2">
      <div className=" flex  h-[95%] md:w-[80%] md:mx-auto  backdrop-blur-3xl bg-white/40 shadow-2xl rounded-lg ">
        <ConversationList
          onConversationSelect={handleConversationSelect}
          selectedConversationId={selectedConversationId}
        />
        <MessageContainer selectedConversationId={selectedConversationId} />
      </div>
    </div>
  );
};

export default Chats;
