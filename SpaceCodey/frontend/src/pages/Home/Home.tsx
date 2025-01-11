import React, {useEffect} from "react";
import AOS from "aos";
import ScrollToTopButton from "../../components/ScrollToTopButton/ScrollToTopButton";
import Features from "../../components/Features/Features";
import "./Home.module.css";
import "aos/dist/aos.css";

const Home: React.FC = () => {
    useEffect(() => {
      AOS.init();
    }, []);
    
  return (
    <div>
      {/* Hero Section */}
      <div className="hero">
        <div className="hero-overlay">
          <div className="welcome-text">
            <h1 data-aos="fade-up" data-aos-duration="1000">Welcome to SpaceCodey</h1>
            <p data-aos="fade-up" data-aos-duration="1200">
              Your ultimate destination for astrophotography and space exploration.
            </p>
            <div className="button-group" data-aos="zoom-in" data-aos-duration="1400">
              <a href="/login" className="btn btn-outline-light">Explore Now</a>
              <a href="/support" className="btn btn-warning">Support Us</a>
            </div>
            <p
              className="mt-3 small-text"
              data-aos="fade-up"
              data-aos-duration="1600"
            >
              🌌 Help us bring the wonders of the universe to everyone. Your support fuels our mission to make space exploration accessible for all. 🚀✨
            </p>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="features-wrapper">
        <h2 className="section-title" data-aos="fade-up" data-aos-duration="1000">
          Explore Our Features
        </h2>
        <p
          className="section-subtitle"
          data-aos="fade-up"
          data-aos-duration="1200"
        >
          Tools and resources for astrophotographers and space enthusiasts
        </p>
        <Features />
      </div>

      {/* Astrophotography Showcase */}
      <div className="showcase">
        <div className="showcase-overlay">
          <h2 data-aos="zoom-in" data-aos-duration="1000">Astrophotography Gallery</h2>
          <p data-aos="fade-up" data-aos-duration="1200">
            Capture the cosmos. Share your creations with the world.
          </p>
          <a href="/gallery" className="btn btn-light" data-aos="zoom-in" data-aos-duration="1400">
            View Gallery
          </a>
        </div>
      </div>

      {/* Scroll to Top Button */}
      <ScrollToTopButton />
    </div>
  );
};

export default Home;
