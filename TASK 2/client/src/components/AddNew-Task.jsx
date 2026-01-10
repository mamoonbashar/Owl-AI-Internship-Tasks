import React, { useState } from "react";
import styles from "../styles/AddTask.module.css";
import api from "../api/axiosInstance";

const AddTaskModal = ({ isOpen, onClose, onAdd }) => {
  const [err, setErr] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "pending", // Matches Mongoose Enum
    category: "others", // Matches Mongoose Enum
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr("");

    try {
      // 1. Send formData to backend
      const response = await api.post("/api/user/task/create", formData);

      if (response.status === 200) {
        // 2. Pass the saved task from backend back to Home.jsx
        onAdd(response.data.task);

        // 3. Reset and Close
        setFormData({
          title: "",
          description: "",
          status: "pending",
          category: "others",
        });
        onClose();
      }
    } catch (err) {
      setErr(err.response?.data?.message || "Database connection Failed");
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2>Add New Task</h2>
          {err && <p style={{ color: "red", fontSize: "12px" }}>{err}</p>}
        </div>

        <form onSubmit={handleSubmit}>
          {/* Title */}
          <div className={styles.formGroup}>
            <label>Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className={styles.input}
            />
          </div>

          {/* Category Dropdown (NEW) */}
          <div className={styles.formGroup}>
            <label>Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className={styles.input}
            >
              <option value="Work">Work</option>
              <option value="Home">Home</option>
              <option value="others">Others</option>
            </select>
          </div>

          {/* Status (Priority) Radio Buttons */}
          <div className={styles.formGroup}>
            <label>Status</label>
            <div className={styles.radioGroup}>
              <label>
                <input
                  type="radio"
                  name="status"
                  value="progress"
                  checked={formData.status === "progress"}
                  onChange={handleChange}
                />
                <span>In Progress</span>
              </label>
              <label>
                <input
                  type="radio"
                  name="status"
                  value="pending"
                  checked={formData.status === "pending"}
                  onChange={handleChange}
                />
                <span> Pending</span>
              </label>
              <label>
                <input
                  type="radio"
                  name="status"
                  value="completed"
                  checked={formData.status === "completed"}
                  onChange={handleChange}
                />
                <span>Completed</span>
              </label>
            </div>
          </div>

          {/* Description */}
          <div className={styles.formGroup}>
            <label>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className={styles.textarea}
              required
            />
          </div>

          <div className={styles.formActions}>
            <button
              type="button"
              onClick={onClose}
              className={styles.cancelButton}
            >
              Cancel
            </button>
            <button type="submit" className={styles.doneButton}>
              Done
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTaskModal;
