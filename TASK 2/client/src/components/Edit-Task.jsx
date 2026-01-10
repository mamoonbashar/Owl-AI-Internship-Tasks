import React, { useState } from "react";
import styles from "../styles/EditTask.module.css";

const EditTaskModal = ({ task, isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    title: task?.title || "",
    date: task?.dueDate || "",
    priority: task?.priority || "Low",
    description: task?.fullDescription || "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    onClose();
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
            <label htmlFor="title">Title</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className={styles.input}
              placeholder="Enter task title"
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="date">Date</label>
            <input
              type="date"
              id="date"
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
              <label className={styles.radioLabel}>
                <input
                  type="radio"
                  name="priority"
                  value="Low"
                  checked={formData.priority === "Low"}
                  onChange={handleChange}
                />
                <span>Low</span>
              </label>
              <label className={styles.radioLabel}>
                <input
                  type="radio"
                  name="priority"
                  value="Moderate"
                  checked={formData.priority === "Moderate"}
                  onChange={handleChange}
                />
                <span>Moderate</span>
              </label>
              <label className={styles.radioLabel}>
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

          <div className={styles.formGroup}>
            <label htmlFor="description">Task Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className={styles.textarea}
              placeholder="Add a more detailed description..."
              rows="6"
              required
            />
          </div>

          <div className={styles.formActions}>
            <button type="submit" className={styles.saveButton}>
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTaskModal;
