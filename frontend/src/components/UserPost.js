import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { BACKENDURL } from "../config/data";
import axiosInstance from '../config/axiosConfig';
import { toast } from "react-toastify";
import Comments from "./Comments";
import dots from "../images/dots.png";

const UserPost = ({ post, user}) => {
  const userid = useSelector((store) => store.user.user.userid);
  const [showOptions, setShowOptions] = useState(false);
  const [showCommments, setShowComments] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const { comments, createdAt, imgurl, likes, text } = post;
  const [editText, setEditText] = useState(text);
  const imageUrl = `${BACKENDURL}uploads/${imgurl}`;
  // const dispatch = useDispatch();

  const toggleOptions = () => {
    setShowOptions(!showOptions);
  };

  const handleEdit = () => {
    setIsEditing(true);
    setShowOptions(false);
  };
  
  const handleDelete = async () => {
    try {
      const response = await axiosInstance.delete(`${BACKENDURL}api/post/${post._id}`);
      toast(response.data.message);
      // Dispatch an action to remove the post from the Redux store
      // dispatch({ type: "DELETE_POST", payload: post._id });
    } catch (error) {
      console.error("Error deleting the post", error);
    }
  };

  const handleSaveEdit = async () => {
    try {
      const response = await axiosInstance.put(`${BACKENDURL}api/post/${post._id}`, {
        text: editText,
      });
      // Dispatch an action to update the post in the Redux store
      // dispatch({ type: "UPDATE_POST", payload: response.data });
      toast(response.data.message);
      setIsEditing(false);
    } catch (error) {
      console.error("Error editing the post", error);
    }
  };
  return (
    <div className="select-none max-w-2xl mx-auto my-4 p-4 bg-white shadow-md rounded-lg max-h-[960px]">
      <div className="flex items-center mb-4 justify-between  ">
        <div className="flex items-center">
          <img
            className="w-10 h-10 rounded-full mr-4"
            src={
              user.profilePicture ||
              "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTY6qtMj2fJlymAcGTWLvNtVSCULkLnWYCDcQ&s"
            }
            alt={`${user.name}'s profile`}
          />
          <div>
            <div className="text-lg font-semibold">{user.name}</div>
            <div className="text-sm text-gray-500">
              {new Date(createdAt).toLocaleString()}
            </div>
          </div>
        </div>
        <button className="relative" onClick={toggleOptions}>
          <img
            className="w-5 h-5 rounded-full"
            src={dots}
            alt="edit option"
          />
          
      <div className="absolute right-0 w-32">
        {showOptions && (
          <div className="bg-white shadow-md rounded-lg p-2 text-gray-800 mt-2 ">
            <ul>
              {userid == user._id && (
                <>
                  <li
                    className="cursor-pointer p-2 hover:bg-gray-100"
                    onClick={handleEdit}
                  >
                    Edit
                  </li>
                  <li
                    className="cursor-pointer p-2 hover:bg-gray-100"
                    onClick={handleDelete}
                  >
                    Delete
                  </li>
                </>
              )}
              <li className="cursor-pointer p-2 hover:bg-gray-100">Share</li>
            </ul>
          </div>
        )}
      </div>
        </button>
      </div>
      <div className="mb-4">
        {isEditing ? (
          <div>
            <textarea
              className="w-full p-2 border rounded"
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
            />
            <button className="mt-2 p-2 bg-blue-500 text-white rounded" onClick={handleSaveEdit}>Save</button>
            <button className="mt-2 ml-2 p-2 bg-gray-500 text-white rounded" onClick={() => setIsEditing(false)}>Cancel</button>
          </div>
        ) : (
          <p className="text-gray-800">{text}</p>
        )}
      </div>
      {imgurl && (
        <div className="mb-4 bg-gray-200 rounded-md">
          <img
            className="mx-auto w-auto max-h-96 rounded-lg"
            src={imageUrl}
            alt="Post content"
          />
        </div>
      )}
      <div className="flex flex-col">
        <div className="flex items-center">
        <div className="text-sm text-gray-500 mr-4">
          <span className="font-semibold">{likes.length}</span> Likes
        </div>
        <div onClick={()=>setShowComments(!showCommments)} className="text-sm text-gray-500 cursor-pointer">
          <span className="font-semibold">{comments.length}</span> Comments
        </div>
        </div>
        <div className="mt-8 px-6">
        {
          showCommments && <Comments postid={post._id}/>
        }
        </div>
      </div>
    </div>
  );
};

export default UserPost;
