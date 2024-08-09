import React, { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import dots from "../../images/dots.png";
import { MdDelete, MdEdit } from "react-icons/md";
import { useDispatch } from "react-redux";
import {
  deleteMessage,
  markMessageSeen,
} from "../../redux/message/messagesThunkReducers";
import { FaRegCopy } from "react-icons/fa";
import { toast } from "react-toastify";
import { RiCheckDoubleFill } from "react-icons/ri";

const Message = ({ otherParticipantid, selectedConversationId, message }) => {
  const loggedinuser = useSelector((store) => store.user.user.userid);
  const [isHovered, setIsHovered] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const optionsRef = useRef(null);
  const dispatch = useDispatch();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (optionsRef.current && !optionsRef.current.contains(event.target)) {
        setShowOptions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (message.recipient === loggedinuser && !message.seen) {
      dispatch(
        markMessageSeen({
          otherParticipantid: otherParticipantid,
          messageid: message._id,
          convoid: selectedConversationId,
        })
      );
    }
  }, [dispatch]);

  const handleDeleteMessage = async () => {
    setShowOptions(false);
    dispatch(
      deleteMessage({
        otherParticipantid: otherParticipantid,
        messageid: message._id,
        convoid: selectedConversationId,
      })
    );
  };

  const handleCopyMessage = () => {
    navigator.clipboard
      .writeText(message.content)
      .then(() => {
        toast("Text copied");
        setShowOptions(false);
      })
      .catch((err) => {
        console.error("Failed to copy text: ", err);
      });
  };

  return (
    <div
      className={`relative flex ${
        message.sender === loggedinuser ? "justify-end" : "justify-start"
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`relative flex w-[50%] ${
          message.sender === loggedinuser ? "justify-end" : "justify-start"
        }`}
      >
        <button
          className={`relative h-5 w-5 ${
            message.sender === loggedinuser ? "block" : "hidden"
          } my-auto ${isHovered ? "block" : "hidden"} `}
          onClick={() => {
            setShowOptions(!showOptions);
          }}
        >
          <img src={dots} alt="Options" />
        </button>
        {showOptions && (
          <div
            ref={optionsRef}
            className="w-24 absolute left-[10%] z-50 -top-10 bg-white shadow-lg border rounded-lg p-2 text-gray-800"
          >
            <ul>
              <li className="hover:bg-gray-100 rounded-lg p-1 font-semibold text-sky-900 cursor-pointer flex justify-between">
                <div>Edit</div>
                <div className="pt-1 pl-1">
                  <MdEdit />
                </div>
              </li>
              <li
                onClick={handleCopyMessage}
                className="hover:bg-gray-100 rounded-lg p-1 font-semibold text-sky-900 cursor-pointer flex justify-between"
              >
                <div>Copy</div>
                <div className="pt-1 pl-1">
                  <FaRegCopy />
                </div>
              </li>
              <li
                className="hover:bg-gray-100 rounded-lg p-1 font-semibold text-red-600 cursor-pointer flex justify-between"
                onClick={handleDeleteMessage}
              >
                <div>Delete</div>
                <div className="pt-1 pl-1">
                  <MdDelete />
                </div>
              </li>
            </ul>
          </div>
        )}
        <div
          className={`${
            message.sender === loggedinuser
              ? "bg-slate-600/80 text-white"
              : "bg-white text-gray-800"
          } max-w-[80%] flex flex-wrap items-center px-4 py-2 rounded-lg m-1 overflow-hidden break-words shadow-lg`}
        >
          <div className="flex-1 min-w-0">{message.content}</div>
          {message.sender === loggedinuser && (
            <div className={`ml-1 ${message.seen ? "text-blue-400" : ""}`}>
              <RiCheckDoubleFill />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Message;
