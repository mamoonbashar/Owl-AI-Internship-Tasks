import React, { useState, useRef } from "react";
import Style from "../styles/Sign-up.module.css";
import API from "../api/axiosInstance.js";
import Illustration from "../assets/images/R 2.png";
import UserIcon from "../assets/icons/SignUp-icons/mdi_user.png";
import EmailIcon from "../assets/icons/SignUp-icons/email.png";
import PasswordIcon from "../assets/icons/SignUp-icons/mdi_password.png";
import Button from "./Button";
import { Link, useNavigate } from "react-router-dom";

const SignUpForm = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    Username: "",
    email: "",
    password: "",
    profileImage: "",
  });

  // Handle text input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Trigger hidden file input when circle is clicked
  const handleCircleClick = () => {
    fileInputRef.current.click();
  };

  // Convert uploaded file to Base64 string for the DB
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setError("Image size should be less than 2MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, profileImage: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { status } = await API.post("/api/user/register", formData);
      if (status === 200 || status === 201) {
        navigate("/");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <section className={Style.signUpContainer}>
      <section className={Style.illustrationContainer}>
        <img src={Illustration} className={Style.image} alt="illustration" />
      </section>

      <form className={Style.formContainer} onSubmit={handleSubmit}>
        <h2>Sign Up</h2>
        {error && <p className={Style.errorMessage}>{error}</p>}

        {/* --- Interactive Profile Upload --- */}
        <div className={Style.profileUploadWrapper}>
          <div
            className={Style.imageCircle}
            onClick={handleCircleClick}
            title="Click to upload"
          >
            <img
              src={
                formData.profileImage ||
                `https://ui-avatars.com/api/?name=${formData.Username || "User"}&background=f56565&color=fff`
              }
              alt="Profile Preview"
            />
            <div className={Style.overlay}>
              <span>Upload</span>
            </div>
          </div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            style={{ display: "none" }}
          />
        </div>

        <div className={Style.inputFieldContainer}>
          <img src={UserIcon} alt="username" />
          <input
            name="Username"
            type="text"
            placeholder="Username"
            onChange={handleChange}
            required
          />
        </div>

        <div className={Style.inputFieldContainer}>
          <img src={EmailIcon} alt="email" />
          <input
            name="email"
            type="email"
            placeholder="Email"
            onChange={handleChange}
            required
          />
        </div>

        <div className={Style.inputFieldContainer}>
          <img src={PasswordIcon} alt="password" />
          <input
            name="password"
            type="password"
            placeholder="Password"
            onChange={handleChange}
            required
          />
        </div>

        <section className={Style.btnRegisterContainer}>
          <Button type="submit" className={Style.registerButton}>
            Register
          </Button>
        </section>

        <p className={Style.footerText}>
          Already have an account?{" "}
          <Link to="/" className={Style.linkText}>
            Login
          </Link>
        </p>
      </form>
    </section>
  );
};

export default SignUpForm;
