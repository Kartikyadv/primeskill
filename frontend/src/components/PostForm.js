import React, { useState, useRef, useEffect } from "react";
import { useDispatch } from 'react-redux';
import { createPost } from '../redux/postThunkReducers';
import { toast } from "react-toastify";

const PostForm = ({ isFormVisible, setIsFormVisible }) => {
  const [postContent, setPostContent] = useState("");
  const [postImage, setPostImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const formRef = useRef(null);
  const dispatch = useDispatch();

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("content", postContent);

    if (postImage) {
      formData.append("image", postImage);
    }
    try {
      await dispatch(createPost(formData)).unwrap();
      toast("Post Created");
      setPostContent("");
      setPostImage(null);
      setImagePreview(null);
      setIsFormVisible(false);
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  const handleClickOutside = (event) => {
    if (formRef.current && !formRef.current.contains(event.target)) {
      setIsFormVisible(false);
    }
  };

  useEffect(() => {
    if (isFormVisible) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isFormVisible]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setPostImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  return (
    <div
      ref={formRef}
      className="mt-6 p-4 backdrop-blur-3xl bg-slate-800/40 rounded shadow-lg w-full justify-center h-full"
    >
      <button
        onClick={() => setIsFormVisible(false)}
        className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
      >
        &times;
      </button>
      <form onSubmit={handleFormSubmit}>
        <textarea
          value={postContent}
          onChange={(e) => setPostContent(e.target.value)}
          placeholder="Write your post here..."
          className="w-full h-32 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="mt-4"
        />
        {imagePreview && (
          <div className="mt-4">
            <img
              src={imagePreview}
              alt="Selected"
              className="max-w-96 max-h-80 rounded"
            />
          </div>
        )}
        <button
          type="submit"
          className="mt-2 px-4 py-2 bg-green-500 text-white rounded shadow-md hover:bg-green-600 transition duration-300"
        >
          Submit Post
        </button>
      </form>
    </div>
  );
};

export default PostForm;
