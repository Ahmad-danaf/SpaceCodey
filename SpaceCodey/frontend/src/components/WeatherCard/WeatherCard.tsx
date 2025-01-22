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
        // From Uiverse.io by vinodjangid07 
        
        <div className={styles.cardContainer}>
          <div className={styles.card}>
          <p className={styles.weather}>{day}</p>
            <p className={styles.city}>{city.toUpperCase()}</p>
            <p className={styles.weather}>{weatherDescription.toUpperCase()}</p>
            <img
          className={styles.weatherIcon}
          src={`http://openweathermap.org/img/w/${icon}.png`}
          alt={weatherDescription}
          width="30"
          height="30"
        />
            
            <p className={styles.temp}>{`${temperature}°`}</p>
            
          <div className={styles.minmaxContainer}>
            <div className={styles.min}>
              <p className={styles.minHeading}>Min</p>
              <p className={styles.minTemp}>{minTemp !== 999 ? `${minTemp}°` : ""}</p>
            </div>
              <div className={styles.max}>
                <p className={styles.maxHeading}>Max</p>
                <p className={styles.maxTemp}>{maxTemp !=999 ? `${maxTemp}°` : ""}</p>
              </div>
            </div>
          </div>
        </div>        
    );
  };
  
  export default WeatherCard;
  