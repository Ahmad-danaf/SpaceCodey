import React, { useState, useEffect } from "react";
import styled from "styled-components";
import ISSTrackerMap from "../../components/ISSTrackerMap/ISSTrackerMap";
import AstronomyLoader from "../../components/AstronomyLoader/AstronomyLoader";
import "leaflet/dist/leaflet.css";
import "./ISSTracker.css";

interface ISSLocation {
  latitude: number;
  longitude: number;
  altitude?: number;
  velocity?: number;
}

const PageContainer = styled.div`
  width: 100%;
  min-height: 100vh;
  padding: 20px;
  background-color: #1a1a1a;
  color: #fff;

  @media (max-width: 768px) {
    padding: 10px;
  }
`;

const PageTitle = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 20px;
  text-align: center;
  color: #fff;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);

  @media (max-width: 768px) {
    font-size: 1.8rem;
    margin-bottom: 15px;
  }
`;

const SubTitle = styled.p`
  text-align: center;
  color: #aaa;
  margin-bottom: 30px;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;

  @media (max-width: 768px) {
    font-size: 0.9rem;
    margin-bottom: 20px;
  }
`;

const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  max-width: 1400px;
  margin: 0 auto;

  @media (min-width: 992px) {
    flex-direction: row;
  }
`;

const MapWrapper = styled.div`
  flex: 1;
  height: 70vh;
  border-radius: 12px;
  overflow: hidden;

  @media (max-width: 991px) {
    height: 50vh;
  }
`;

const InfoPanel = styled.div`
  width: 100%;
  padding: 20px;
  background-color: #2d2d2d;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;

  @media (min-width: 992px) {
    width: 300px;
  }
`;

const DataCard = styled.div`
  background-color: #3a3a3a;
  border-radius: 10px;
  padding: 15px;
  margin-bottom: 15px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-2px);
  }
`;

const DataLabel = styled.h3`
  font-size: 1rem;
  margin: 0 0 5px 0;
  color: #aaa;
`;

const DataValue = styled.p`
  font-size: 1.5rem;
  margin: 0;
  font-weight: bold;
  color: #fff;
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 20px;
`;

const Button = styled.button`
  background-color: #444;
  color: #fff;
  border: none;
  border-radius: 20px;
  padding: 10px 20px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);

  &:hover {
    background-color: #555;
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }
`;

const RetryButton = styled(Button)`
  margin-top: 20px;
  background-color: #3e92cc;

  &:hover {
    background-color: #2a6fa8;
  }
`;

const LoaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 70vh;
`;

const UpdateInfo = styled.p`
  font-size: 0.8rem;
  color: #888;
  text-align: center;
  margin-top: 20px;
`;

const ISSTracker: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [issLocation, setIssLocation] = useState<ISSLocation | null>(null);
  const [centerISS, setCenterISS] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  // Debug effect to check component lifecycle
  useEffect(() => {
    console.log("ISSTracker mounted");

    // For debugging - set a timeout to disable loading state if it doesn't change
    const debugTimeout = setTimeout(() => {
      if (loading) {
        console.log("Debug timeout fired - forcing loading to false");
        setLoading(false);
      }
    }, 10000); // 10 seconds timeout

    return () => {
      console.log("ISSTracker unmounted");
      clearTimeout(debugTimeout);
    };
  }, [loading]);

  // Function to manually show the map even if loading
  const handleManualLoad = () => {
    console.log("Manual load triggered");
    setLoading(false);
  };

  const handleLocationUpdate = (location: ISSLocation) => {
    console.log("Location update received:", location);
    setIssLocation(location);
    setLastUpdate(new Date());
    if (loading) {
      console.log("Setting loading to false");
      setLoading(false);
    }
  };

  const toggleCenterISS = () => {
    setCenterISS(!centerISS);
  };

  const formatCoordinate = (value: number): string => {
    return value.toFixed(6);
  };

  // Calculate next visible pass (placeholder - would need actual calculation)
  const getNextVisiblePass = (): string => {
    // This would typically use calculations based on observer location
    // For now, return a placeholder
    return "Visibility data not available";
  };

  return (
    <PageContainer>
      <PageTitle>ISS Live Tracker</PageTitle>
      <SubTitle>
        Track the International Space Station as it orbits the Earth at
        approximately 28,000 km/h at an altitude of about 400 kilometers. The
        ISS completes 15.5 orbits per day and is the largest human-made object
        in low Earth orbit.
      </SubTitle>

      <ContentContainer>
        <MapWrapper>
          {loading ? (
            <LoaderContainer>
              <AstronomyLoader text="Locating ISS..." />
              <RetryButton onClick={handleManualLoad}>View Map Now</RetryButton>
            </LoaderContainer>
          ) : (
            <ISSTrackerMap
              onLocationUpdate={handleLocationUpdate}
              centerISS={centerISS}
            />
          )}
        </MapWrapper>

        <InfoPanel>
          <ButtonContainer>
            <Button onClick={toggleCenterISS}>
              {centerISS ? "Free Map Movement" : "Center on ISS"}
            </Button>
          </ButtonContainer>

          {issLocation ? (
            <>
              <DataCard>
                <DataLabel>Latitude</DataLabel>
                <DataValue>{formatCoordinate(issLocation.latitude)}°</DataValue>
              </DataCard>

              <DataCard>
                <DataLabel>Longitude</DataLabel>
                <DataValue>
                  {formatCoordinate(issLocation.longitude)}°
                </DataValue>
              </DataCard>

              {issLocation.altitude && (
                <DataCard>
                  <DataLabel>Altitude</DataLabel>
                  <DataValue>{issLocation.altitude.toFixed(2)} km</DataValue>
                </DataCard>
              )}

              {issLocation.velocity && (
                <DataCard>
                  <DataLabel>Velocity</DataLabel>
                  <DataValue>{issLocation.velocity.toFixed(2)} km/h</DataValue>
                </DataCard>
              )}

              <DataCard>
                <DataLabel>Next Visible Pass</DataLabel>
                <DataValue style={{ fontSize: "1rem" }}>
                  {getNextVisiblePass()}
                </DataValue>
              </DataCard>

              {lastUpdate && (
                <UpdateInfo>
                  Last updated: {lastUpdate.toLocaleTimeString()}
                </UpdateInfo>
              )}
            </>
          ) : (
            <LoaderContainer>
              <AstronomyLoader text="Fetching ISS data..." />
            </LoaderContainer>
          )}
        </InfoPanel>
      </ContentContainer>
    </PageContainer>
  );
};

export default ISSTracker;
