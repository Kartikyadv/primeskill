import React, { useEffect, useState } from "react";
import dots from "../images/dots.png";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteComment,
  fetchReplies,
  likeComment,
} from "../redux/postThunkReducers";
import { toast } from "react-toastify";
import love from "../images/love.png";
import redlove from "../images/redlove.png";
import Replies from "./Replies";

const Comment = ({
  Post,
  comment,
  handleReply,
  refreshComment,
  setRefreshComment,
  setRefreshReply,
  refreshReply,
}) => {
  const [showOptions, setshowOptions] = useState(false);
  const [replies, setreplies] = useState([]);
  const [showReplies, setshowReplies] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const userid = useSelector((store) => store.user.user.userid);
  const dispatch = useDispatch();
  const { author, content, createdAt, likes, post, _id } = comment;
  const postid = Post._id;

  useEffect(() => {
    setIsLiked(likes.some((like) => like.toString() === userid));
  }, [likes]);

  useEffect(() => {
    const fetchReplie = async () => {
      const res = await dispatch(fetchReplies({ _id, postid }));
      if (res.payload) {
        setreplies(res.payload.replies);
      }
    };
    fetchReplie();
  }, [refreshReply]);

  const handledeleteComment = () => {
    dispatch(deleteComment({ _id, postid }));
    toast("Comment Deleted");
    setRefreshComment(!refreshComment);
  };
  const handlecommentLike = () => {
    dispatch(likeComment({ _id, postid }));
    setIsLiked(!isLiked);
    setRefreshComment(!refreshComment);
  };
  const handleviewreplies = () => {
    dispatch(fetchReplies({ _id, postid }));
    setRefreshComment(!refreshComment);
    setshowReplies(!showReplies);
  };

  return (
    <div className="bg-white rounded-xl mb-2 w-full">
      {comment.parentCommentId == null ? (
        <>
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
          <div className="flex flex-row w-[91%] ml-auto font-medium text-gray-600 text-sm justify-between h-7">
            <div className=" text-gray-500 mr-4 flex flex-row text-xs">
              {likes.length > 0 ? (
                <div className="px-1">{likes.length} Likes</div>
              ) : null}

              <div
                onClick={() => handleReply(author.name, _id)}
                className="px-2 cursor-pointer hover:text-black"
              >
                reply
              </div>
              <div
                onClick={() => handleviewreplies(author.name, _id)}
                className="px-2 cursor-pointer hover:text-black"
              >
                {replies.length > 0 ? (
                  <>
                    {showReplies ? <>hide</> : <>view</>} replies{" "}
                    {showReplies ? null : <>({replies?.length})</>}
                  </>
                ) : null}
              </div>
            </div>
            <div>
              <img
                onClick={handlecommentLike}
                className="like-icon h-5 cursor-pointer mt-1 mr-1 px-3"
                src={isLiked ? redlove : love}
                alt="like"
              />
            </div>
          </div>
        </>
      ) : null}
      {showReplies &&
        replies?.map((comment, idx) => (
          <div className="w-[90%] mr-[1%] mt-2 ml-[10%]">
            <Replies
              key={idx}
              Post={post}
              refreshReply={refreshReply}
              setRefreshReply={setRefreshReply}
              comment={comment}
              handleReply={handleReply}
            />
          </div>
        ))}
    </div>
  );
};

export default Comment;
