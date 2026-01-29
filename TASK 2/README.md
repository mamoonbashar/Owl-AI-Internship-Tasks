# 🦉 Owl TODO: Advanced Task Management System

**Owl TODO** is a sophisticated, full-stack productivity application developed as part of **Task 4: Advanced Owl AI Challenge**. It moves beyond simple list-making by implementing a complete MERN architecture, featuring deep database integration, responsive state management, and a focus on persistent data integrity.

---

## ⚡ Features

* **Persistent Data Storage:** Full integration with MongoDB Atlas ensures your tasks are saved securely and survive page refreshes.
* **Dynamic Task Lifecycle:**
* **Create:** Quick-add modal with category and status selection.
* **Edit:** Reusable modal system that auto-populates with current task data using `useEffect` hooks.
* **Delete:** One-click removal with immediate UI synchronization.


* **Status & Due Date Tracking:** Monitor progress via `Pending`, `In Progress`, or `Completed` states, and never miss a deadline with the integrated Date-Picker.
* **Adaptive Dual-Pane UI:** A desktop-first layout featuring a scannable task list and a rich-text detail view, which collapses into a mobile-friendly stack with a hamburger-toggle sidebar.
* **User Personalization:** Dynamic profile fetching displays the authenticated user's name, email, and avatar throughout the dashboard.

---

## 🛠️ Tech Stack

| Component | Technology |
| --- | --- |
| **Frontend** | React 18, CSS Modules (Scoped Styling), Axios |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB Atlas, Mongoose ODM |
| **Authentication** | JWT (JSON Web Tokens) & HTTP-only Cookies |

---

## 📡 Data Flow & Architecture

The application follows a strict RESTful pattern to ensure the frontend state remains perfectly mirrored with the cloud database:

1. **Request:** The React frontend emits an asynchronous Axios request (GET, POST, PATCH, or DELETE).
2. **Validation:** The Express backend passes the request through an `isLoggedin` middleware to verify the user's JWT.
3. **Persistence:** Mongoose validates the data against the `TaskSchema` and updates the MongoDB collection.
4. **Sync:** The server returns the updated document, and React updates the local `tasks` state, triggering a re-render without a full page reload.

---

## 📂 Project Structure

```text
├── client/              # React + Vite (Frontend)
│   ├── src/
│   │   ├── components/  # Home, EditTaskModal, AddTaskModal
│   │   ├── styles/      # Scoped CSS Modules for layout isolation
│   │   └── api/         # Axios instance with base URL config
└── server/              # Node + Express (Backend)
    ├── models/          # Task.model.js (Mongoose Schema)
    ├── controllers/     # Task logic (Create, Update, Delete)
    └── routes/          # Protected API endpoints

```

---

## 🚀 Getting Started

### 1. Backend Configuration

```bash
cd server
npm install
# Configure .env with MONGO_URI and JWT_SECRET
npm run dev

```

### 2. Frontend Configuration

```bash
cd client
npm install
npm run dev

```
