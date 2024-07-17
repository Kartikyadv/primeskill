import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { BACKENDURL } from "../config/data";
import { toast } from "react-toastify";
import Comments from "./Comments";
import dots from "../images/dots.png";
import love from "../images/love.png";
import redlove from "../images/redlove.png";
import comment from "../images/comment.png";
import { deletePost, editPost, likePost } from "../redux/postThunkReducers";

const Posts = ({ post }) => {
  const userid = useSelector((store) => store.user.user.userid);
  const [showOptions, setShowOptions] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const { comments, createdAt, imgurl, likes, text, user, _id } = post;
  const [editText, setEditText] = useState(text);
  const [isLiked, setIsLiked] = useState(false);
  const imageUrl = `${BACKENDURL}uploads/${imgurl}`;
  const dispatch = useDispatch();

  useEffect(() => {
    setIsLiked(likes.some((like) => like._id.toString() === userid));
  }, [likes]);

  const handleLike = () => {
    dispatch(likePost(post._id));
    setIsLiked(!isLiked);
  };

  const toggleOptions = () => {
    setShowOptions(!showOptions);
  };

  const handleEdit = () => {
    setIsEditing(true);
    setShowOptions(false);
  };

  const handleDelete = () => {
    dispatch(deletePost(post._id));
    toast("Post deleted");
  };
  
  const handleSaveEdit = () => {
    dispatch(editPost({ postId: post._id, text: editText }));
    toast("Post edited");
    setIsEditing(false);
  };

  const handleShowComment = async () => {
    setShowComments(!showComments)
  }

  return (
    <div className="select-none max-w-2xl mx-auto mt-4 pt-4 px-4 bg-white shadow-md rounded-lg ">
      <div className="flex items-center mb-4 justify-between">
        <div className="flex items-center">
          <img
            className="w-10 h-10 rounded-full mr-4"
            src={
              user?.profilePicture ||
              "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTY6qtMj2fJlymAcGTWLvNtVSCULkLnWYCDcQ&s"
            }
            alt={`${user?.name}'s profile`}
          />
          <div>
            <div className="text-lg font-semibold">{user?.name}</div>
            <div className="text-sm text-gray-500">
              {new Date(createdAt).toLocaleString()}
            </div>
          </div>
        </div>
        <button className="relative" onClick={toggleOptions}>
          <img className="w-5 h-5 rounded-full" src={dots} alt="edit option" />
          <div className="absolute right-0 w-32">
            {showOptions && (
              <div className="bg-white shadow-md rounded-lg p-2 text-gray-800 mt-2">
                <ul>
                  {userid === user._id && (
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
                  <li className="cursor-pointer p-2 hover:bg-gray-100">
                    Share
                  </li>
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
            <button
              className="mt-2 p-2 bg-blue-500 text-white rounded"
              onClick={handleSaveEdit}
            >
              Save
            </button>
            <button
              className="mt-2 ml-2 p-2 bg-gray-500 text-white rounded"
              onClick={() => setIsEditing(false)}
            >
              Cancel
            </button>
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
          <div className="text-sm text-gray-500 mr-3">
            <img
              onClick={handleLike}
              className="like-icon h-5 cursor-pointer"
              src={isLiked ? redlove : love}
              alt="like"
            />
            <span className="font-semibold">{likes?.length}</span> Likes
          </div>
          <div
            onClick={() => handleShowComment()}
            className="comment-icon-wrapper text-sm text-gray-500 cursor-pointer"
          >
            <img className="comment-icon h-6" src={comment} alt="comment" />
            <span className="font-semibold">{comments?.length}</span> Comments
          </div>
        </div>
        <div className="mt-6 px-6">
          {showComments && <Comments post={post} />}
        </div>
      </div>
    </div>
  );
};

export default Posts;
