import React, { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import "./Login.module.css";

const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const API_BASE_URL =
    import.meta.env.VITE_DEBUG_MODE === "development"
      ? import.meta.env.VITE_DEV_API_BASE_URL
      : import.meta.env.VITE_PROD_API_BASE_URL;

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
    setIsLoading(true);

    try {
      const apiKey = import.meta.env.VITE_X_API_KEY;

      const response = await fetch(`${API_BASE_URL}/account/login/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey || "", 
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to log in.");
      }

      const data = await response.json();

      if (!data.token) {
        throw new Error("Login response did not return a token.");
      }

      login(data.token); // Save token using AuthContext

      const redirectPath = location.state?.from || "/";
      navigate(redirectPath); // Redirect to intended page or home
    } catch (err) {
      setError((err as Error).message || "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form">
        <h2>Login</h2>
        {error && <p className="error-message">{error}</p>}
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
        <button type="submit" className="btn btn-primary" disabled={isLoading}>
          {isLoading ? "Logging in..." : "Login"}
        </button>
        <p>
          Don't have an account? <a href="/register">Sign up</a>
        </p>
      </form>
    </div>
  );
};

export default Login;
