import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchMessages,
  sendMessage,
} from "../../redux/message/messagesThunkReducers";
import MessageHeader from "./MessageHeader";
import { useSocketContext } from "../../context/SocketProvider";
import {
  addMessage,
  removeMessage,
  updateMessage,
} from "../../redux/message/messageSlice";
import {
  updatedConversation,
  updatedConversationOnMessageDelete,
} from "../../redux/conversation/conversationSlice";
import Message from "./Message";
import axiosInstance from "../../config/axiosConfig";
import { getOtherUserName } from "../../utils/controllers";
import { BACKENDURL } from "../../config/data";
import typing from "../../images/usertyping.png";

const MessageContainer = ({ selectedConversationId }) => {
  const {socket} = useSocketContext();
  const loggedinuser = useSelector((store) => store.user.user.userid);
  const messages = useSelector((state) => state.messages.messages);
  const [newMessage, setNewMessage] = useState("");
  const [otherParticipant, setotherParticipant] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const dispatch = useDispatch();
  const messagesEndRef = useRef(null);
  let typingTimeout = useRef(null);

  useEffect(() => {
    const fetchConversation = async (selectedConversationId) => {
      const response = await axiosInstance.get(
        `${BACKENDURL}api/chat/${selectedConversationId}`
      );
      if (response?.data?.conversation) {
        const otherparticipant = getOtherUserName(
          loggedinuser,
          response?.data?.conversation?.participants
        );
        setotherParticipant(otherparticipant);
      }
    };
    if (selectedConversationId) {
      fetchConversation(selectedConversationId);
    }
  }, [selectedConversationId]);

  useEffect(() => {
    if (selectedConversationId) dispatch(fetchMessages(selectedConversationId));
  }, [selectedConversationId, dispatch]);

  // recieve message
  useEffect(() => {
    if (socket) {
      socket.on("message", (messageData) => {
        dispatch(
          updatedConversation({
            conversationId: messageData.conversationId,
            messageId: messageData?.message._id,
          })
        );
        if (messageData.conversationId === selectedConversationId) {
          dispatch(addMessage(messageData?.message));
        }
      });

      return () => {
        socket.off("message");
      };
    }
  }, [socket, selectedConversationId, dispatch]);

  // seen message
  useEffect(() => {
    if (socket) {
      socket.on("seenmessage", (messageData) => {
        if (messageData?.conversationId === selectedConversationId) {
          dispatch(updateMessage({ messagetobeUpdated: messageData?.message }));
        }
      });

      return () => {
        socket.off("seenmessage");
      };
    }
  }, [socket, selectedConversationId, dispatch]);

  // delete message
  useEffect(() => {
    if (socket) {
      socket.on("deletemessage", (messageData) => {
        dispatch(
          updatedConversationOnMessageDelete({
            updatedconversation: messageData?.conversation,
          })
        );
        if (messageData?.conversation?._id === selectedConversationId) {
          dispatch(removeMessage({ messagetobedeleted: messageData?.message }));
        }
      });

      return () => {
        socket.off("deletemessage");
      };
    }
  }, [socket, selectedConversationId, dispatch]);

  // typing req
  useEffect(() => {
    if (socket) {
      socket.on("typing", ({ userId }) => {
        if (userId === otherParticipant?._id) {
          setIsTyping(true);
        }
      });

      socket.on("stop typing", ({ userId }) => {
        if (userId === otherParticipant?._id) {
          setIsTyping(false);
        }
      });

      return () => {
        socket.off("typing");
        socket.off("stop typing");
      };
    }
  }, [socket, otherParticipant]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      dispatch(sendMessage({ selectedConversationId, newMessage }));
      setNewMessage("");
      socket.emit("stop typing", {
        conversationId: selectedConversationId,
        userId: loggedinuser,
      });
    }
  };

  // sending typing res
  const handleTyping = (e) => {
    setNewMessage(e.target.value);
    if (typingTimeout.current) {
      clearTimeout(typingTimeout.current);
    }

    socket.emit("typing", {
      userId: loggedinuser,
      otherParticipantid: otherParticipant?._id,
    });

    typingTimeout.current = setTimeout(() => {
      socket.emit("stop typing", {
        userId: loggedinuser,
        otherParticipantid: otherParticipant?._id,
      });
    }, 2000);
  };

  return (
    <div className="relative flex flex-col h-[100%] w-[90%] md:w-[70%] bg-white/20 rounded-r-lg shadow-lg">
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold">
          {selectedConversationId ? (
            <MessageHeader
              selectedConversationId={selectedConversationId}
              otherParticipantname={otherParticipant?.name}
            />
          ) : (
            "Select a conversation to send a message"
          )}
        </h3>
      </div>
      <div className=" flex-1 overflow-y-auto">
        {selectedConversationId ? (
          <>
            <div className="px-4">
              {messages.map((message, idx) => (
                <div ref={messagesEndRef} key={idx}>
                  <Message
                    otherParticipantid={otherParticipant?._id}
                    selectedConversationId={selectedConversationId}
                    message={message}
                  />
                </div>
              ))}

              <div className={`absolute z-0 bottom-16 h-20 w-20 ${isTyping ? 'pop-up-down-in' : 'pop-up-down-out'}`}>
              <img src={typing} alt="Typing..." />
            </div>
            </div>
          </>
        ) : (
          <div className="text-center text-gray-500 mt-4">
            No conversation selected.
          </div>
        )}
      </div>
      <div className="z-50 bg-gray-100">
      {selectedConversationId && (
        <form
          className="flex items-center justify-between p-2 border-t border-gray-200"
          onSubmit={handleSendMessage}
        >
          <input
            type="text"
            value={newMessage}
            onChange={handleTyping}
            placeholder="Type a message..."
            className="flex-1 rounded-full border-gray-300 p-2 mr-4 focus:outline-none focus:ring focus:ring-blue-300 text-black"
          />
          <button
            type="submit"
            className="bg-slate-800/70 text-white rounded-full px-6 py-2 font-semibold focus:outline-none focus:ring focus:ring-blue-300"
          >
            Send
          </button>
        </form>
      )}
      </div>
    </div>
  );
};

export default MessageContainer;
