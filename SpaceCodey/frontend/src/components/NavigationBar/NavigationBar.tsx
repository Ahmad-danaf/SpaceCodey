import React from "react";
import { Navbar, Nav, Container, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const NavigationBar: React.FC = () => {
  const { isAuthenticated, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top" id="navbar">
      <div className="container-fluid">
        <a className="navbar-brand" href="/">SpaceCodey</a>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item"><a className="nav-link" href="/nasa-apod">NASA APOD</a></li>
            <li className="nav-item"><a className="nav-link" href="/iss-tracker">ISS Tracker</a></li>
            <li className="nav-item"><a className="nav-link" href="/weather">Weather</a></li>
            <li className="nav-item"><a className="nav-link" href="/optimal-shoot-times">Optimal Shoot Times</a></li>
            <li className="nav-item"><a className="nav-link" href="/astronomy-tracker">Astronomy Tracker</a></li>
            <li className="nav-item"><a className="nav-link" href="/tips">Tips & Articles</a></li>
          </ul>
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
            <li className="nav-item"><a className="nav-link" href="/login">Login</a></li>
            <li className="nav-item"><a className="nav-link" href="/signup">Signup</a></li>
          </ul>
        </div>
      </div>
    </nav>
  );
};


export default NavigationBar;
