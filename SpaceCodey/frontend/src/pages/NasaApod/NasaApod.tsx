import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "./NasaApod.module.css";

interface ApodData {
  date: string;
  explanation: string;
  hdurl: string;
  media_type: string;
  title: string;
  url: string;
  copyright?: string;
}

const NasaApod: React.FC = () => {
  const [apodData, setApodData] = useState<ApodData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [imageLoaded, setImageLoaded] = useState<boolean>(false);

  // Get base URL and API key from environment variables
  const API_BASE_URL =
    import.meta.env.VITE_DEBUG_MODE === "development"
      ? import.meta.env.VITE_DEV_API_BASE_URL
      : import.meta.env.VITE_PROD_API_BASE_URL;

  const apiKey = import.meta.env.VITE_X_API_KEY;

  // Fetch APOD data on component mount
  useEffect(() => {
    const fetchApodData = async () => {
      try {
        setLoading(true);
        const response = await axios.get<ApodData>(
          `${API_BASE_URL}/nasa/apod/`,
          {
            headers: {
              "Content-Type": "application/json",
              "x-api-key": apiKey || "",
            },
          }
        );
        setApodData(response.data);
        setError(null);
      } catch (err) {
        setError(
          "Unable to fetch NASA Astronomy Picture of the Day. Please try again later."
        );
        setApodData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchApodData();
  }, [API_BASE_URL, apiKey]);

  // Format date to a more readable format
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Open HD image in new tab
  const openHdImage = () => {
    if (apodData?.hdurl) {
      window.open(apodData.hdurl, "_blank");
    }
  };

  return (
    <div className={styles.container}>
      {loading ? (
        <div className={styles.loaderContainer}>
          <div className={styles.cosmicLoader}>
            <div className={styles.planet}></div>
            <div className={styles.ring}></div>
          </div>
          <p className={styles.loaderText}>
            Loading the wonders of the cosmos...
          </p>
        </div>
      ) : error ? (
        <div className={styles.errorContainer}>
          <div className={styles.errorIcon}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
          </div>
          <p className={styles.errorMessage}>{error}</p>
          <button
            className={styles.retryButton}
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </div>
      ) : (
        apodData && (
          <div className={styles.apodContainer}>
            <h1 className={styles.title}>Astronomy Picture of the Day</h1>
            <h2 className={styles.apodTitle}>{apodData.title}</h2>
            <p className={styles.date}>{formatDate(apodData.date)}</p>

            <div className={styles.imageContainer}>
              {!imageLoaded && <div className={styles.imageLoader}></div>}
              {apodData.media_type === "image" ? (
                <img
                  src={apodData.url}
                  alt={apodData.title}
                  className={`${styles.apodImage} ${
                    imageLoaded ? styles.imageVisible : ""
                  }`}
                  onLoad={() => setImageLoaded(true)}
                />
              ) : apodData.media_type === "video" ? (
                <div className={styles.videoContainer}>
                  <iframe
                    title={apodData.title}
                    src={apodData.url}
                    frameBorder="0"
                    allowFullScreen
                    className={styles.apodVideo}
                    onLoad={() => setImageLoaded(true)}
                  ></iframe>
                </div>
              ) : (
                <p className={styles.unsupportedMedia}>
                  Unsupported media type: {apodData.media_type}
                </p>
              )}
            </div>

            {apodData.media_type === "image" && apodData.hdurl && (
              <button className={styles.hdButton} onClick={openHdImage}>
                View HD Image
              </button>
            )}

            <div className={styles.explanationContainer}>
              <h3 className={styles.explanationTitle}>Description</h3>
              <p className={styles.explanation}>{apodData.explanation}</p>
            </div>

            {apodData.copyright && (
              <p className={styles.copyright}>© {apodData.copyright}</p>
            )}
          </div>
        )
      )}
    </div>
  );
};

export default NasaApod;
