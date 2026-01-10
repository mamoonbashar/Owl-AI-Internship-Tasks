import React, { useState } from "react";
import styles from "../styles/EditUser.module.css";

const Settings = ({ onBack }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    contactNumber: "",
    position: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdateInfo = (e) => {
    e.preventDefault();
    console.log("Updated info:", formData);
  };

  const handleChangePassword = () => {
    console.log("Change password clicked");
  };

  return (
    <div className={styles.settingsWrapper}>
      <div className={styles.settingsCard}>
        <div className={styles.cardHeader}>
          <h2>Account Information</h2>
          <button className={styles.backButton} onClick={onBack}>
            Go Back
          </button>
        </div>

        <div className={styles.profileSection}>
          <div className={styles.profileAvatar}>
            <img
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop"
              alt="Profile"
            />
          </div>
          <div className={styles.profileDetails}>
            <h3>Sachin Vadhal</h3>
            <p>sachinvadhal@gmail.com</p>
          </div>
        </div>

        <form onSubmit={handleUpdateInfo} className={styles.accountForm}>
          <div className={styles.inputGroup}>
            <label>First Name</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className={styles.inputField}
            />
          </div>

          <div className={styles.inputGroup}>
            <label>Last Name</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className={styles.inputField}
            />
          </div>

          <div className={styles.inputGroup}>
            <label>Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={styles.inputField}
            />
          </div>

          <div className={styles.inputGroup}>
            <label>Contact Number</label>
            <input
              type="tel"
              name="contactNumber"
              value={formData.contactNumber}
              onChange={handleChange}
              className={styles.inputField}
            />
          </div>

          <div className={styles.inputGroup}>
            <label>Position</label>
            <input
              type="text"
              name="position"
              value={formData.position}
              onChange={handleChange}
              className={styles.inputField}
            />
          </div>

          <div className={styles.buttonGroup}>
            <button type="submit" className={styles.btnUpdate}>
              Update Info
            </button>
            <button
              type="button"
              className={styles.btnPassword}
              onClick={handleChangePassword}
            >
              Change Password
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Settings;
