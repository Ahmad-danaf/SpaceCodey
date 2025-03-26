import React from "react";
import styled from "styled-components";

export interface OptimalTimesResponse {
  optimal_times: string[];
  city: string;
  latitude: number;
  longitude: number;
}

interface OptimalShootResultsProps {
  data: OptimalTimesResponse;
  onRecalculate: () => void;
}

const ResultsContainer = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 700px;
  width: 100%;
  background-color: #111827;
  padding: 2rem;
  border-radius: 12px;
  margin: 2rem auto;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  animation: fadeIn 0.5s ease-in-out;

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const ResultsTitle = styled.h2`
  color: #fff;
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
  text-align: center;
`;

const LocationInfo = styled.div`
  background-color: #1f2937;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  border-left: 4px solid #3e92cc;
`;

const LocationTitle = styled.h3`
  color: #ececec;
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
`;

const LocationDetail = styled.p`
  color: #d1d5db;
  margin: 0.3rem 0;
  font-size: 0.95rem;

  strong {
    color: #ececec;
    font-weight: 500;
  }
`;

const TimesSection = styled.div`
  margin-top: 1rem;
`;

const TimesList = styled.ul`
  list-style-type: none;
  padding: 0;
  margin: 1rem 0;
`;

const TimeItem = styled.li`
  background-color: #1f2937;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 0.75rem;
  color: #ececec;
  display: flex;
  align-items: center;
  transition: all 0.2s ease;

  &:hover {
    transform: translateX(5px);
    background-color: #2d3748;
  }

  &:before {
    content: "★";
    margin-right: 0.75rem;
    color: #3e92cc;
    font-size: 1.2rem;
  }
`;

const RecalculateButton = styled.button`
  background: linear-gradient(45deg, #0a2463, #3e92cc);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 1.5rem;
  align-self: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
  }
`;

const NoTimesMessage = styled.div`
  text-align: center;
  padding: 2rem;
  color: #d1d5db;
  font-style: italic;
`;

const OptimalShootResults: React.FC<OptimalShootResultsProps> = ({
  data,
  onRecalculate,
}) => {
  const { optimal_times, city, latitude, longitude } = data;

  return (
    <ResultsContainer>
      <ResultsTitle>Optimal Astrophotography Times</ResultsTitle>

      <LocationInfo>
        <LocationTitle>Location Information</LocationTitle>
        {city && (
          <LocationDetail>
            <strong>City:</strong> {city}
          </LocationDetail>
        )}
        <LocationDetail>
          <strong>Coordinates:</strong> {latitude.toFixed(6)},{" "}
          {longitude.toFixed(6)}
        </LocationDetail>
      </LocationInfo>

      <TimesSection>
        <LocationTitle>Recommended Shooting Times</LocationTitle>

        {optimal_times && optimal_times.length > 0 ? (
          <TimesList>
            {optimal_times.map((time, index) => (
              <TimeItem key={index}>{time}</TimeItem>
            ))}
          </TimesList>
        ) : (
          <NoTimesMessage>
            No optimal times found for the specified location and timeframe. Try
            adjusting your parameters or selecting a different date.
          </NoTimesMessage>
        )}
      </TimesSection>

      <RecalculateButton onClick={onRecalculate}>
        New Calculation
      </RecalculateButton>
    </ResultsContainer>
  );
};

export default OptimalShootResults;
