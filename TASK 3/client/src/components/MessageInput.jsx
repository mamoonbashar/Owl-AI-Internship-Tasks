import React, { useState } from "react";

const MessageInput = ({ socket, room, username }) => {
  const [text, setText] = useState("");
  
 const handleSend = (e) => {
   e.preventDefault();
   if (!text.trim()) return;

   const data = {
     room: room, // Keep as room
     sender: username, // CHANGE THIS from 'name' to 'sender'
     text: text, // CHANGE THIS from 'message' to 'text'
     dateTime: new Date(),
   };

   socket.emit("message", data); // Sending to backend
   setText("");
   socket.emit("feedback", { room, feedback: "" });
 };
  const handleTyping = () => {
    socket.emit("feedback", { room, feedback: `${username} is typing` });
  };

  return (
    <form className="input-form" onSubmit={handleSend}>
      <input
        type="text"
        placeholder="Write your message..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyPress={handleTyping}
        onBlur={() => socket.emit("feedback", { room, feedback: "" })}
      />
      <button type="submit">Send</button>
    </form>
  );
};

export default MessageInput;
