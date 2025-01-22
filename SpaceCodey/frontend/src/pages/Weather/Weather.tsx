import React, { useState } from "react";
import axios from "axios";
import styles from "./Weather.module.css";
import WeatherCard from "../../components/WeatherCard/WeatherCard";

interface TodayWeather {
  city: string;
  description: string;
  icon: string;
  temperature: number;
}

interface Forecast {
  day: string;
  min_temp: number;
  max_temp: number;
  description: string;
  icon: string;
  cloudiness: number;
}

interface CityWeather {
  weather: TodayWeather;
  forecasts: Forecast[];
}

interface ApiResponse {
  city1?: CityWeather;
  city2?: CityWeather;
}

const Weather: React.FC = () => {
  const [city1, setCity1] = useState<string>("");
  const [city2, setCity2] = useState<string>("");
  const [weatherData, setWeatherData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState<boolean>(true);

  const API_BASE_URL =
    import.meta.env.VITE_DEBUG_MODE === "development"
      ? import.meta.env.VITE_DEV_API_BASE_URL
      : import.meta.env.VITE_PROD_API_BASE_URL;

  const apiKey = import.meta.env.VITE_X_API_KEY;

  const fetchWeatherData = async () => {
    try {
      setLoading(true);
      const response = await axios.get<ApiResponse>(
        `${API_BASE_URL}/weather/?city1=${city1}&city2=${city2}`,
        {
          headers: {
            "Content-Type": "application/json",
            "x-api-key": apiKey || "",
          },
        }
      );
      setWeatherData(response.data);
      setShowForm(false);
      setError(null);
    } catch (err) {
      setError("Unable to fetch weather data. Please try again.");
      setWeatherData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!city1) {
      setError("City 1 is required.");
      return;
    }
    fetchWeatherData();
  };

  return (
    <div className={styles.container}>
      {showForm ? (
        <form
          onSubmit={handleSubmit}
          className={`${styles.form} ${!showForm && styles.fadeOut}`}
        >
          <h1 className={styles.title}>Explore the Weather Galaxy</h1>
          <div className={styles.inputGroup}>
            <label htmlFor="city1" className={styles.label}>
              City 1:
            </label>
            <input
              id="city1"
              type="text"
              value={city1}
              onChange={(e) => setCity1(e.target.value)}
              placeholder="Enter first city"
              className={styles.input}
            />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="city2" className={styles.label}>
              City 2 (Optional):
            </label>
            <input
              id="city2"
              type="text"
              value={city2}
              onChange={(e) => setCity2(e.target.value)}
              placeholder="Enter second city"
              className={styles.input}
            />
          </div>
          <button
            type="submit"
            className={`${styles.button} ${loading ? styles.buttonLoading : ""}`}
            disabled={loading}
          >
            {loading ? "Loading..." : "Launch"}
          </button>
          {loading && <div className={styles.loader}></div>}
        </form>
      ) : (
        <div className={styles.weatherContainer}>
          {loading && <div className={styles.loader}></div>}
          {error && <p className={styles.error}>{error}</p>}

          {weatherData?.city1 && (
            <div className={styles.cityContainer}>
              <h2 className={styles.cityTitle}>{weatherData.city1.weather.city.toUpperCase()}</h2>
              <div className={styles.cardContainer}>
                <div className={styles.todayWeather}>
                  <WeatherCard
                    city={weatherData.city1.weather.city}
                    day={weatherData.city1.forecasts[0].day}
                    weatherDescription={weatherData.city1.weather.description}
                    icon={weatherData.city1.weather.icon}
                    temperature={weatherData.city1.weather.temperature}
                    minTemp={weatherData.city1.forecasts[0].min_temp}
                    maxTemp={weatherData.city1.forecasts[0].max_temp}
                  />
                </div>
                <div className={styles.forecastContainer}>
                  {weatherData.city1.forecasts.map((forecast, index) => (
                    index!=0 && <div key={`city1-forecast-${index}`} className={styles.forecastCard}>
                      <WeatherCard
                        city={weatherData.city1?.weather?.city ?? ""}
                        day={forecast.day}
                        weatherDescription={forecast.description}
                        icon={forecast.icon}
                        temperature={forecast.max_temp}
                        minTemp={forecast.min_temp}
                        maxTemp={forecast.max_temp}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {weatherData?.city2 && (
            <div className={styles.cityContainer}>
              <h2 className={styles.cityTitle}>{weatherData.city2.weather.city.toUpperCase()}</h2>
              <div className={styles.cardContainer}>
                <div className={styles.todayWeather}>
                  <WeatherCard
                    city={weatherData.city2.weather.city}
                    day={weatherData.city2.forecasts[0].day}
                    weatherDescription={weatherData.city2.weather.description}
                    icon={weatherData.city2.weather.icon}
                    temperature={weatherData.city2.weather.temperature}
                    minTemp={weatherData.city2.forecasts[0].min_temp}
                    maxTemp={weatherData.city2.forecasts[0].max_temp}
                  />
                </div>
                <div className={styles.forecastContainer}>
                  {weatherData.city2.forecasts.map((forecast, index) => (
                    index!=0 && <div key={`city2-forecast-${index}`} className={styles.forecastCard}>
                      <WeatherCard
                        city={weatherData.city2?.weather?.city ?? ""}
                        day={forecast.day}
                        weatherDescription={forecast.description}
                        icon={forecast.icon}
                        temperature={forecast.max_temp}
                        minTemp={forecast.min_temp}
                        maxTemp={forecast.max_temp}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Weather;