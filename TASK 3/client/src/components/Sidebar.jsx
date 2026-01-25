import React from "react";

const Sidebar = ({ room, setRoom, onlineCount, username }) => {
  const rooms = ["General", "Coding", "Help"];

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h3>Real Time  Chat</h3>
        <p className="status">
          <span className="dot"></span> {onlineCount} Online
        </p>
      </div>

      <div className="section-section">
        <h4>Rooms</h4>
        <ul>
          {rooms.map((r) => (
            <li
              key={r}
              className={room === r ? "active" : ""}
              onClick={() => setRoom(r)}
            >
              # {r}
            </li>
          ))}
        </ul>
      </div>

      <div className="sidebar-footer">
        <p>Logged in as:</p>
        <strong>{username}</strong>
      </div>
    </aside>
  );
};

export default Sidebar;
