import { Server } from "socket.io";

const userSocketMap = {}; // userId: socketId

export const getRecipientSocketId = (recipientId) => {
  return userSocketMap[recipientId];
};

const initializeSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL, // your frontend domain
      credentials: true,
    },
  });
  
  io.on("connection", (socket) => {
    console.log(`Client connected: ${socket.id}`);
    const userid = socket.handshake.query.userid;
    
    if (userid != "undefined") userSocketMap[userid] = socket.id;
    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    socket.on("typing", ({ userId,otherParticipantid }) => {
      const recipientSocketId = getRecipientSocketId(otherParticipantid);
      if (recipientSocketId) {
        io.to(recipientSocketId).emit("typing", { userId });
      }
    });
  
    socket.on("stop typing", ({ userId,otherParticipantid }) => {
      const recipientSocketId = getRecipientSocketId(otherParticipantid);
      if (recipientSocketId) {
        io.to(recipientSocketId).emit("stop typing", { userId });
      }
    });

    socket.on("disconnect", () => {
      console.log(`Client disconnected: ${socket.id}`);
      delete userSocketMap[userid];
		io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });
  });

  return io;
};

export default initializeSocket;
