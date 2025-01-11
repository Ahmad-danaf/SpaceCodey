import React from "react";
import { Link } from "react-router-dom";
import "./Footer.module.css";

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer bg-dark text-light py-4">
      <div className="container">
        <div className="row">
          {/* About Section */}
          <div className="col-md-4">
            <h5>About SpaceCodey</h5>
            <p>
              SpaceCodey is a platform for astrophotographers and space
              enthusiasts. Explore the wonders of the cosmos with tools, tips,
              and real-time data!
            </p>
          </div>

          {/* Quick Links */}
          <div className="col-md-4">
            <h5>Quick Links</h5>
            <ul className="list-unstyled">
              <li>
                <Link to="/" className="text-light">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/tips" className="text-light">
                  Tips & Articles
                </Link>
              </li>
              <li>
                <Link to="/nasa-apod" className="text-light">
                  NASA APOD
                </Link>
              </li>
              <li>
                <Link to="/ISS-tracker" className="text-light">
                  ISS Tracker
                </Link>
              </li>
              <li>
                <Link to="/contact-us" className="text-light">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Social Media Links */}
          <div className="col-md-4">
            <h5>Follow Us</h5>
            <ul className="list-unstyled">
                    {/* Instagram Link
              <li>
                <a
                  href="https://instagram.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-light"
                >
                  Instagram
                </a>
              </li> */}
              <li className="text-muted">Social media links coming soon!</li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="text-center mt-4">
          <p>&copy; {currentYear} SpaceCodey. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
