import home from "../images/home.png";
import profile from "../images/profile.png";
import chats from "../images/chats.png";

// export const BACKENDURL = "https://primeskill-1.onrender.com/"
export const BACKENDURL = "http://localhost:5000/";

export const getNavbarOptions = (userid) => [
  {
    id: 1,
    name: "Home",
    to: "/",
    icon: home,
    authreq: true,
  },
  {
    id: 2,
    name: "Chats",
    to: "/chats",
    icon: chats,
    authreq: true,
  },
  {
    id: 3,
    name: "Profile",
    to: `/profile/${userid}`,
    icon: profile,
    authreq: true,
  },
  {
    id: 4,
    name: "Login",
    to: "/login",
    authreq: false,
  },
  {
    id: 5,
    name: "Signup",
    to: "/signup",
    authreq: false,
  },
];
