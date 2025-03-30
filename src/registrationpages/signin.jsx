import React, { useState } from "react";
import { FaUser, FaLock, FaUserCheck } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import styles from "../style/loginStyle.module.css";
import carImage from "../img/dodge.png";
import { Link } from "react-router-dom";
import { handleRegister } from "../store/authSlice";
import { useDispatch } from "react-redux";

const Signin = () => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(handleRegister({ phoneNumber: formData.username, password: formData.username, fullName: formData.fullName }))
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginLeft}>
        <h3>Car Comparison</h3>
        <h1>Sign Up</h1>
        <hr />
        <p>Please Enter Your Login And Password</p>

        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <FaUserCheck className={styles.icon} />
            <input
              type="text"
              name="fullName"
              placeholder="Full Name"
              value={formData.fullName}
              onChange={handleChange}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <FaUser className={styles.icon} />
            <input
              type="text"
              name="username"
              placeholder="Username Or Email"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <FaLock className={styles.icon} />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className={styles.loginBtn}>
            Sign up
          </button>
          <button type="button" className={styles.googleBtn}>
            <FcGoogle className={styles.googleIcon} /> Or, sign-up with Google
          </button>
        </form>

        <p className={styles.footerText}>
          Already have an account? <Link to="/login">Log in!</Link>
        </p>
      </div>

      <div className={styles.loginRight}>
        <img src={carImage} alt="Dodge Challenger SRT" className={styles.carImage} />
      </div>
    </div>
  );
};

export default Signin;
