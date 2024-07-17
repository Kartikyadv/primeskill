import React, { useEffect, useState } from "react";
import UserProfile from "./UserProfile";
import axiosInstance from '../config/axiosConfig';
import { BACKENDURL } from "../config/data";
import { useSelector } from "react-redux";
import UserPosts from "./UserPost";

const Profile = () => {
  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState({});
  const userid = useSelector((store) => store.user.user.userid);
  useEffect(() => {
    const fetchUser = async () => {
      const user = await axiosInstance.get(
        BACKENDURL + "api/user/getuserprofile/" + userid
      );
      setPosts(user.data.user.posts);
      setUser(user.data.user);
    };
    fetchUser();
  }, []);
  return (
    <div className=" pt-20 md:w-[90%] mx-auto">
      <div className="">
        <UserProfile user={user}/>
      </div>
      <div className="mt-56">
        {posts?.map((post) => (
          <UserPosts key={post._id} post={post} user={user}/>
        ))}
      </div>
    </div>
  );
};

export default Profile;
