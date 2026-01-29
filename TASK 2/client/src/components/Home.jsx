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
  // Initialize as empty array to prevent .map() errors
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);

  // 1. Fetch Tasks - Wrapped in useCallback to prevent re-renders
  // 1 & 2. Load tasks when component mounts
  useEffect(() => {
    // Define the function inside the effect to satisfy ESLint
    const loadTasksFromServer = async () => {
      try {
        const { data, status } = await API.get("/api/user/task/tasks");
        if (status === 200) {
          const tasksArray = Array.isArray(data) ? data : data.tasks || [];
          setTasks(tasksArray);
          if (tasksArray.length > 0) {
            setSelectedTask(tasksArray[0]);
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

    loadTasksFromServer();
  }, []); // Empty dependency array means this runs only once on mount

  const handleLogout = async () => {
    try {
      const { status } = await API.post("/api/user/logout");
      if (status === 200) navigate("/");
    } catch (error) {
      setError(error.response?.data?.Error || "Unable to logout");
    }
  };
  // ... inside your Home component ...
  const [userData, setUserData] = useState({
    username: "Loading...",
    email: "...",
    profile: null,
  });

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        // Ensure this endpoint matches your backend route
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
  // Home.jsx - Ensure handleAddTask looks exactly like this
  const handleAddTask = async (newTaskData) => {
    try {
      const { data, status } = await API.post(
        "/api/user/task/create",
        newTaskData,
      );

      // Your backend likely returns 201 for "Created"
      if (status === 201 || status === 200) {
        const savedTask = data.task ? data.task : data;

        // Update state: Add the NEW task to the TOP of the list
        setTasks((prevTasks) => [savedTask, ...prevTasks]);
        setSelectedTask(savedTask);

        // THIS IS THE CRITICAL LINE: Close the modal
        setIsAddModalOpen(false);
        setError("");
      }
    } catch (error) {
      console.error("Add Task Error:", error);
      setError(error.response?.data?.message || "Failed to create task");
    }
  };
 const handleDeleteTask = async () => {
    if (!selectedTask) return;
    const taskId = selectedTask._id;

    try {
      const { status } = await API.delete(`/api/user/task/delete/${taskId}`);
      if (status === 200) {
        const updatedTasks = tasks.filter((t) => t._id !== taskId);
        setTasks(updatedTasks);
        setSelectedTask(updatedTasks.length > 0 ? updatedTasks[0] : null);
      }
    } catch (error) {
      setError("Could not delete from server",error);
    }
  };
const handleSaveTask = async (updatedData) => {
  try {
    const taskId = selectedTask._id; // Get the ID of the task we are editing

    // Mapping frontend names to backend names
    const payload = {
      title: updatedData.title,
      description: updatedData.description,
      priority: updatedData.priority,
      dueDate: updatedData.date, // Changing 'date' back to 'dueDate' for MongoDB
    };

    const { data, status } = await API.patch(`/api/user/task/update/${taskId}`, payload);

    if (status === 200 || data.success) {
      // Update the local list so the UI changes immediately
      setTasks((prev) =>
        prev.map((t) => (t._id === taskId ? data.newData : t))
      );
      setSelectedTask(data.newData);
      setIsEditModalOpen(false);
      alert("Task updated successfully!");
    }
  } catch (error) {
    console.error("Update Error:", error);
    alert("Failed to update task in MongoDB");
  }
};

  const handleSettings = () => setShowSettings(true);
  const handleBackFromSettings = () => setShowSettings(false);
  const handleEditTask = () => setIsEditModalOpen(true);

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
                  // Safety fallback if the URL is broken
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
            className={`${styles.navItem} ${
              !showSettings ? styles.active : ""
            }`}
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
          <Settings
            onBack={handleBackFromSettings}
            setUserData={setUserData} // Add this prop
          />
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

              {/* Guard against non-array values */}
              {Array.isArray(tasks) && tasks.length > 0 ? (
                tasks.map((task) => (
                  <div
                    key={task._id || task.id}
                    className={`${styles.taskCard} ${
                      (selectedTask?._id || selectedTask?.id) ===
                      (task._id || task.id)
                        ? styles.active
                        : ""
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
                          <strong>Priority:</strong> {selectedTask.priority}
                        </p>
                        <p>
                          <strong>Status:</strong> {selectedTask.status}
                        </p>
                        <p>
                          <strong>Due:</strong>{" "}
                          {selectedTask.dueDate || "No date"}
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
        onClose={() => setIsAddModalOpen(false)} // Check this line
        onAdd={handleAddTask}
      />
    </div>
  );
};

export default Home;
