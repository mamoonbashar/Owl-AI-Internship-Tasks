

# 💬 Owl Chat: Real-Time MERN Application

Owl Chat is a full-stack, real-time messaging platform. This project (Task 3) focuses on bi-directional communication using **Socket.io** and persistent data storage with **MongoDB**.

## ⚡ Features

* **Multi-Room Support:** Join dedicated rooms (General, Coding, Help) to keep conversations organized.
* **Live User Count:** Real-time tracking of online clients across all rooms.
* **Chat History:** Messages are stored in MongoDB and retrieved so you never lose the conversation.
* **Typing Indicators:** Visual feedback when other users are composing a message.
* **Interactive UI:** Responsive design with a sidebar for easy navigation between rooms.

## 🛠️ Tech Stack

* **Frontend:** React (Vite), Socket.io-Client, CSS3.
* **Backend:** Node.js, Express.js, Socket.io.
* **Database:** MongoDB Atlas & Mongoose ODM.

---

## 🚀 Getting Started

Since both the client and server use a development server, you will need to open **two terminals**.

### 1. Server Setup (Backend)

The backend manages the socket connections and database logic.

```bash
cd server
npm install
npm run dev

```

* **Port:** Runs on `http://localhost:3001` (or your `.env` port).
* **Confirmation:** You should see `✅ MongoDB Connected` in your terminal.

### 2. Client Setup (Frontend)

The frontend provides the user interface.

```bash
cd client
npm install
npm run dev

```

* **Port:** Runs on `http://localhost:5173`.
* **Proxy:** Vite is configured to proxy `/socket.io` requests to the backend automatically.

---

## 📡 Socket Flow

The app follows a strict event-based flow to ensure data consistency:

1. **Connection:** On mount, the client requests the initial user count.
2. **Room Entry:** Joining a room isolates the user's socket to that specific room ID.
3. **Message Loop:**
* Client sends a `message` event.
* Server saves the message to **MongoDB**.
* Server broadcasts the message to everyone in that specific room via `io.to(room).emit()`.



## 📂 Folder Structure

```text
├── client/              # Vite + React (Frontend)
│   ├── src/components/  # Sidebar, ChatWindow, MessageInput
│   └── vite.config.js   # Proxy configuration
└── server/              # Node + Express (Backend)
    ├── models/          # Mongoose Chat Schema
    └── server.js        # Socket.io & MongoDB Logic

```

---

## 📝 Important Notes

* **CORS:** The server is configured to allow requests from both `5173` (Dev) and `4173` (Preview).
* **Environment Variables:** Ensure your `.env` file in the `server` folder contains your `MONGODB_URI`.

---