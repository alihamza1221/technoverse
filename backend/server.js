const { createServer } = require("http");
const app = require("./app");
const { Server } = require("socket.io");

const server = createServer(app);
const io = new Server(server);
io.on("connection", (socket) => {
  console.log("User connected", socket.id);

  socket.on("room-message", (data) => {
    console.log("Message received:", data);
    // Broadcast the message to all clients in the room
    socket.to(data.room).emit("room-message", data);
  });

  socket.on("join-room", (room) => {
    console.log(`User ${socket.id} joined room: ${room}`);
    socket.join(room);
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});
server.listen(3000, () => {
  console.log("server running at http://localhost:3000");
});
