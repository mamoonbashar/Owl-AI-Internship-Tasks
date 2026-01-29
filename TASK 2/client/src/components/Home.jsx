import React, { useEffect, useState } from "react";
import styles from "../styles/Home.module.css";
import EditTaskModal from "./Edit-Task";
import Button from "./Button";
import AddTaskModal from "./AddNew-Task";
import Settings from "./Edit-User-Info";
import plus from "../assets/icons/Plus.svg";
import API from "../api/axiosInstance";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [userData, setUserData] = useState({
    username: "Loading...",
    email: "...",
    profile: null,
  });

  // ✅ Reusable function to load tasks
  const loadTasks = async () => {
    try {
      const { data, status } = await API.get("/api/user/task/tasks");
      if (status === 200) {
        const tasksArray = Array.isArray(data) ? data : data.tasks || [];
        setTasks(tasksArray);
        if (tasksArray.length > 0) {
          setSelectedTask(tasksArray[0]);
        } else {
          setSelectedTask(null);
        }
      }
    } catch (error) {
      console.error("Fetch Error:", error);
      setError(
        error.response?.data?.Error || "Unable to fetch tasks from server",
      );
      setTasks([]);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const handleLogout = async () => {
    try {
      const { status } = await API.post("/api/user/logout");
      if (status === 200) navigate("/");
    } catch (error) {
      setError(error.response?.data?.Error || "Unable to logout");
    }
  };

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const { data, status } = await API.get("/api/user/userDetails");
        if (status === 200) {
          setUserData({
            username: data.user.username,
            email: data.user.email,
            profile: data.user.profile,
          });
        }
      } catch (err) {
        console.error("Failed to fetch user details", err);
      }
    };
    fetchUserDetails();
  }, []);

  // ✅ FIXED: Accept newTaskData parameter
  const handleAddTask = async (newTaskData) => {
    try {
      console.log("📤 Sending task data:", newTaskData); // Debug log

      const { data, status } = await API.post(
        "/api/user/task/create",
        newTaskData,
      );

      console.log("📥 Response:", { data, status }); // Debug log

      if (status === 201 || status === 200) {
        // Reload all tasks from server
        await loadTasks();
        setIsAddModalOpen(false);
        setError("");
        console.log("✅ Task created successfully");
      }
    } catch (error) {
      console.error("❌ Add Task Error:", error);
      console.error("Error response:", error.response?.data);
      setError(
        error.response?.data?.Error ||
          error.response?.data?.message ||
          "Failed to create task",
      );
    }
  };

  const handleDeleteTask = async () => {
    if (!selectedTask) return;
    const taskId = selectedTask._id;

    try {
      const response = await API.delete(`/api/user/task/delete/${taskId}`);

      if (response.data.success) {
        await loadTasks();
        alert("Task deleted successfully!");
      }
    } catch (error) {
      console.error("Delete Error:", error);
      setError(error.response?.data?.Error || "Unable to delete task");
      alert("Failed to delete task. Please try again.");
    }
  };

  const handleSaveTask = async (updatedData) => {
    if (!selectedTask) return;

    const taskId = selectedTask._id;

    try {
      const payload = {
        title: updatedData.title,
        description: updatedData.description,
        status: updatedData.status,
        category: updatedData.category,
        dueDate: updatedData.dueDate,
        priority: updatedData.priority,
      };

      const { data, status } = await API.patch(
        `/api/user/task/update/${taskId}`,
        payload,
      );

      if (status === 200 && data.success) {
        const updatedTask = data.newData;

        setTasks((prevTasks) =>
          prevTasks.map((task) => (task._id === taskId ? updatedTask : task)),
        );

        setSelectedTask(updatedTask);
        setIsEditModalOpen(false);
        alert("Task updated successfully!");
      }
    } catch (error) {
      console.error("Update Error:", error);
      setError(error.response?.data?.message || "Failed to update task");
      alert("Failed to update task. Please try again.");
    }
  };

  const handleSettings = () => setShowSettings(true);
  const handleBackFromSettings = () => setShowSettings(false);
  const handleEditTask = () => setIsEditModalOpen(true);

  const formatDate = (dateString) => {
    if (!dateString) return "No date";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch (e) {
      return dateString;
    }
  };

  return (
    <div className={styles.homeContainer}>
      {/* Sidebar */}
      <i
        className={`fa-solid fa-bars ${styles.menuIcon}`}
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      ></i>
      <aside
        className={`${styles.sidebar} ${isSidebarOpen ? styles.sidebarOpen : ""}`}
      >
        <div className={styles.logo}>
          <h1>Owl TODO</h1>
        </div>
        <div className={styles.userProfile}>
          <div className={styles.userInfo}>
            <div className={styles.userAvatar}>
              <img
                src={userData.profile}
                alt="User Profile"
                onError={(e) => {
                  e.target.src = `https://ui-avatars.com/api/?name=${userData.username}&background=f56565&color=fff`;
                }}
              />
            </div>
            <div className={styles.userDetails}>
              <h3>{userData.username}</h3>
              <p>{userData.email}</p>
            </div>
          </div>
        </div>
        <nav className={styles.navMenu}>
          <button
            className={`${styles.navItem} ${!showSettings ? styles.active : ""}`}
            onClick={handleBackFromSettings}
          >
            <span>My Task</span>
          </button>
          <button
            className={`${styles.navItem} ${showSettings ? styles.active : ""}`}
            onClick={handleSettings}
          >
            <span>Settings</span>
          </button>
        </nav>
        <div className={styles.logoutSection}>
          <button className={styles.navItem} onClick={handleLogout}>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={styles.mainContent}>
        {showSettings ? (
          <Settings onBack={handleBackFromSettings} setUserData={setUserData} />
        ) : (
          <>
            <section className={styles.taskList}>
              <div className={styles.taskListHeader}>
                {error && (
                  <p style={{ color: "red", fontSize: "12px" }}>{error}</p>
                )}
                <h2>My Tasks</h2>
                <span
                  onClick={() => setIsAddModalOpen(true)}
                  className={styles.dateBadge}
                >
                  <img src={plus} alt="add" /> Add Task
                </span>
              </div>

              {Array.isArray(tasks) && tasks.length > 0 ? (
                tasks.map((task) => (
                  <div
                    key={task._id}
                    className={`${styles.taskCard} ${
                      selectedTask?._id === task._id ? styles.active : ""
                    }`}
                    onClick={() => setSelectedTask(task)}
                  >
                    <div className={styles.taskContent}>
                      <div className={styles.taskInfo}>
                        <h3>{task.title}</h3>
                        <p>{task.description?.substring(0, 50)}...</p>
                        <div className={styles.taskTags}>
                          <span className={`${styles.tag} ${styles.status}`}>
                            {task.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className={styles.emptyMessage}>
                  No tasks found. Click "Add Task" to start.
                </p>
              )}
            </section>

            <section className={styles.taskDetails}>
              {selectedTask ? (
                <div className={styles.detailsContainer}>
                  <div className={styles.detailsHeader}>
                    <div className={styles.detailsTitle}>
                      <h1>{selectedTask.title}</h1>
                      <div className={styles.detailsMeta}>
                        <p>
                          <strong>Priority:</strong>{" "}
                          {selectedTask.priority || "Low"}
                        </p>
                        <p>
                          <strong>Status:</strong>{" "}
                          {selectedTask.status || "pending"}
                        </p>
                        <p>
                          <strong>Category:</strong>{" "}
                          {selectedTask.category || "Others"}
                        </p>
                        <p>
                          <strong>Due:</strong>{" "}
                          {formatDate(selectedTask.dueDate)}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className={styles.section}>
                    <h2>Description</h2>
                    <p>
                      {selectedTask.description || "No description provided."}
                    </p>
                  </div>
                  <div className={styles.actionButtons}>
                    <button
                      onClick={handleDeleteTask}
                      className={`${styles.btn} ${styles.btnPrimary}`}
                    >
                      Delete
                    </button>
                    <button
                      onClick={handleEditTask}
                      className={`${styles.btn} ${styles.btnSecondary}`}
                    >
                      Edit Task
                    </button>
                  </div>
                </div>
              ) : (
                <div className={styles.noTaskSelected}>
                  <p>Please select a task to view details</p>
                </div>
              )}
            </section>
          </>
        )}
      </main>

      <EditTaskModal
        task={selectedTask}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSaveTask}
      />
      <AddTaskModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddTask}
      />
    </div>
  );
};

export default Home;
