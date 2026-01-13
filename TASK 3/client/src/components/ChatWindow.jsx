import React, { useEffect, useRef } from "react";
import backgroundImage from "../assets/messages_light_colour_background.jpg";
const ChatWindow = ({ messages, typingStatus, currentUsername }) => {
  const scrollRef = useRef();

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="chat-area">
      {/* This wrapper is needed for the background image in your CSS */}
      <div className="background-wrapper">
        <img src={backgroundImage} alt="bg" />
      </div>

      <div className="chat-window">
        {messages.map((msg, index) => {
          const isOwn = msg.sender === currentUsername; // Use sender
          return (
            <div
              key={index}
              className={isOwn ? "leftSideMessage" : "rightSideMessage"}
            >
              <span className="chatBoxUsername">{msg.sender}</span>
              <p className="messageValue">{msg.text}</p>
            </div>
          );
        })}
        <div ref={scrollRef} />
      </div>
      {typingStatus && <p className="typing-indicator">{typingStatus}</p>}
    </div>
  );
};

export default ChatWindow;
