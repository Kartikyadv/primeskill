import React, { useEffect, useRef, useState } from "react";
import dots from "../../images/dots.png";
import { useDispatch } from "react-redux";
import { deleteConversation } from "../../redux/conversation/conversationThunkReducers";
import { MdDelete } from "react-icons/md";
import { FaShare } from "react-icons/fa";
import { CiVideoOn } from "react-icons/ci";
import { useNavigate } from "react-router-dom";

const MessageHeader = ({ selectedConversationId, otherParticipant }) => {
  const convoid = selectedConversationId;
  const [showOptions, setShowOptions] = useState(false);
  const dispatch = useDispatch();
  const optionsRef = useRef(null);
  const navigate = useNavigate();

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

  const toggleOptions = () => {
    setShowOptions(!showOptions);
  };

  const handleDeleteConversation = () => {
    dispatch(deleteConversation(convoid));
  };
  const handleNavigateToCall = () => {
    navigate("/call/"+otherParticipant?._id);
  };

  return (
    <div className="flex justify-between ">
      <div className="">{otherParticipant?.name}</div>
      <div className="flex">
        <div className="mx-3 cursor-pointer" onClick={handleNavigateToCall}>
          <CiVideoOn className="h-7 w-7"></CiVideoOn>
        </div>
        <button className="relative" onClick={toggleOptions}>
          <img className="w-5 h-5 rounded-full" src={dots} alt="edit option" />
          <div className="absolute right-0 w-32 z-50">
            {showOptions && (
              <div ref={optionsRef} className="bg-white shadow-md rounded-lg p-2 text-gray-800 mt-2 ">
                <ul>
                  <li className="hover:bg-gray-100 rounded-lg p-1 font-semibold text-sky-900 cursor-pointer flex justify-between">
                    <div>Share</div>
                    <div className="pt-1 pl-1">
                      <FaShare />
                    </div>
                  </li>
                  <li className="hover:bg-gray-100 rounded-lg p-1 font-semibold text-red-600 cursor-pointer flex justify-between"
                    onClick={handleDeleteConversation}>
                    <div>Delete</div>
                    <div className="pt-1 pl-1">
                      <MdDelete />
                    </div>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </button>
      </div>
    </div>
  );
};

export default MessageHeader;
