import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useSelector } from "react-redux";
import { io } from "socket.io-client";

const SocketContext = createContext();

const useSocket = (url) => {
  const [socket, setSocket] = useState(null);
	const [onlineUsers, setOnlineUsers] = useState([]);
  const userid = useSelector((store)=>store.user.user.userid)

  useEffect(() => {
    const socketIo = io(url, {
			query: {
				userid: userid,
			},
		});

    socketIo.on("connect", () => {
      // console.log("connected", socketIo.id);
      setSocket(socketIo);
      socketIo.on("getOnlineUsers", (users) => {
        setOnlineUsers(users);
      });
    });

    socketIo.on("disconnect", () => {
      // console.log("disconnected");
      setSocket(null);
    });

    return () => {
      socketIo.disconnect();
    };
  }, [userid]);
  

  return {socket,onlineUsers};
};

export const SocketProvider = ({ children }) => {
  // const {socket,onlineUsers} = useSocket("http://localhost:5000");
  const {socket,onlineUsers} = useSocket("https://primeskill-1.onrender.com");

  return (
    <SocketContext.Provider value={{socket,onlineUsers}}>{children}</SocketContext.Provider>
  );
};

export const useSocketContext = () => {
  return useContext(SocketContext);
};
