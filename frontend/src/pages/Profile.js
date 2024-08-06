import React, { useEffect, useState } from "react";
import UserProfile from "../components/UserProfile";
import axiosInstance from '../config/axiosConfig';
import { BACKENDURL } from "../config/data";
import { useSelector } from "react-redux";
import UserPosts from "../components/UserPost";
import { useParams } from "react-router-dom";

const Profile = () => {
  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState({});
  const { userid } = useParams();
  useEffect(() => {
    const fetchUser = async () => {
      const user = await axiosInstance.get(
        BACKENDURL + "api/user/getuserprofile/" + userid
      );
      setPosts(user.data.user.posts);
      setUser(user.data.user);
    };
    fetchUser();
  }, [userid]);
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
