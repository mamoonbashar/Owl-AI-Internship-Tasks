import React from "react";
import Style from "../styles/Sign-up.module.css";
import Illustration from "../assets/images/R 2.png";
import UserIcon from "../assets/icons/SignUp-icons/mdi_user.png";
import EmailIcon from "../assets/icons/SignUp-icons/email.png";
import PasswordIcon from "../assets/icons/SignUp-icons/mdi_password.png";
import Button from "./Button";

const SignUpForm = () => {
  return (
    <section className={Style.signUpContainer}>
      {/* Illustration Side */}
      <section className={Style.illustrationContainer}>
        <img src={Illustration} className={Style.image} />
      </section>

      {/* Main Form Side */}
      <form className={Style.formContainer}>
        <h2>Sign Up</h2>
        <div className={Style.inputFieldContainer}>
          <img src={UserIcon} alt="username" />
          <input type="text" placeholder="First Name" required />
        </div>

        <div className={Style.inputFieldContainer}>
          <img src={EmailIcon} alt="email" />
          <input type="text" placeholder="Email" required />
        </div>

        <div className={Style.inputFieldContainer}>
          <img src={PasswordIcon} alt="password" />
          <input type="email" placeholder="Password" required />
        </div>

        <section className={Style.agreementContainer}>
          <label className={Style.checkboxLabel}>
            <input type="checkbox" required />
            <span>I agree to all terms</span>
          </label>
        </section>

        <section className={Style.btnRegisterContainer}>
          <Button type="submit" className={Style.registerButton}>
            Register
          </Button>
        </section>
      </form>
    </section>
  );
};

export default SignUpForm;
