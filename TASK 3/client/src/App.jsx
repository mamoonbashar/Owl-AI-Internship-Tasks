import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import Sidebar from "./components/Sidebar";
import ChatWindow from "./components/ChatWindow";
import MessageInput from "./components/MessageInput";
import notificationSound from "./assets/public_message-tone.mp3";
import "./App.css";

const socket = io("http://localhost:5000");

function App() {
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("General");
  const [isJoined, setIsJoined] = useState(false);
  const [messages, setMessages] = useState([]);
  const [onlineCount, setOnlineCount] = useState(0);
  const [typingStatus, setTypingStatus] = useState("");

  useEffect(() => {
    socket.on("number-of-clients", (count) => setOnlineCount(count));

    socket.on("chat-message", (data) => {
      setMessages((prev) => [...prev, data]);

      // Play sound if message is from someone else
      // Note: Browser requires a user click on the page before sound plays
      if (data.sender !== username) {
        const audio = new Audio(notificationSound);
        console.log(audio)
        audio
          .play()
          .catch(() =>
            console.log("Sound blocked until user interacts with page")
          );
      }
    });

    socket.on("feedback", (data) => setTypingStatus(data.feedback));

    return () => {
      socket.off("number-of-clients");
      socket.off("chat-message");
      socket.off("feedback");
    };
  }, [username]); // Dependency on username for sound logic

  const handleJoin = (e) => {
    e.preventDefault();
    if (username.trim()) {
      socket.emit("join_room", room);
      setIsJoined(true);
    }
  };

  if (!isJoined) {
    return (
      <div className="join-container">
        <form onSubmit={handleJoin} className="join-form">
          <h2>Join Chat</h2>
          <input
            type="text"
            placeholder="Enter Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <select value={room} onChange={(e) => setRoom(e.target.value)}>
            <option value="General">General</option>
            <option value="Coding">Coding</option>
            <option value="Help">Help</option>
          </select>
          <button type="submit">Start Chatting</button>
        </form>
      </div>
    );
  }

  return (
    <div className="app-container">
      <Sidebar
        room={room}
        setRoom={(newRoom) => {
          socket.emit("join_room", newRoom);
          setRoom(newRoom);
          setMessages([]);
        }}
        onlineCount={onlineCount}
        username={username}
      />
      <main className="chat-area">
        <ChatWindow
          messages={messages}
          typingStatus={typingStatus}
          currentUsername={username}
        />
        <MessageInput socket={socket} room={room} username={username} />
      </main>
    </div>
  );
}

export default App;
