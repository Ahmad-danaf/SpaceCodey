import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./ActivateAccount.module.css";

const API_BASE_URL =
  import.meta.env.VITE_DEBUG_MODE === "development"
    ? import.meta.env.VITE_DEV_API_BASE_URL
    : import.meta.env.VITE_PROD_API_BASE_URL;

const ActivateAccount: React.FC = () => {
  const { uidb64, token } = useParams<{ uidb64: string; token: string }>();
  const navigate = useNavigate();
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Loading state

  useEffect(() => {
    const activateAccount = async () => {
      if (!uidb64 || !token) {
        setError("Invalid activation link.");
        setIsLoading(false);
        return;
      }

      try {
        const apiKey = import.meta.env.VITE_X_API_KEY;

        const response = await fetch(`${API_BASE_URL}/account/activate/${uidb64}/${token}/`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": apiKey || "",
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to activate account.");
        }

        const data = await response.json();
        setMessage(data.message || "Your account has been successfully activated.");
        setTimeout(() => navigate("/login"), 5000); // Redirect to login page after success
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setIsLoading(false);
      }
    };

    activateAccount();
  }, [uidb64, token, navigate]);

  return (
    <div className="activate-container">
      {isLoading ? (
        <p className="loading-message">Activating your account...</p>
      ) : error ? (
        <div className="error-message">
          <p>{error}</p>
          <p>
            Please try again or <a href="/resend-verification">resend the verification email</a>.
          </p>
        </div>
      ) : (
        <div className="success-message">
          <p>{message}</p>
          <p>You will be redirected to the login page shortly.</p>
        </div>
      )}
    </div>
  );
};

export default ActivateAccount;
