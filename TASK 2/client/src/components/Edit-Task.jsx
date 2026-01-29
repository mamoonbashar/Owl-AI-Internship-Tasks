import React, { useState, useEffect } from "react";
import styles from "../styles/EditTask.module.css";

const EditTaskModal = ({ task, isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    title: "",
    dueDate: "",
    priority: "Low",
    status: "pending",
    category: "others",
    description: "",
  });

  // ✅ Update form when task changes or modal opens
  useEffect(() => {
    if (task && isOpen) {
      setFormData({
        title: task.title || "",
        dueDate: task.dueDate || "",
        priority: task.priority || "Low",
        status: task.status || "pending",
        category: task.category || "others",
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
          {/* Title */}
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

          {/* Category */}
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

          {/* Due Date */}
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

          {/* Priority */}
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

          {/* Status */}
          <div className={styles.formGroup}>
            <label>Status</label>
            <div className={styles.radioGroup}>
              <label className={styles.radioLabel}>
                <input
                  type="radio"
                  name="status"
                  value="pending"
                  checked={formData.status === "pending"}
                  onChange={handleChange}
                />
                <span>Pending</span>
              </label>
              <label className={styles.radioLabel}>
                <input
                  type="radio"
                  name="status"
                  value="progress"
                  checked={formData.status === "progress"}
                  onChange={handleChange}
                />
                <span>In Progress</span>
              </label>
              <label className={styles.radioLabel}>
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
