import React from "react";
import Feature from "./Feature";
import "./Features.module.css";
import ScrollToTopButton from "../ScrollToTopButton/ScrollToTopButton";
const featuresData = [
  {
    title: "NASA APOD",
    description: "Explore the astronomy picture of the day.",
  },
  {
    title: "ISS Tracker",
    description: "Track the International Space Station in real-time.",
  },
  {
    title: "Weather",
    description: "Get weather updates and compare forecasts for two cities.",
  },
  {
    title: "Optimal Shoot Times",
    description: "Calculate the best times for astrophotography.",
  },
  {
    title: "Astronomy Tracker",
    description: "Track celestial body positions and stay updated with the latest astronomy events.",
  },
  {
    title: "Tips & Articles",
    description: "Read tips and articles about astronomy and astrophotography.",
  },
];

const Features: React.FC = () => {
  return (
    <div className="container features">
      <div className="row">
        {featuresData.map((feature, index) => (
          <div key={index} className="col-md-4">
            <Feature title={feature.title} description={feature.description} />
          </div>
        ))}
      </div>
    {/* Scroll to Top Button */}
    <ScrollToTopButton />
    </div>
    
  );
};

export default Features;
