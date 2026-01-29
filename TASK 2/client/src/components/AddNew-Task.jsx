import React, { useState } from "react";
import styles from "../styles/AddTask.module.css";
import api from "../api/axiosInstance";

const AddTaskModal = ({ isOpen, onClose, onAdd }) => {
  const [err, setErr] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "pending",
    category: "others",
    dueDate: "",
    priority: "Low",
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

    console.log("📤 Form data being sent:", formData); // Debug log

    try {
      // ✅ OPTION 1: Let parent handle the API call
      // Just pass the data to parent
      await onAdd(formData);

      // Reset form only after successful add
      setFormData({
        title: "",
        description: "",
        status: "pending",
        category: "others",
        dueDate: "",
        priority: "Low",
      });
    } catch (error) {
      console.error("❌ Modal error:", error);
      setErr(
        error.response?.data?.message ||
          error.message ||
          "Failed to create task",
      );
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

          {/* Category Dropdown */}
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

          {/* Due Date Field */}
          <div className={styles.formGroup}>
            <label>Due Date</label>
            <input
              type="date"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleChange}
              className={styles.input}
            />
          </div>

          {/* Priority Radio Buttons */}
          <div className={styles.formGroup}>
            <label>Priority</label>
            <div className={styles.radioGroup}>
              <label>
                <input
                  type="radio"
                  name="priority"
                  value="Low"
                  checked={formData.priority === "Low"}
                  onChange={handleChange}
                />
                <span>Low</span>
              </label>
              <label>
                <input
                  type="radio"
                  name="priority"
                  value="Moderate"
                  checked={formData.priority === "Moderate"}
                  onChange={handleChange}
                />
                <span>Moderate</span>
              </label>
              <label>
                <input
                  type="radio"
                  name="priority"
                  value="High"
                  checked={formData.priority === "High"}
                  onChange={handleChange}
                />
                <span>High</span>
              </label>
            </div>
          </div>

          {/* Status Radio Buttons */}
          <div className={styles.formGroup}>
            <label>Status</label>
            <div className={styles.radioGroup}>
              <label>
                <input
                  type="radio"
                  name="status"
                  value="pending"
                  checked={formData.status === "pending"}
                  onChange={handleChange}
                />
                <span>Pending</span>
              </label>
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
