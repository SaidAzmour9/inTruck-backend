const { io } = require("socket.io-client");

const socket = io("http://localhost:3000");

socket.on("connect", () => {
  console.log("Connected to websocket server with id:", socket.id);
});

socket.on("notificationUpdated", (data) => {
  console.log("Notification updated:", data);
});

socket.on("notificationDeleted", (data) => {
  console.log("Notification deleted:", data);
});

socket.on("disconnect", () => {
  console.log("Disconnected from websocket server");
});
