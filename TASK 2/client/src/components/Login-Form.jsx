import React, { useState } from "react";
import Style from "../styles/Login.module.css";
import Button from "./Button";
import loginIllustration from "../assets/images/ach3 1.svg";
import UserIcon from "../assets/icons/SignUp-icons/mdi_user.png";
import PasswordIcon from "../assets/icons/SignUp-icons/mdi_password.png";
import { Link, useNavigate } from "react-router-dom";
import API from "../api/axiosInstance";

const SignInForm = () => {
  const navigate = useNavigate();
  const [err, setErr] = useState("");
  const [FormData, setForm] = useState({
    email: "",
    password: "",
  });
  const handleChange = (e) => {
    setForm({ ...FormData, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { status } = await API.post("/api/user/login", FormData);
      if (status === 200) navigate("/home");
    } catch (err) {
      setErr(err.response?.data?.Error || "Databse connection Failed");
    }
  };
  return (
    <section className={Style.signUpContainer}>
      {/* Main Form Side (Left) */}
      <div className={Style.formContainer}>
        <h2 className={Style.title}>Sign In</h2>
        {err && <p style={{ color: "red", fontSize: "12px" }}>{err}</p>}

        <form className={Style.Form} onSubmit={handleSubmit}>
          <div className={Style.inputFieldContainer}>
            <img src={UserIcon} alt="user" />
            <input
              type="text"
              name="email"
              placeholder="Enter Eamil"
              required
              onChange={handleChange}
            />
          </div>

          <div className={Style.inputFieldContainer}>
            <img src={PasswordIcon} alt="password" />
            <input
              type="password"
              name="password"
              placeholder="Enter Password"
              onChange={handleChange}
              required
            />
          </div>

          <div className={Style.rememberMeContainer}>
            <label className={Style.checkboxLabel}>
              <input type="checkbox" />
              <span>Remember Me</span>
            </label>
          </div>

          <section className={Style.btnRegisterContainer}>
            <Button type="submit" className={Style.LoginButton}>
              Login
            </Button>
          </section>
        </form>

        {/* <div className={Style.socialLoginSection}>
          <p>Or, Login with</p>
          <div className={Style.socialIcons}>
            <img src="/facebook.png" alt="FB" />
            <img src="/google.png" alt="G" />
            <img src="/x-icon.png" alt="X" />
          </div>
        </div> */}

        <p className={Style.footerText}>
          Don't have an account?
          <Link to="/SignUp" className={Style.linkText}>
            Create One
          </Link>
        </p>
      </div>

      {/* Illustration Side (Right - Blank for now) */}
      <section className={Style.illustrationContainer}>
        {/* Placeholder for your illustration */}
        <img src={loginIllustration} alt="logo" />
      </section>
    </section>
  );
};

export default SignInForm;
