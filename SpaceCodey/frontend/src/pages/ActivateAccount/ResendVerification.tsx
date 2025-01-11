import React, { useState } from "react";
import "./ResendVerification.module.css";

const ResendVerification: React.FC = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false); // Loading state

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setIsLoading(true); // Start loading

    try {
      const response = await fetch("/api/account/resend-verification/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": "your_api_key_here", // Replace with your actual API key
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to resend verification email.");
      }

      const data = await response.json();
      setMessage(data.message || "Verification email has been resent successfully.");
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  return (
    <div className="resend-verification-container">
      <form onSubmit={handleSubmit} className="resend-verification-form">
        <h2>Resend Verification Email</h2>
        {error && <p className="error-message">{error}</p>}
        {message && <p className="success-message">{message}</p>}
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary" disabled={isLoading}>
          {isLoading ? "Sending..." : "Resend Email"}
        </button>
      </form>
    </div>
  );
};

export default ResendVerification;
