import React from "react";
import styled from "styled-components";
import { BodyInfoFormData } from "../forms/BodyInfoForm";

// Define the detailed position data structure
export interface PositionData {
  date: string;
  id: string;
  name: string;
  distance?: {
    fromEarth: {
      au: string;
      km: string;
    };
  };
  position: {
    horizontal: {
      altitude: {
        degrees: string;
        string: string;
      };
      azimuth: {
        degrees: string;
        string: string;
      };
    };
    horizonal?: {
      altitude: {
        degrees: string;
        string: string;
      };
      azimuth: {
        degrees: string;
        string: string;
      };
    };
    equatorial: {
      rightAscension: {
        hours: string;
        string: string;
      };
      declination: {
        degrees: string;
        string: string;
      };
    };
    constellation: {
      id: string;
      short: string;
      name: string;
    };
  };
  extraInfo?: {
    elongation: number;
    magnitude: number;
    phase?: {
      angel: string;
      fraction: string;
      string: string;
    };
  };
}

// Define the structure of body position row
export interface BodyPosition {
  entry: {
    id: string;
    name: string;
  };
  cells: PositionData[];
}

// Define the complete API response structure
export interface BodyInfoResponse {
  body: string;
  positions: {
    data: {
      table: {
        rows: BodyPosition[];
      };
    };
  };
  events: {
    data: {
      dates: {
        from: string;
        to: string;
      };
      observer: {
        location: {
          longitude: number;
          latitude: number;
          elevation: number;
        };
      };
      table: {
        header: any[];
        rows: Array<{
          entry: {
            id: string;
            name: string;
          };
          cells: any[];
        }>;
      };
    };
  };
  latitude: string;
  longitude: string;
  elevation: string;
  from_date: string;
  to_date: string;
  time: string;
}

interface BodyInfoResultsProps {
  data: BodyInfoResponse;
  onRecalculate: () => void;
}

const ResultsContainer = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 900px;
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

const BodyInfoSection = styled.div`
  background-color: #1f2937;
  padding: 1.5rem;
  border-radius: 8px;
  margin-bottom: 2rem;
  border-left: 4px solid #3e92cc;
`;

const SectionTitle = styled.h3`
  color: #ececec;
  font-size: 1.2rem;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;

  &:before {
    content: "★";
    margin-right: 0.75rem;
    color: #3e92cc;
    font-size: 1.2rem;
  }
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
  margin-top: 1.5rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const InfoCard = styled.div`
  background-color: #111827;
  padding: 1.25rem;
  border-radius: 8px;
  transition: all 0.3s ease;
  border: 1px solid #1f2937;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
    border-color: #3e92cc;
  }
`;

const CardTitle = styled.h4`
  color: #ececec;
  font-size: 1.1rem;
  margin-bottom: 0.75rem;
  text-transform: capitalize;
`;

const InfoItem = styled.div`
  margin-bottom: 0.75rem;

  &:last-child {
    margin-bottom: 0;
  }
`;

const InfoLabel = styled.span`
  display: block;
  color: #9ca3af;
  font-size: 0.85rem;
  margin-bottom: 0.25rem;
`;

const InfoValue = styled.span`
  color: #ececec;
  font-size: 0.95rem;
  font-weight: 500;
`;

const CoordinatesSection = styled.div`
  background-color: #1f2937;
  padding: 1.25rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
`;

const CoordinatesTitle = styled.h3`
  color: #ececec;
  font-size: 1.1rem;
  margin-bottom: 0.75rem;
`;

const CoordinatesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
`;

const CoordinateItem = styled.div`
  padding: 0.75rem;
  background-color: #111827;
  border-radius: 6px;
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

const NoDataMessage = styled.div`
  text-align: center;
  padding: 2rem;
  color: #d1d5db;
  font-style: italic;
`;

const TimeframeInfo = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1.5rem;

  @media (max-width: 640px) {
    flex-direction: column;
  }
`;

const TimeframeItem = styled.div`
  background-color: #1f2937;
  padding: 0.75rem 1rem;
  border-radius: 6px;
  display: flex;
  align-items: center;
  flex: 1;
  min-width: 200px;

  svg {
    margin-right: 0.75rem;
    color: #3e92cc;
  }
`;

const TimeframeText = styled.div`
  display: flex;
  flex-direction: column;
`;

const TimeframeLabel = styled.span`
  font-size: 0.8rem;
  color: #9ca3af;
`;

const TimeframeValue = styled.span`
  font-size: 0.95rem;
  color: #ececec;
`;

const EventsList = styled.ul`
  list-style-type: none;
  padding: 0;
  margin: 1rem 0;
`;

const EventItem = styled.li`
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
    content: "⊕";
    margin-right: 0.75rem;
    color: #3e92cc;
    font-size: 1.2rem;
  }
`;

// Function to capitalize the first letter of each word
const capitalize = (str: string): string => {
  return str
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

const BodyInfoResults: React.FC<BodyInfoResultsProps> = ({
  data,
  onRecalculate,
}) => {
  const {
    body,
    positions,
    events,
    latitude,
    longitude,
    elevation,
    from_date,
    to_date,
    time,
  } = data;

  // Extract position rows and cells from the new structure
  const positionRows = positions?.data?.table?.rows || [];
  const positionData = positionRows.length > 0 ? positionRows[0].cells : [];

  return (
    <ResultsContainer>
      <ResultsTitle>{capitalize(body)} Information</ResultsTitle>

      <TimeframeInfo>
        <TimeframeItem>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
          </svg>
          <TimeframeText>
            <TimeframeLabel>From</TimeframeLabel>
            <TimeframeValue>{from_date}</TimeframeValue>
          </TimeframeText>
        </TimeframeItem>

        <TimeframeItem>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
          </svg>
          <TimeframeText>
            <TimeframeLabel>To</TimeframeLabel>
            <TimeframeValue>{to_date}</TimeframeValue>
          </TimeframeText>
        </TimeframeItem>

        <TimeframeItem>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 6 12 12 16 14"></polyline>
          </svg>
          <TimeframeText>
            <TimeframeLabel>Time</TimeframeLabel>
            <TimeframeValue>{time}</TimeframeValue>
          </TimeframeText>
        </TimeframeItem>
      </TimeframeInfo>

      <CoordinatesSection>
        <CoordinatesTitle>Location Information</CoordinatesTitle>
        <CoordinatesGrid>
          <CoordinateItem>
            <InfoLabel>Latitude</InfoLabel>
            <InfoValue>{latitude}°</InfoValue>
          </CoordinateItem>
          <CoordinateItem>
            <InfoLabel>Longitude</InfoLabel>
            <InfoValue>{longitude}°</InfoValue>
          </CoordinateItem>
          <CoordinateItem>
            <InfoLabel>Elevation</InfoLabel>
            <InfoValue>{elevation} meters</InfoValue>
          </CoordinateItem>
        </CoordinatesGrid>
      </CoordinatesSection>

      <BodyInfoSection>
        <SectionTitle>{capitalize(body)} Positions</SectionTitle>

        {positionData.length > 0 ? (
          <InfoGrid>
            {positionData.map((cell, index) => (
              <InfoCard key={index}>
                <CardTitle>
                  {new Date(cell.date).toLocaleDateString()}
                </CardTitle>

                <InfoItem>
                  <InfoLabel>Right Ascension</InfoLabel>
                  <InfoValue>
                    {cell.position.equatorial.rightAscension.string}
                  </InfoValue>
                </InfoItem>

                <InfoItem>
                  <InfoLabel>Declination</InfoLabel>
                  <InfoValue>
                    {cell.position.equatorial.declination.string}
                  </InfoValue>
                </InfoItem>

                <InfoItem>
                  <InfoLabel>Azimuth</InfoLabel>
                  <InfoValue>
                    {cell.position.horizontal.azimuth.string}
                  </InfoValue>
                </InfoItem>

                <InfoItem>
                  <InfoLabel>Altitude</InfoLabel>
                  <InfoValue>
                    {cell.position.horizontal.altitude.string}
                  </InfoValue>
                </InfoItem>

                <InfoItem>
                  <InfoLabel>Constellation</InfoLabel>
                  <InfoValue>{cell.position.constellation.name}</InfoValue>
                </InfoItem>

                {cell.distance && (
                  <InfoItem>
                    <InfoLabel>Distance from Earth</InfoLabel>
                    <InfoValue>{cell.distance.fromEarth.km} km</InfoValue>
                  </InfoItem>
                )}

                {cell.extraInfo?.phase && (
                  <InfoItem>
                    <InfoLabel>Phase</InfoLabel>
                    <InfoValue>
                      {cell.extraInfo.phase.string} (
                      {cell.extraInfo.phase.fraction})
                    </InfoValue>
                  </InfoItem>
                )}

                {cell.extraInfo?.magnitude !== undefined && (
                  <InfoItem>
                    <InfoLabel>Magnitude</InfoLabel>
                    <InfoValue>{cell.extraInfo.magnitude.toFixed(2)}</InfoValue>
                  </InfoItem>
                )}
              </InfoCard>
            ))}
          </InfoGrid>
        ) : (
          <NoDataMessage>
            No position data available for {body} in the specified timeframe.
          </NoDataMessage>
        )}
      </BodyInfoSection>

      {events &&
        events.data &&
        events.data.table &&
        events.data.table.rows &&
        events.data.table.rows.length > 0 && (
          <BodyInfoSection>
            <SectionTitle>{capitalize(body)} Events</SectionTitle>
            {events.data.table.rows[0].cells.length > 0 ? (
              <EventsList>
                {events.data.table.rows[0].cells.map((event, index) => (
                  <EventItem key={index}>
                    {typeof event === "string" ? event : JSON.stringify(event)}
                  </EventItem>
                ))}
              </EventsList>
            ) : (
              <NoDataMessage>
                No events available for {body} in the specified timeframe.
              </NoDataMessage>
            )}
          </BodyInfoSection>
        )}

      <RecalculateButton onClick={onRecalculate}>New Search</RecalculateButton>
    </ResultsContainer>
  );
};

export default BodyInfoResults;
