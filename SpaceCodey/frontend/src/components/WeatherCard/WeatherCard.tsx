import React from "react";
import styles from "./WeatherCard.module.css";

interface WeatherCardProps {
  city: string;
  day: string;
  weatherDescription: string;
  icon: string;
  temperature: number;
  minTemp: number;
  maxTemp: number;
}

const WeatherCard: React.FC<WeatherCardProps> = ({
  city,
  day,
  weatherDescription,
  icon,
  temperature,
  minTemp,
  maxTemp,
}) => {
  return (
    <div className={styles.cardContainer}>
      <div className={styles.topRow}>
        <span className={styles.day}>{day}</span>
        <span className={styles.city}>{city.toUpperCase()}</span>
      </div>
      <div className={styles.mainRow}>
        <div className={styles.iconTemp}>
          <img
            className={styles.weatherIcon}
            src={`http://openweathermap.org/img/w/${icon}.png`}
            alt={weatherDescription}
          />
          <div className={styles.tempDescription}>
            <span className={styles.temp}>{temperature}°</span>
            <span className={styles.description}>
              {weatherDescription.toUpperCase()}
            </span>
          </div>
        </div>
        <div className={styles.minMaxContainer}>
          <div className={styles.min}>
            <span className={styles.label}>Min</span>
            <span className={styles.value}>
              {minTemp !== 999 ? `${minTemp}°` : ""}
            </span>
          </div>
          <div className={styles.max}>
            <span className={styles.label}>Max</span>
            <span className={styles.value}>
              {maxTemp !== 999 ? `${maxTemp}°` : ""}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherCard;
