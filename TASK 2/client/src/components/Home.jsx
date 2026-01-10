import React, { useState } from "react";
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
  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: "Submit Documents",
      status: "In Progress",
      priority: "Extreme",
      dueDate: "End of Day",
      description:
        "All required documents at the accepted formats need to be submitted digitally.",
      fullDescription:
        "Review the list of documents required for submission and ensure all necessary documents are ready. Each document must be in a specific format with physical copies need to be submitted digitally. Review the scanned files successfully for early identification and verify that they are in the accepted file formats. Upload the documents securely to the designated platform, double-check for accuracy, and verify the information for submission. Follow up if there is any extended clarification. Follow up if necessary to ensure proper receipt and processing.",
      image:
        "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=300&h=200&fit=crop",
      notes: [
        "Ensure that the documents are authentic and up-to-date.",
        "Maintain confidentiality and security of sensitive information.",
        "Keep records of all submissions for future reference.",
        "If there are specific guidelines or deadlines for submission, review to learn something.",
      ],
    },
    {
      id: 2,
      title: "Complete assignments",
      status: "In Progress",
      priority: "High",
      dueDate: "Tomorrow",
      description:
        "The second assignment for data structures needs to be completed.",
      fullDescription:
        "Complete the data structures assignment covering trees, graphs, and sorting algorithms. Ensure all code is properly documented and tested.",
      image:
        "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=300&h=200&fit=crop",
      notes: [
        "Review lecture notes before starting",
        "Test all edge cases",
        "Submit before the deadline",
      ],
    },
  ]);

  const [selectedTask, setSelectedTask] = useState(tasks[0]);

  const handleLogout = async () => {
 
    try {
      const { status } = await API.post("/api/user/logout");

      if (status === 200) navigate("/");
    } catch (error) {
      setError(error.response?.data?.Error||"Unable logout ");
    }
  };

  const handleSettings = () => {
    setShowSettings(true);
  };

  const handleBackFromSettings = () => {
    setShowSettings(false);
  };

  const handleEditTask = () => {
    setIsEditModalOpen(true);
  };

  const handleSaveTask = (updatedData) => {
    console.log("Updated task:", updatedData);
    // Here you would update your tasks state
  };

  const handleAddTask = (newTaskData) => {
    console.log("New task:", newTaskData);
    const newTask = {
      id: tasks.length + 1,
      title: newTaskData.title,
      status: "In Progress",
      priority: newTaskData.priority,
      dueDate: newTaskData.date,
      description: newTaskData.description,
      fullDescription: newTaskData.description,
      image:
        "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=300&h=200&fit=crop",
      notes: [],
    };
    setTasks([...tasks, newTask]);
    setSelectedTask(newTask);
  };

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
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop"
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
          <button className={`${styles.navItem} ${styles.active}`}>
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            <span>My Task</span>
          </button>

          <button className={styles.navItem} onClick={handleSettings}>
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <span>Settings</span>
          </button>
        </nav>

        <div className={styles.logoutSection}>
          <button className={styles.navItem} onClick={handleLogout}>
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
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
            {/* Task List */}
            <section className={styles.taskList}>
              <div className={styles.taskListHeader}>
                {error && <p style={{ color: "red", fontSize: "12px" }}>{error}</p>}
                <h2>My Tasks</h2>
                <span
                  onClick={() => setIsAddModalOpen(true)}
                  className={styles.dateBadge}
                >
                  <img src={plus} alt="logo" /> Add Task
                </span>
              </div>

              {tasks.map((task) => (
                <div
                  key={task.id}
                  className={`${styles.taskCard} ${
                    selectedTask.id === task.id ? styles.active : ""
                  }`}
                  onClick={() => setSelectedTask(task)}
                >
                  <div className={styles.taskContent}>
                    <div className={styles.taskCheckbox}>
                      <svg
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <circle cx="12" cy="12" r="10" strokeWidth="2" />
                      </svg>
                    </div>
                    <div className={styles.taskInfo}>
                      <h3>{task.title}</h3>
                      <p>{task.description}</p>
                      <div className={styles.taskTags}>
                        <span className={`${styles.tag} ${styles.setup}`}>
                          Setup
                        </span>
                        <span className={`${styles.tag} ${styles.status}`}>
                          Status: {task.status}
                        </span>
                      </div>
                    </div>
                    <img
                      src={task.image}
                      alt={task.title}
                      className={styles.taskImage}
                    />
                  </div>
                </div>
              ))}
            </section>

            {/* Task Details */}
            <section className={styles.taskDetails}>
              <div className={styles.detailsContainer}>
                <div className={styles.detailsHeader}>
                  <img
                    src={selectedTask.image}
                    alt={selectedTask.title}
                    className={styles.detailsImage}
                  />
                  <div className={styles.detailsTitle}>
                    <h1>{selectedTask.title}</h1>
                    <div className={styles.detailsMeta}>
                      <div className={styles.metaItem}>
                        <span className={styles.metaLabel}>Priority:</span>
                        <span
                          className={`${styles.metaValue} ${styles.priority}`}
                        >
                          {selectedTask.priority}
                        </span>
                      </div>
                      <div className={styles.metaItem}>
                        <span className={styles.metaLabel}>Status:</span>
                        <span
                          className={`${styles.metaValue} ${styles.statusValue}`}
                        >
                          On Schedule
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className={styles.section}>
                  <h2>Task Title: Document Submission</h2>
                  <div className={styles.sectionContent}>
                    <p>
                      <strong>Objective:</strong> To submit required documents
                      for something important
                    </p>
                  </div>
                </div>

                <div className={styles.section}>
                  <h2>Task Description:</h2>
                  <div className={styles.sectionContent}>
                    <p>{selectedTask.fullDescription}</p>
                  </div>
                </div>

                <div className={styles.section}>
                  <h2>Additional Notes:</h2>
                  <div className={styles.sectionContent}>
                    <ul>
                      {selectedTask.notes.map((note, index) => (
                        <li key={index}>{note}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className={styles.section}>
                  <div className={styles.sectionContent}>
                    <p>
                      <strong>Deadline for Submission:</strong>{" "}
                      {selectedTask.dueDate}
                    </p>
                  </div>
                </div>

                <div className={styles.actionButtons}>
                  <Button
                    type="submit "
                    className={`${styles.btn} ${styles.btnPrimary}`}
                  >
                    Delete
                  </Button>
                  <button
                    className={`${styles.btn} ${styles.btnSecondary}`}
                    onClick={handleEditTask}
                  >
                    Edit Task
                  </button>
                </div>
              </div>
            </section>
          </>
        )}
      </main>

      {/* Edit Task Modal */}
      <EditTaskModal
        task={selectedTask}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSaveTask}
      />

      {/* Add Task Modal */}
      <AddTaskModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddTask}
      />
    </div>
  );
};

export default Home;
