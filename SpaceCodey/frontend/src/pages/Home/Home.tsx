import React from "react";
import styles from "./Home.module.css";
import Features from "../../components/Features/Features";

const Home: React.FC = () => {
  return (
    <div className={`container ${styles.mycontent}`}>
      {/* Hero Section */}
      <div className={`${styles.hero}`}>
        <div className={styles.welcomeText}>
          <h1>Welcome to SpaceCodey</h1>
          <p>Your ultimate destination for astrophotography and space exploration.</p>
          <a href="/login" className="btn btn-outline-light">
              Explore Now
          </a>
          <a href="/support" className="btn btn-warning">
              Support Us
          </a>
          <p className={`mt-3 ${styles.smallText}`} style={{color: "white"}} >
            🌌 Help us bring the wonders of the universe to everyone. Your support fuels our mission to make space exploration accessible for all. 🚀✨
          </p>
        </div>
      </div>

      {/* Features Section */}
      <div className={`container ${styles.features}`}>
        <Features />
      </div>
    </div>
  );
};

export default Home;
