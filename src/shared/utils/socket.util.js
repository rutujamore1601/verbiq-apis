const socket = require("socket.io");

const ioSocket = (server) => {
  const io = socket(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST", "DELETE", "UPDATE", "PUT", "PATCH"],
    },
  });

  io.on("connection", (socket) => {
    // Handle driver location updates
    socket.on("driverLocation", (location) => {
      // Broadcast the location to all connected users
      socket.broadcast.emit("driverLocationUpdate", location);
    });

    // Handle disconnection
    socket.on("disconnect", () => {
      console.log("A user disconnected");
    });
  });
};

module.exports = {
  ioSocket,
};
