import React from "react";
import Feature from "./Feature";
import styles from "./Features.module.css"; 

const featuresData = [
  {
    title: "NASA APOD",
    description: "Explore the astronomy picture of the day.",
    link: "/nasa-apod",
  },
  {
    title: "ISS Tracker",
    description: "Track the International Space Station in real-time.",
    link: "/iss-tracker",
  },
  {
    title: "Weather",
    description: "Get weather updates and compare forecasts for two cities.",
    link: "/weather",
  },
  {
    title: "Optimal Shoot Times",
    description: "Calculate the best times for astrophotography.",
    link: "/optimal-times",
  },
  {
    title: "Astronomy Tracker",
    description: "Track celestial body positions and stay updated with the latest astronomy events.",
    link: "/astronomy-tracker",
  },
  {
    title: "Tips & Articles",
    description: "Read tips and articles about astronomy and astrophotography.",
    link: "/tips-and-articles",
  },
];

const Features: React.FC = () => {
  const firstRow = featuresData.slice(0, Math.ceil(featuresData.length / 2));
  const secondRow = featuresData.slice(Math.ceil(featuresData.length / 2));
  return (
    <div className={styles.featuresWrapper}>
      <div className="row">
        {firstRow.map((feature, index) => (
          <div key={index} className={`col-md-4 ${styles.feature}`}>
            <Feature title={feature.title} description={feature.description} link={feature.link} />
          </div>
        ))}
      </div>
      <div className="row mt-4">
        {secondRow.map((feature, index) => (
          <div key={index} className={`col-md-4 ${styles.feature}`}>
            <Feature title={feature.title} description={feature.description} link={feature.link} />
          </div>
        ))}
      </div>
    </div>
  );
};
export default Features;
