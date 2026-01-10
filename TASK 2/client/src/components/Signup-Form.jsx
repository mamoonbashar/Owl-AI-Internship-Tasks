import React, { useState } from "react";
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
  const [error, setError] = useState("");

  // 1. Create the state for your inputs
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  // 2. Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Stop page reload
    try {
      // 3. Use /api prefix so Vite proxy catches it
      const { status } = await API.post("/api/user/register", formData);
      if (status === 200) navigate("/home");
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <section className={Style.signUpContainer}>
      <section className={Style.illustrationContainer}>
        <img src={Illustration} className={Style.image} alt="illustration" />
      </section>

      {/* 4. Added onSubmit here */}
      <form className={Style.formContainer} onSubmit={handleSubmit}>
        <h2>Sign Up</h2>
        {error && <p style={{ color: "red", fontSize: "12px" }}>{error}</p>}

        <div className={Style.inputFieldContainer}>
          <img src={UserIcon} alt="username" />
          <input
            name="Username" // Added name attribute
            type="text"
            placeholder="Username"
            onChange={handleChange} // Connected to state
            required
          />
        </div>

        <div className={Style.inputFieldContainer}>
          <img src={EmailIcon} alt="email" />
          <input
            name="email" // Added name attribute
            type="email"
            placeholder="Email"
            onChange={handleChange} // Connected to state
            required
          />
        </div>

        <div className={Style.inputFieldContainer}>
          <img src={PasswordIcon} alt="password" />
          <input
            name="password" // Added name attribute
            type="password"
            placeholder="Password"
            onChange={handleChange} // Connected to state
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
