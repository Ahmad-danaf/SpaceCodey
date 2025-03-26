import React, { useState, useCallback } from "react";
import axios from "axios";
import styled from "styled-components";
import OptimalShootForm, { FormType } from "../../components/forms/OptimalShootForm";
import OptimalShootResults, {
  OptimalTimesResponse,
} from "../../components/OptimalShootResults/OptimalShootResults";
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

const InfoParagraph = styled.p`
  color: #d1d5db;
  text-align: center;
  max-width: 800px;
  margin: 0 auto 1.5rem;
  line-height: 1.6;
  font-size: 1.1rem;

  .weather-link {
    color: #00d1ff;
    text-decoration: underline;
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

const OptimalShootTimes: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState<FormType | null>(null);
  const [results, setResults] = useState<OptimalTimesResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchOptimalTimes = useCallback(async (data: FormType) => {
    setLoading(true);
    setError(null);
    setFormData(data);

    try {
      // Build query parameters
      const params = new URLSearchParams();
      if (data.city) params.append("city", data.city);
      if (data.latitude !== undefined)
        params.append("latitude", data.latitude.toString());
      if (data.longitude !== undefined)
        params.append("longitude", data.longitude.toString());
      params.append("start_date", data.start_date);
      params.append("start_time", data.start_time);
      params.append("duration", data.duration.toString());

      const response = await axios.get<OptimalTimesResponse>(
        `${API_BASE_URL}/events/optimal-times/`,
        {
          params,
          headers: {
            "x-api-key": apiKey,
          },
        }
      );

      setResults(response.data);
    } catch (err) {
      console.error("Error fetching optimal times:", err);
      if (axios.isAxiosError(err) && err.response) {
        setError(
          `Error: ${
            err.response.data.detail || "Failed to fetch optimal times"
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
  }, []);

  const dismissError = () => {
    setError(null);
  };

  return (
    <PageContainer>
      <PageTitle>Astrophotography Optimal Shoot Times</PageTitle>
      <PageDescription>
      Find the best times for astrophotography in your area based on calculated astronomical conditions
      like moonrise and moonset times, sunset and sunrise times, and astronomical twilight. 
      Plan your perfect night shoot with precision using these calculated factors.
      </PageDescription>
      <InfoParagraph>
        For weather forecasts, check the{" "}
        <a className="weather-link" href="/weather">
          weather forecast
        </a>
        .
      </InfoParagraph>
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
        <AstronomyLoader />
      ) : results ? (
        <OptimalShootResults data={results} onRecalculate={handleRecalculate} />
      ) : (
        <OptimalShootForm
          onSubmit={fetchOptimalTimes}
          initialData={formData || undefined}
          loading={loading}
        />
      )}
    </PageContainer>
  );
};

export default OptimalShootTimes;
