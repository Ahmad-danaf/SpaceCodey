import React from "react";
import { Link } from "react-router-dom";
import styles from "./DecisionPage.module.css";

const DecisionPage: React.FC = () => {
  return (
    <div className="container">
    <div className={`container ${styles.decisionContainer}`}>
      <h1 className="text-center mb-5" style={{ fontFamily: "Pixelify Sans", color: "#ff9f1c" }}>
        Explore Tips & Articles
      </h1>

      <div className={`row ${styles.rowCenter}`}>
        {/* Card for Astrophotography Tips */}
        <div className="col-md-5">
          <div className={`card text-center mb-4 ${styles.cardDecision}`}>
            <div className={styles.cardBody}>
              <h2 className={`${styles.cardTitle}`}>Astrophotography Tips</h2>
              <p className="card-text">Discover helpful tips to improve your astrophotography skills.</p>
              <Link to="/tips" className="btn btn-primary">
                View Tips
              </Link>
            </div>
          </div>
        </div>

        {/* Card for Astronomy Articles */}
        <div className="col-md-5">
          <div className={`card text-center mb-4 ${styles.cardDecision}`}>
            <div className={styles.cardBody}>
              <h2 className={`${styles.cardTitle}`}>Astronomy Articles</h2>
              <p className="card-text">Explore articles on astronomy to expand your knowledge.</p>
              <Link to="/articles" className="btn btn-primary">
                View Articles
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default DecisionPage;
