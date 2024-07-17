import React, { useState } from "react";
import PostForm from "./PostForm";

const CreatePost = () => {
  const [isFormVisible, setIsFormVisible] = useState(false);

  const handleAddPostClick = () => {
    setIsFormVisible(true);
  };

  return (
    <div>
      {!isFormVisible && (
        <div className="flex flex-col items-center bg-gray-100 w-[100px]">
          <button
            onClick={handleAddPostClick}
            className="px-4 py-2 bg-blue-500 text-white rounded shadow-md hover:bg-blue-600 transition duration-300"
          >
            Add Post
          </button>
        </div>
      )}
      {isFormVisible && (
        <div className="fixed inset-0 flex mx-auto items-center justify-center w-[70%] z-50 h-[85%]">
          <PostForm isFormVisible={isFormVisible} setIsFormVisible={setIsFormVisible} />
        </div>
      )}
    </div>
  );
};

export default CreatePost;
