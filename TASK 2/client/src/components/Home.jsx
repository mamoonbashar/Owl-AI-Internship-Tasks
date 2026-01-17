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
          error.response?.data?.Error || "Unable to fetch tasks from server"
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

const handleAddTask = async (newTaskData) => {
  try {
    const { data, status } = await API.post("/api/user/task/create", {
      title: newTaskData.title,
      status: newTaskData.status || "In Progress",
      priority: newTaskData.priority || "Medium",
      dueDate: newTaskData.date,
      description: newTaskData.description,
      category: newTaskData.category || "Others",
    });

    // 200 or 201 means the backend saved it successfully
    if (status === 201 || status === 200) {
      /** * CRITICAL FIX:
       * Your backend controller returns { message: "...", success: true, task: {...} }
       * We must extract ONLY the task object to add to our list.
       */
      const actualTask = data.task ? data.task : data;

      // Update the local state array so React re-renders immediately
      setTasks((prevTasks) => [...prevTasks, actualTask]);

      // Set the newly created task as the selected one
      setSelectedTask(actualTask);

      // Close the modal
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
    const taskId = selectedTask._id || selectedTask.id;

    try {
      await API.delete(`/api/user/task/delete/${taskId}`);

      const updatedTasks = tasks.filter((t) => (t._id || t.id) !== taskId);
      setTasks(updatedTasks);
      setSelectedTask(updatedTasks.length > 0 ? updatedTasks[0] : null);
      alert("Task deleted successfully!");
    } catch (error) {
      setError(error.response?.data?.Error || "Unable to delete task");
    }
  };

  const handleSaveTask = (updatedData) => {
    console.log("Edit logic to be implemented:", updatedData);
    // You will need a PUT/PATCH request here later
  };

  const handleSettings = () => setShowSettings(true);
  const handleBackFromSettings = () => setShowSettings(false);
  const handleEditTask = () => setIsEditModalOpen(true);

  return (
    <div className={styles.homeContainer}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.logo}>
          <h1>ToDoHQ</h1>
        </div>
        <div className={styles.userProfile}>
          <div className={styles.userInfo}>
            <div className={styles.userAvatar}>
              <img
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100"
                alt="Profile"
              />
            </div>
            <div className={styles.userDetails}>
              <h3>Samson Uwaifo</h3>
              <p>samson@email.com</p>
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
          <Settings onBack={handleBackFromSettings} />
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
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddTask}
      />
    </div>
  );
};

export default Home;
