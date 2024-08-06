import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Conversation from "./Conversation";
import {
  createConversation,
  fetchConversations,
} from "../../redux/conversation/conversationThunkReducers";
import axiosInstance from "../../config/axiosConfig";
import { BACKENDURL } from "../../config/data";
import dummyuser from "../../images/dummyuser.jpg";

const ConversationList = ({ onConversationSelect, selectedConversationId }) => {
  const dispatch = useDispatch();
  const conversations = useSelector(
    (state) => state.conversations.conversations
  );
  const [searchUser, setSearchUser] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [debounceTimeout, setDebounceTimeout] = useState(null);

  useEffect(() => {
    dispatch(fetchConversations());
  }, [dispatch,selectedConversationId]);

  const handleSearch = async (query) => {
    if (query) {
      try {
        const response = await axiosInstance.get(
          `${BACKENDURL}api/user/search?query=${query}`
        );
        setSearchResults(response.data);
      } catch (error) {
        console.error("Error searching users", error);
      }
    } else {
      setSearchResults([]);
    }
  };

  const handleInputChange = (e) => {
    const query = e.target.value;
    setSearchUser(query);
    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }
    
    setDebounceTimeout(setTimeout(() => {
      handleSearch(query);
    }, 300));
  };

  const handleCreateConversation = async (userId) => {
    const response = await dispatch(createConversation(userId));
    onConversationSelect(response.payload._id)
    setSearchResults([]);
    setSearchUser("");
  };

  return (
    <div className="w-20 md:w-[30%] p-1 md:p-4 h-[100%] overflow-y-auto">
      <div className="mb-5 md:ml-[10%] text-xl font-semibold hidden md:block">
        Messages
      </div>
      <div className="mb-4 relative">
        <input
          type="text"
          value={searchUser}
          onChange={handleInputChange}
          className="w-full p-2 border backdrop-blur-3xl bg-white/40 text-black border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
          placeholder="Search users..."
        />
        {searchResults.length > 0 && (
          <div className="absolute w-full mt-2 border border-gray-300 rounded bg-white shadow-lg z-10">
            {searchResults.map((user) => (
              <div
                key={user._id}
                className="flex items-center p-2 hover:bg-gray-100 cursor-pointer transition-all duration-200"
                onClick={() => handleCreateConversation(user._id)}
              >
                <img
                  src={dummyuser}
                  alt="User"
                  className="w-10 h-10 rounded-full mr-3 border-2 border-gray-300 transition-transform duration-300 ease-in-out transform hover:rotate-6 hover:scale-110"
                />
                <div className="text-gray-900">{user.name}</div>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="space-y-2">
        {conversations.map((conversation, idx) => (
          <Conversation
            key={idx}
            conversation={conversation}
            selectedConversationId={selectedConversationId}
            onConversationSelect={onConversationSelect}
          />
        ))}
      </div>
    </div>
  );
};

export default ConversationList;
