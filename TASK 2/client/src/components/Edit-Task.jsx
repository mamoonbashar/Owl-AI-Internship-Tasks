import React, { useState, useEffect } from "react";
import styles from "../styles/EditTask.module.css";

const EditTaskModal = ({ task, isOpen, onClose, onSave }) => {
  // 1. Initialize state
  const [formData, setFormData] = useState({
    title: "",
    date: "",
    priority: "Low",
    description: "",
  });

  // 2. IMPORTANT: Update form when 'task' prop changes or modal opens
  useEffect(() => {
    if (task && isOpen) {
      setFormData({
        title: task.title || "",
        // Format date to YYYY-MM-DD so the HTML input can read it
        date: task.dueDate ? task.dueDate.split("T")[0] : "",
        priority: task.priority || "Low",
        description: task.description || "",
      });
    }
  }, [task, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // 3. Send data back to Home.jsx
    onSave(formData);
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2>Edit Task</h2>
          <button className={styles.closeButton} onClick={onClose}>
            Go Back
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label>Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className={styles.input}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label>Date</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className={styles.input}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label>Priority</label>
            <div className={styles.radioGroup}>
              {["Low", "Moderate", "High"].map((p) => (
                <label key={p} className={styles.radioLabel}>
                  <input
                    type="radio"
                    name="priority"
                    value={p}
                    checked={formData.priority === p}
                    onChange={handleChange}
                  />
                  <span>{p}</span>
                </label>
              ))}
            </div>
          </div>

          <div className={styles.formGroup}>
            <label>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className={styles.textarea}
              rows="6"
              required
            />
          </div>

          <div className={styles.formActions}>
            <button type="submit" className={styles.saveButton}>
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTaskModal;
