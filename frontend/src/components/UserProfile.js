import React from "react";
import userprofilebg from "../images/userprofilebg.avif";
import dummyuser from "../images/dummyuser.jpg";
import editprofile from "../images/editprofile.png";
import CreatePost from "./CreatePost";
import { useSelector } from "react-redux";

const UserProfile = ({ user }) => {
  const loggedinuser = useSelector((store) => store.user.user.userid);
  const { name, _id } = user;
  return (
    <div className="w-[100%] relative">
      <div className=" ">
        <div className="relative">
          <img className="w-full max-h-80 " src={userprofilebg} />
          {loggedinuser === _id ? (
            <button className="absolute bottom-4 right-3 bg-white rounded-md font-semibold cursor-pointer z-10 p-3">
              + Add cover photo
            </button>
          ) : null}
        </div>
        <div className="w-[90%] absolute top-[50%] md:top-[70%] left-[5%] mt-9 md:flex md:flex-row">
          <div>
            <img
              className=" max-w-40 md:max-w-64 max-h-80 rounded-full"
              src={dummyuser}
            />
          </div>
          <div className="mt-[9%] ml-[3%]  relative w-full md:flex md:flex-row">
            <h1 className="font-bold text-4xl">{name}</h1>
            {loggedinuser === _id ? (
              <button className="absolute right-3 bottom-20 bg-gray-200 font-semibold text-xl rounded-md p-1 flex flex-row">
              <img className="pt-2 px-2" src={editprofile} /> Edit profile
            </button>
            ) : null}
            <div className="absolute right-3 bottom-2 rounded-md p-1">
            {loggedinuser === _id ? (
              <CreatePost />
            ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
