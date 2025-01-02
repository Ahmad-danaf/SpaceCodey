# SpaceCodey

**SpaceCodey** is a web application designed for astrophotographers and space enthusiasts. The platform integrates a variety of tools and resources to help users track celestial events, plan astrophotography sessions, and stay informed on astronomy-related topics. Built using the Django framework, SpaceCodey features user registration and authentication (including email verification), real-time data integrations, and a sleek dark-themed interface designed to appeal to space lovers.

## Features

- **User Registration and Authentication**
  - Sign up, login, and profile management functionalities.
  - Secure authentication with email verification to ensure legitimate access.

- **NASA Astronomy Picture of the Day (APOD) Integration**
  - Automatically displays the latest image from NASA's APOD API, allowing users to explore new astronomical images daily.

- **ISS Real-Time Tracking**
  - Track the location of the International Space Station (ISS) in real-time.

- **Weather Comparison for Astrophotography**
  - Compare real-time weather conditions across multiple locations to find the best astrophotography spots.

- **Optimal Shoot Times Calculation**
  - Calculate the best times to photograph celestial bodies based on location and astronomical data.

- **Celestial Body Tracking**
  - Track the movement of celestial bodies, including the moon, planets, and stars, for precise observation and photography planning.

- **Tips and Articles Section**
  - Stay updated with the latest tips, articles, and insights related to astronomy and astrophotography.

## Technologies Used

- **Backend**: Django (Python)
- **Frontend**: HTML, CSS, JavaScript
- **API Integrations**:
  - NASA APOD API
  - ISS Tracking API
  - Weather APIs for real-time weather comparisons
- **Database**: SQLite (or specify the database used)
- **Cloud Deployment**: Microsoft Azure

## Installation and Setup

To run SpaceCodey locally, follow these steps:

### Prerequisites
- **Python 3.x** installed on your system
- **Django** installed via `pip` (version 3.2 or above recommended)
- An active **NASA APOD API key** and any required keys for ISS tracking and weather APIs

### Steps

1. Clone this repository:
   ```bash
   git clone https://github.com/your-username/SpaceCodey.git
   ```

2. Navigate to the project directory:
   ```bash
   cd SpaceCodey
   ```

3. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

4. Install the required dependencies:
   ```bash
   pip install -r requirements.txt
   ```

5. Apply migrations to set up the database:
   ```bash
   python manage.py migrate
   ```

6. Add your **API keys** to the `.env` file in the following format:
   ```bash
   NASA_API_KEY=your_nasa_api_key
   ISS_API_KEY=your_iss_api_key
   WEATHER_API_KEY=your_weather_api_key
   ```

7. Run the local development server:
   ```bash
   python manage.py runserver
   ```

8. Open your browser and visit `http://127.0.0.1:8000/` to access SpaceCodey.

## Usage

- Sign up for an account and verify your email to access the full features of the platform.
- Explore daily updates from NASA’s APOD, track celestial events, compare weather conditions for photography, and more.

## Contributing

If you'd like to contribute to SpaceCodey, feel free to fork the repository and submit a pull request. Issues and feature requests are also welcome.

## Future Enhancements

- **Mobile Optimization**: Improving the user experience on mobile devices.
- **Additional Celestial Events**: Expand the celestial event tracking feature with more detailed data and notifications.
- **User Customization**: Enable users to customize their dashboard with preferred features and data.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

For any questions or inquiries, feel free to contact me via LinkedIn: [LinkedIn](https://www.linkedin.com/in/ahmad-danaf)
