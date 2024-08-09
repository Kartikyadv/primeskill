import { Server } from "socket.io";

const userSocketMap = {}; // userid: socketId

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

    if (userid !== "undefined") userSocketMap[userid] = socket.id;
    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    socket.on("offer", (data) => {
      const recipientSocketId = getRecipientSocketId(data.to);
      if (recipientSocketId) {
        io.to(recipientSocketId).emit("offer", {
          offer: data.offer,
          from: userid,
        });
      }
    });

    socket.on("answer", (data) => {
      const recipientSocketId = getRecipientSocketId(data.to);
      if (recipientSocketId) {
        io.to(recipientSocketId).emit("answer", {
          answer: data.answer,
          from: userid,
        });
      }
    });

    socket.on("ice-candidate", (data) => {
      const recipientSocketId = getRecipientSocketId(data.to);
      if (recipientSocketId) {
        io.to(recipientSocketId).emit("ice-candidate", {
          candidate: data.candidate,
          from: userid,
        });
      }
    });

    socket.on("end-call", (data) => {
      const recipientSocketId = getRecipientSocketId(data.to);
      if (recipientSocketId) {
        io.to(recipientSocketId).emit("call-ended", {
          from: userid,
        });
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