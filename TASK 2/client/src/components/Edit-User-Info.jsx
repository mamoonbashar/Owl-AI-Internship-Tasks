import React, { useState, useEffect } from "react";
import styles from "../styles/EditUser.module.css";
import API from "../api/axiosInstance";

const Settings = ({ onBack, setUserData }) => {
  // --- RESTORED MISSING STATES ---
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [formData, setFormData] = useState({
    Username: "",
    email: "",
    profile: "",
  });

  // Fetch initial details on mount
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await API.get("/api/user/userDetails");
        if (data.success) {
          setFormData({
            Username: data.user.username,
            email: data.user.email,
            profile: data.user.profile || "",
          });
        }
      } catch (err) {
        console.error("Error fetching settings:", err);
      }
    };
    fetchUser();
  }, []);

  // --- RESTORED MISSING CHANGE HANDLER ---
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdateInfo = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      // Check backend: if you used router.patch use .patch, if .put use .put
      const { data } = await API.patch("/api/user/editUser", formData);

      if (data.success) {
        setMessage({ type: "success", text: "Profile updated successfully!" });

        // Update Sidebar in Home.jsx immediately
        setUserData({
          username: data.user.username,
          email: data.user.email,
          profile: data.user.profile,
        });
      }
    } catch (err) {
      setMessage({
        type: "error",
        text: err.response?.data?.message || "Failed to update profile",
      });
    } finally {
      setLoading(false);
    }
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

        {/* Message Display */}
        {message.text && (
          <div
            className={
              message.type === "success" ? styles.successMsg : styles.errorMsg
            }
          >
            {message.text}
          </div>
        )}

        <div className={styles.profileSection}>
          <div className={styles.profileAvatar}>
            <img
              src={
                formData.profile ||
                `https://ui-avatars.com/api/?name=${formData.Username}`
              }
              alt="Profile"
              className={styles.avatarCircle}
            />
          </div>
          <div className={styles.profileDetails}>
            <h3>{formData.Username}</h3>
            <p>{formData.email}</p>
          </div>
        </div>

        <form onSubmit={handleUpdateInfo} className={styles.accountForm}>
          <div className={styles.inputGroup}>
            <label>Username</label>
            <input
              type="text"
              name="Username"
              value={formData.Username}
              onChange={handleChange}
              className={styles.inputField}
              required
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
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label>Profile Image URL</label>
            <input
              type="text"
              name="profile"
              value={formData.profile}
              onChange={handleChange}
              placeholder="Paste image link here"
              className={styles.inputField}
            />
          </div>

          <div className={styles.buttonGroup}>
            <button
              type="submit"
              className={styles.btnUpdate}
              disabled={loading}
            >
              {loading ? "Updating..." : "Update Info"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Settings;
