import React, { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import styled from "styled-components";

interface ISSLocation {
  latitude: number;
  longitude: number;
  altitude?: number;
  velocity?: number;
}

interface ISSTrackerMapProps {
  onLocationUpdate?: (location: ISSLocation) => void;
  centerISS?: boolean;
  refreshInterval?: number;
}

// Styled container for the Leaflet map.
const MapContainer = styled.div`
  height: 100%;
  width: 100%;
`;

const ISSTrackerMap: React.FC<ISSTrackerMapProps> = ({
  onLocationUpdate,
  centerISS = true,
  refreshInterval = 5000,
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const pathRef = useRef<L.Polyline | null>(null);
  const pathCoords = useRef<L.LatLngExpression[]>([]);

  // Initialize the map instance.
  useEffect(() => {
    if (!mapRef.current) return;
    const map = L.map(mapRef.current, {
      center: [0, 0],
      zoom: 3,
      worldCopyJump: true,
      zoomControl: true,
    });

    L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      subdomains: "abcd",
      maxZoom: 19,
    }).addTo(map);

    mapInstanceRef.current = map;
    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Fallback: Creates an SVG-based icon.
  const createSvgIcon = () => {
    const svgString = `
      <svg width="50" height="50" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
        <circle cx="20" cy="20" r="18" fill="#00a8ff" opacity="0.3"/>
        <circle cx="20" cy="20" r="10" fill="#ffffff" stroke="#00a8ff" stroke-width="2"/>
        <path d="M10,20 L30,20 M20,10 L20,30" stroke="#00a8ff" stroke-width="2"/>
        <circle cx="20" cy="20" r="4" fill="#00a8ff"/>
      </svg>
    `;
    const blob = new Blob([svgString], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    return L.icon({
      iconUrl: url,
      iconSize: [50, 50],
      iconAnchor: [25, 25],
      popupAnchor: [0, -25],
      className: "iss-svg-icon",
    });
  };

  // Fetches the ISS location from the API.
  const fetchISSLocation = async (): Promise<ISSLocation | null> => {
    try {
      const response = await fetch("https://api.wheretheiss.at/v1/satellites/25544");
      if (!response.ok) throw new Error(`Error: ${response.status}`);
      const data = await response.json();
      const { latitude, longitude, altitude, velocity } = data;
      return { latitude, longitude, altitude, velocity };
    } catch (error) {
      console.error("Failed to fetch ISS location:", error);
      return null;
    }
  };

  // Updates the ISS marker and path on the map.
  const updateISSMarker = async () => {
    if (!mapInstanceRef.current) return;
    const location = await fetchISSLocation();
    if (!location) return;
    const { latitude, longitude } = location;

    // Append new coordinate and trim path if necessary.
    pathCoords.current.push([latitude, longitude]);
    if (pathCoords.current.length > 100) {
      pathCoords.current = pathCoords.current.slice(-100);
    }

    // Create or update the polyline path.
    if (pathRef.current) {
      pathRef.current.setLatLngs(pathCoords.current);
    } else {
      pathRef.current = L.polyline(pathCoords.current, {
        color: "#00a8ff",
        weight: 2,
        opacity: 0.7,
        dashArray: "6, 4",
      }).addTo(mapInstanceRef.current);
    }

    // Try to use a PNG icon first; fallback to SVG if it fails.
    let issIcon: L.Icon = createSvgIcon();
    try {
      const testImg = new Image();
      testImg.src = "/static/images/ISSIcon.png";
      // If the PNG loads successfully, update the icon.
      testImg.onload = () => {
        issIcon = L.icon({
          iconUrl: "/static/images/ISSIcon.png",
          iconSize: [50, 50],
          iconAnchor: [25, 25],
          popupAnchor: [0, -25],
          className: "iss-icon-pulse",
        });
      };
    } catch (error) {
      console.error("Error loading PNG icon, using fallback", error);
    }

    // Remove the old marker if it exists.
    if (markerRef.current) {
      markerRef.current.remove();
    }
    markerRef.current = L.marker([latitude, longitude], {
      icon: issIcon,
      zIndexOffset: 1000,
    }).addTo(mapInstanceRef.current);

    // Bind a popup with current coordinates.
    const popupContent = `<b>ISS Tracker</b><br/>Lat: ${latitude.toFixed(
      2
    )}°, Lng: ${longitude.toFixed(2)}°`;
    markerRef.current.bindPopup(popupContent);

    // Center the map on the ISS if enabled.
    if (centerISS) {
      mapInstanceRef.current.setView([latitude, longitude], mapInstanceRef.current.getZoom());
    }

    // Trigger the parent callback with the new location.
    if (onLocationUpdate) onLocationUpdate(location);
  };

  // Set up the interval for continuous ISS updates.
  useEffect(() => {
    updateISSMarker();
    const intervalId = setInterval(updateISSMarker, refreshInterval);
    return () => clearInterval(intervalId);
  }, [centerISS, refreshInterval]);

  return <MapContainer ref={mapRef} id="map" />;
};

export default ISSTrackerMap;
