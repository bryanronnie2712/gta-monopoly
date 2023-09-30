const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const app = express();
const cors = require("cors");
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "https://x6yjll-3000.csb.app",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  //   Joining a room
  socket.on("join_room", (data) => {
    socket.join(data);
  });

  //   Update player details after each turn
  socket.on("send_msg", (data) => {
    socket.to(data.room).emit("recieve", data);
  });
});

server.listen(4000, () => {
  console.log("Server is running on port 4000");
});
