const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const app = express();
const cors = require("cors");
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    // origin: "https://x6yjll-3000.csb.app",
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

let currentGames = new Object();
io.on("connection", (socket) => {
  // Create a new room
  socket.on("createRoom", (data) => {
    // data = {playerName: String, playerId: String}
    const randomRoomId = Math.floor(Math.random() * 10000);
    // Update player details - 1st player, so no conditions needed
    currentGames[randomRoomId] = {
      roomId: randomRoomId,
      players: [
        {
          playerNumber: 0,
          playerId: data.playerId,
          name: data.playerName,
          pos: 0,
          money: 1500,
          assets: [],
        },
      ],
    };
    console.log("currentGames ==>", currentGames, data);
    // Creating and Joining this room
    socket.join(randomRoomId);
    // Reply to joiner
    socket.emit("createRoomStatus", {
      updPlayerDetails: currentGames[randomRoomId].players,
      roomId: randomRoomId,
      playerNumber: 0,
      msg: "created",
    });
  });

  socket.on(
    "joinRoom",
    (data) => {
      console.log("connStatus", data);
    },
    5000,
  );

  // Joining a room
  socket.on("joinRoom", (data) => {
    // data = {roomId: String, playerName: String, playerId: String}
    console.log("joinRoom", data);
    const roomIdAvailable = Object.keys(currentGames).includes(data.roomId);
    const roomSize = currentGames[data.roomId]?.players?.length;
    const roomNotFull = roomSize < 4;

    const playerIdExists = currentGames[data.roomId]?.players
      .map((player) => {
        return player.playerId;
      })
      .indexOf(data.playerName);
    console.log("playerIdExists", playerIdExists);
    if (roomIdAvailable) {
      if (roomNotFull) {
        console.log("player already in room");
        if (playerIdExists >= 0) {
          // Joining this room
          socket.join(data.roomId);
          // Reply to joiner
          socket.emit("rejoinRoomStatus", {
            updPlayerDetails: currentGames[data.roomId].players,
            playerNumber: currentGames[data.roomId].players.playerNumber,
            roomId: data.roomId,
            msg: "rejoined",
          });
        } else {
          // Update player details
          currentGames[data.roomId].players.push({
            playerNumber: roomSize,
            playerId: data.playerId,
            name: data.playerName,
            pos: 0,
            money: 1500,
            assets: [],
          });
          // Joining this room
          socket.join(data.roomId);
          // Reply to joiner
          socket.emit("joinRoomStatus", {
            updPlayerDetails: currentGames[data.roomId].players,
            playerNumber: roomSize,
            roomId: data.roomId,
            msg: "joined",
          });
          // Broadcast to roomId
          socket.broadcast.emit("aNewPlayerHasJoined", {
            updPlayerDetails: currentGames[data.roomId].players,
            newPlayerName: data.playerName,
            msg: "joined",
          });
        }
      } else {
        // Room is full
        // Disconnect from socket
        socket.disconnect(true);
        // Reply to joiner
        socket.emit("joinRoomStatus", {
          msg: "full",
        });
      }
      console.log(
        "Players ==> ",
        currentGames[data.roomId]?.players.map((player) => player.playerId),
      );
    } else {
      console.log("Room Id does not exist");
    }
  });
});

server.listen(4000, () => {
  console.log("Server is running on port 4000");
});
