// src/components/Auth/Login.js

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaEnvelope, FaLock } from 'react-icons/fa';
import styles from './AuthForm.module.css';
import toast from 'react-hot-toast';
import axios from 'axios';

const Login = () => {
  const [formData, setFormData] = useState({
    username: '',   // use username (backend expects this)
    password: '',
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:5000/api/login", formData);

      if (response.status === 200) {
        const { role, username } = response.data;

        // Save auth info
        localStorage.setItem("authToken", "dummy-token"); // can be replaced by JWT later
        localStorage.setItem("role", role);
        localStorage.setItem("username", username);

        toast.success("Login successful!");

        // Redirect based on role
        if (role === "admin") {
          navigate("/bulk-upload");
        } else {
          navigate("/dashboard");
        }
      }
    } catch (error) {
      console.error("Login error:", error);
      const msg = error.response?.data?.error || "Login failed. Try again.";
      toast.error(msg);
    }
  };

  return (
    <div className={styles.authContainer}>
      <div className={`${styles.authCard} ${styles.fadeIn}`}>
        <h2 className={styles.title}>Welcome Back</h2>
        <p className={styles.subtitle}>Please enter your credentials to log in.</p>
        
        <form onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <FaEnvelope className={styles.inputIcon} />
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>
          <div className={styles.inputGroup}>
            <FaLock className={styles.inputIcon} />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className={styles.submitButton}>
            Log In
          </button>
        </form>

        <p className={styles.redirectText}>
          Don't have an account? <Link to="/register">Sign Up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
