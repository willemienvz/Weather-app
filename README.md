# Weather App

A responsive weather application built with **React**, **TypeScript**, and **Vite** that allows users to search for locations, view current weather conditions, explore upcoming forecasts, and review recent historical weather data.

## Tech Stack

- React
- TypeScript
- Vite
- Native Fetch API
- CSS

## Installation

Clone the repository:

```bash
git clone <repository-url>
```

Navigate to the project:

```bash
cd weather-app
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open your browser and navigate to:

```text
http://localhost:5173
```

## Running Tests

Run all tests:

```bash
npm run test
```

Run tests in watch mode:

```bash
npm run test -- --watch
```

### Key Components

- **CurrentWeather** – Displays the selected weather information.
- **DailyWeather** – Displays forecast and historical weather data.
- **HourlyForecast** – Shows hourly weather conditions.
- **WeatherDetails** – Displays additional weather metrics.
- **SavedLocations** – Allows quick access to previously viewed locations.
- **Header** – Handles location searching and geolocation requests.

### Custom Hooks

- **useWeather** – Handles weather retrieval, loading state, error handling, and selected day management.
- **useSavedLocations** – Manages saved locations and localStorage persistence.
- **useBodyScrollLock** – Prevents scrolling while loading overlays are displayed.

## Design Decisions

### Component-Based Architecture

The application is split into small, focused components to improve maintainability, reusability, and readability.

### Custom Hooks

Weather logic and saved-location management are separated into custom hooks to keep components focused on rendering and user interaction.

### Native Fetch API

The native Fetch API is used for data retrieval to keep dependencies minimal and align with the project requirements.

### Local Storage Persistence

Saved locations are persisted using browser localStorage, allowing users to revisit frequently used locations without needing to search again.

### Responsive Design

The layout adapts to different screen sizes using CSS Grid, Flexbox, and responsive media queries to provide a consistent experience across desktop and mobile devices.

### User Experience

Animations and transitions were added to improve visual feedback and create a more engaging user experience while maintaining usability.

## Trade-Offs

### Weather Data Provider

The application uses Open-Meteo APIs for weather retrieval. Open-Meteo was selected because it provides free access to current, forecast, and historical weather data required by the application.

### Client-Side Persistence

localStorage was chosen over a backend solution due to the scope of the project. This keeps the implementation simple while still providing a better user experience.

### Minimal Dependencies

Where possible, built-in browser functionality and React features were used instead of introducing additional libraries, reducing bundle size and complexity.

## Trade-Offs

### Weather Data Provider

The application uses Open-Meteo APIs for weather retrieval. Open-Meteo was selected because it provides free access to current, forecast, and historical weather data required by the application.

## Notes

Open-Meteo was used instead of WeatherStack because forecast and historical weather endpoints were required for the exercise and were readily available through the chosen provider. The overall application behaviour remains aligned with the project requirements. With WeatherStack the forecast api's are not included in the free tier.
