import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Register.module.css";

const API_BASE_URL =
  import.meta.env.VITE_DEBUG_MODE == "development"
    ? import.meta.env.VITE_DEV_API_BASE_URL
    : import.meta.env.VITE_PROD_API_BASE_URL;

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false); // Loading state

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    // Validate passwords
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsLoading(true); // Start loading

    try {
      const apiKey = import.meta.env.VITE_X_API_KEY;

      const response = await fetch(`${API_BASE_URL}/account/register/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey || "", 
        },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage =
          errorData[Object.keys(errorData)[0]] || "An error occurred.";
        throw new Error(errorMessage);
      }

      const data = await response.json();
      setSuccessMessage(data.message); // Show success message
      setTimeout(() => navigate("/login"), 3000); // Redirect to login after success
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  return (
    <div className="register-container">
      <form onSubmit={handleSubmit} className="register-form">
        <h2>Register</h2>
        {error && <p className="error-message">{error}</p>}
        {successMessage && <p className="success-message">{successMessage}</p>}
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary" disabled={isLoading}>
          {isLoading ? "Registering..." : "Register"}
        </button>
        <p>
          Already have an account? <a href="/login">Login</a>
        </p>
      </form>
    </div>
  );
};

export default Register;
