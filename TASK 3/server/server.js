import express from "express";
import http from "http";
import { Server } from "socket.io";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import ChatModel from "./models/chat.model.js"; // Ensure path is correct

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // Vite default port
    methods: ["GET", "POST"],
  },
});

// MongoDB Connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.log("❌ DB Error:", err));

let onlineUsers = new Set();

io.on("connection", (socket) => {
  onlineUsers.add(socket.id);
  io.emit("number-of-clients", onlineUsers.size);

  // JOIN ROOM LOGIC
  socket.on("join_room", (room) => {
    socket.join(room);
    console.log(`User ${socket.id} joined room: ${room}`);
  });

  // MESSAGE LOGIC (Room Specific)
 
socket.on("message", async (data) => {
  // Pull sender and text directly from the frontend data
  const { room, sender, text } = data;

  try {
    const savedChat = await ChatModel.create({
      room: room,
      sender: sender,
      text: text,
      timestamp: new Date(),
    });

    // Send the SAME data back to everyone in the room
    io.to(room).emit("chat-message", data);
  } catch (err) {
    console.error("Error saving chat:", err.message);
  }
});

  socket.on("feedback", (data) => {
    socket.to(data.room).emit("feedback", data);
  });

  socket.on("disconnect", () => {
    onlineUsers.delete(socket.id);
    io.emit("number-of-clients", onlineUsers.size);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server on port ${PORT}`));
