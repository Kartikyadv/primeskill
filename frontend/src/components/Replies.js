import React, { useEffect, useState } from "react";
import dots from "../images/dots.png";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteComment,
  fetchReplies,
  likeComment,
} from "../redux/post/postThunkReducers";
import { toast } from "react-toastify";
import love from "../images/love.png";
import redlove from "../images/redlove.png";

const Replies = ({
  Post,
  comment,
  handleReply,
  refreshReply,
  setRefreshReply,
}) => {
  const [showOptions, setshowOptions] = useState(false);
  const [showReplies, setshowReplies] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const userid = useSelector((store) => store.user.user.userid);
  const dispatch = useDispatch();
  const { author, content, createdAt, likes, post, _id, replies } = comment;
  const postid = Post._id;

  useEffect(() => {
    setIsLiked(likes.some((like) => like.toString() === userid));
  }, [likes]);

  const handledeleteComment = () => {
    dispatch(deleteComment({ _id, postid }));
    toast("Comment Deleted");
    setRefreshReply(!refreshReply);
  };
  const handlecommentLike = () => {
    setIsLiked(!isLiked);
    setRefreshReply(!refreshReply);
    dispatch(likeComment({ _id, postid }));
  };

  return (
    <div className="bg-white rounded-xl">
      <div className="flex items-start">
        <img
          className="w-8 h-8 rounded-full mr-3"
          src={
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTY6qtMj2fJlymAcGTWLvNtVSCULkLnWYCDcQ&s"
          }
          alt={`User profile`}
        />
        <div className=" p-1 px-3 rounded-lg w-full flex justify-between">
          <div>
            <div className="text-sm">
              <span className="font-semibold">{author.name}</span>
              <span className="text-gray-500 ml-2">
                {new Date(createdAt).toLocaleString()}
              </span>
            </div>
            <p className="text-gray-800">{content}</p>
          </div>
          <div
            onClick={() => setshowOptions(!showOptions)}
            className="h-5 w-5 cursor-pointer relative"
          >
            <img className="h-5 w-5" src={dots} />
            {showOptions && userid == author._id && (
              <div
                onClick={handledeleteComment}
                className="bg-white rounded-lg right-0 absolute p-2 px-5 font-semibold text-red-600"
              >
                <button>Delete</button>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="flex flex-row w-[91%] ml-auto font-medium text-gray-600 text-sm justify-between h-4">
        <div className=" text-gray-500 mr-4 flex flex-row text-xs">
          {likes.length > 0 ? (
            <div className="px-1">{likes.length} Likes</div>
          ) : null}
          {/* <div
            onClick={() => handleReply(author.name, _id)}
            className="px-2 cursor-pointer hover:text-black"
          >
            reply
          </div> */}
        </div>
        <div>
          <img
            onClick={handlecommentLike}
            className="like-icon h-5 cursor-pointer mr-1 px-3 mb-3"
            src={isLiked ? redlove : love}
            alt="like"
          />
        </div>
      </div>
    </div>
  );
};

export default Replies;
