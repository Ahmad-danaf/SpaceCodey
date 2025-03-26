import React, { useState, useCallback } from "react";
import axios from "axios";
import styled from "styled-components";
import BodyInfoForm, {
  BodyInfoFormData,
} from "../../components/forms/BodyInfoForm";
import BodyInfoResults, {
  BodyInfoResponse,
} from "../../components/BodyInfoResults/BodyInfoResults";
import AstronomyLoader from "../../components/AstronomyLoader/AstronomyLoader";

// Use Vite environment variables
const API_BASE_URL =
  import.meta.env.VITE_DEBUG_MODE === "development"
    ? import.meta.env.VITE_DEV_API_BASE_URL
    : import.meta.env.VITE_PROD_API_BASE_URL;

// Get API key from environment variables
const apiKey = import.meta.env.VITE_X_API_KEY;

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem 1rem;
  max-width: 1200px;
  margin: 0 auto;
  min-height: calc(100vh - 200px); /* Adjust based on header/footer size */

  @media (min-width: 768px) {
    padding: 2rem;
  }
`;

const PageTitle = styled.h1`
  color: #fff;
  text-align: center;
  margin-bottom: 2rem;
  font-size: 2rem;

  @media (min-width: 768px) {
    font-size: 2.5rem;
  }
`;

const PageDescription = styled.p`
  color: #d1d5db;
  text-align: center;
  max-width: 800px;
  margin: 0 auto 2rem;
  line-height: 1.6;
  font-size: 1.1rem;
`;

const ErrorContainer = styled.div`
  background-color: rgba(220, 38, 38, 0.1);
  border: 1px solid rgba(220, 38, 38, 0.3);
  border-radius: 8px;
  padding: 1rem;
  margin: 1rem auto;
  max-width: 700px;
  width: 100%;
  color: #ef4444;
  display: flex;
  align-items: center;
  justify-content: space-between;

  svg {
    margin-right: 0.75rem;
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: #ef4444;
  cursor: pointer;
  font-size: 1.2rem;
  padding: 0.25rem;
`;

const BodyInfo: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState<BodyInfoFormData | null>(null);
  const [results, setResults] = useState<BodyInfoResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchBodyInfo = useCallback(async (data: BodyInfoFormData) => {
    setLoading(true);
    setError(null);
    setFormData(data);

    try {
      // Build query parameters
      const params = new URLSearchParams();
      params.append("body", data.body);
      params.append("latitude", data.latitude);
      params.append("longitude", data.longitude);
      params.append("elevation", data.elevation);
      params.append("from_date", data.from_date);
      params.append("to_date", data.to_date);
      params.append("time", data.time);

      const response = await axios.get<BodyInfoResponse>(
        `${API_BASE_URL}/events/body-info/`,
        {
          params,
          headers: {
            "x-api-key": apiKey,
          },
        }
      );

      setResults(response.data);

      // Scroll to results if data is fetched successfully
      setTimeout(() => {
        window.scrollTo({
          top: window.scrollY + 200,
          behavior: "smooth",
        });
      }, 300);
    } catch (err) {
      console.error("Error fetching body info:", err);
      if (axios.isAxiosError(err) && err.response) {
        setError(
          `Error: ${
            err.response.data.detail ||
            "Failed to fetch celestial body information"
          }`
        );
      } else {
        setError("An unexpected error occurred. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const handleRecalculate = useCallback(() => {
    setResults(null);

    // Scroll back to form
    setTimeout(() => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }, 100);
  }, []);

  const dismissError = () => {
    setError(null);
  };

  return (
    <PageContainer>
      <PageTitle>Celestial Body Information</PageTitle>
      <PageDescription>
        Explore detailed information about celestial bodies including position
        data, visibility times, and astronomical events. View data for the Sun,
        Moon, planets, and other objects based on your location and timeframe.
      </PageDescription>

      {error && (
        <ErrorContainer>
          <div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            {error}
          </div>
          <CloseButton onClick={dismissError}>×</CloseButton>
        </ErrorContainer>
      )}

      {loading ? (
        <AstronomyLoader message="Loading celestial body information..." />
      ) : results ? (
        <BodyInfoResults data={results} onRecalculate={handleRecalculate} />
      ) : (
        <BodyInfoForm
          onSubmit={fetchBodyInfo}
          initialData={formData || undefined}
          loading={loading}
        />
      )}
    </PageContainer>
  );
};

export default BodyInfo;
