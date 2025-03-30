import React, { useState } from 'react';
import styles from '../style/loginStyle.module.css';
import { FaUser, FaLock } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import loginPageImage from '../img/loginpage.png';
import { Link, } from 'react-router-dom';
import { handleLogin } from '../store/authSlice';
import { useDispatch } from 'react-redux';

const Login = () => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(handleLogin({ phoneNumber: formData.username, password: formData.password }))
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginLeft}>
        <h3>Car Comparison</h3>
        <h1>Login</h1>
        <hr />
        <p>Please Enter Your Login And Password</p>

        <form onSubmit={handleSubmit}>
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
            Log In
          </button>
          <button type="submit" className={styles.googleBtn}>
            <FcGoogle className={styles.googleIcon} /> Or, sign-in with Google
          </button>
        </form>

        <p className={styles.footerText}>
          Not a member yet? <Link to="/signin">Register!</Link>
        </p>
      </div>

      <div className={styles.loginRight}>
        <img src={loginPageImage} alt="Porsche 911 GT3 RS" className={styles.carImage} />
      </div>
    </div>
  );
};

export default Login;
