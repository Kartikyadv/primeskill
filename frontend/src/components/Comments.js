import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import Comment from "./Comment";
import send from "../images/send.png";
import loading from "../images/loading.png";
import { addComment, fetchComments } from "../redux/post/postThunkReducers";

const Comments = ({ post }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [parentid, setParentid] = useState(null);
  const [replyTo, setReplyTo] = useState("");
  const [refreshComment, setRefreshComment] = useState(false);
  const inputRef = useRef(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dispatch = useDispatch();
  const postid = post._id;

  useEffect(() => {
    const fetchComment = async () => {
      const res = await dispatch(fetchComments(postid));
      if (res.payload) {
        setComments(res.payload.comment);
      }
    };
    fetchComment();
  }, [refreshComment, dispatch, postid]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setIsSubmitting(true);
    try {
      await dispatch(
        addComment({ postid, comment: newComment, parentid: parentid })
      );
      toast("Comment added");
      setNewComment("");
      setReplyTo("");
      setRefreshComment(!refreshComment);
    } catch (error) {
      console.error("Error submitting comment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReply = (username, parentid) => {
    setReplyTo(username);
    setParentid(parentid);
    setNewComment(`@${username} `);
    inputRef.current.focus();
  };

  return (
    <div className="flex flex-col items-start mb-4 space-y-4">
      <div className="w-full max-h-64 overflow-y-auto custom-scrollbar p-3 bg-white rounded-xl">
        {comments?.map((comment, idx) => (
          <Comment
            key={idx}
            Post={post}
            refreshReply={refreshComment}
            setRefreshReply={setRefreshComment}
            refreshComment={refreshComment}
            setRefreshComment={setRefreshComment}
            comment={comment}
            handleReply={handleReply}
          />
        ))}
      </div>
      <div className="w-full bg-gray-100 rounded-lg h-8">
        <form onSubmit={handleSubmit} className="flex w-full">
          <input
            type="text"
            ref={inputRef}
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            className="w-[90%] bg-gray-100 h-8 ml-2 focus:outline-none"
          />
          <button type="submit" className="bg-gray-100 h-6 mt-1">
            {isSubmitting ? (
              <img className="h-full" src={loading} alt="Loading" />
            ) : (
              <img className="h-full" src={send} alt="Send" />
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Comments;
