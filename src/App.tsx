import { useEffect, useState } from "react";
import "./App.css";
import { getCurrentWeather, searchLocation } from "./api/weatherApi";
import { CurrentWeather } from "./components/CurrentWeather/CurrentWeather";
import { Header } from "./components/Header/Header";
import { WeatherDetails } from "./components/WeatherDetails/WeatherDetails";
import type {
  ForecastDay,
  OpenMeteoCurrentWeatherResponse,
} from "./types/weather";
import { HourlyForecast } from "./components/HourlyForecast/HourlyForecast";
import { DailyWeather } from "./components/DailyWeather/DailyWeather";
import { SavedLocations } from "./components/SavedLocations/SavedLocations";
import type { SavedLocation } from "./types/SavedLocation";
import { Loader } from "./components/Loader/Loader";

interface WeatherData {
  locationName: string;
  latitude: number;
  longitude: number;
  weather: OpenMeteoCurrentWeatherResponse;
}

const SAVED_LOCATIONS_KEY = "weather-app-saved-locations";

export function App() {
  const [selectedDay, setSelectedDay] = useState<ForecastDay | null>(null);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [savedLocations, setSavedLocations] = useState<SavedLocation[]>(() => {
    const storedLocations = localStorage.getItem(SAVED_LOCATIONS_KEY);

    if (!storedLocations) {
      return [];
    }

    try {
      return JSON.parse(storedLocations) as SavedLocation[];
    } catch {
      return [];
    }
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem(SAVED_LOCATIONS_KEY, JSON.stringify(savedLocations));
  }, [savedLocations]);

  useEffect(() => {
    if (!loading) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [loading]);

  const handleSearch = async (searchTerm: string) => {
    setLoading(true);
    setError(null);

    try {
      const location = await searchLocation(searchTerm);

      const weatherResponse = await getCurrentWeather(
        location.latitude,
        location.longitude,
      );

      setWeatherData({
        locationName: formatLocationName(location),
        latitude: location.latitude,
        longitude: location.longitude,
        weather: weatherResponse,
      });
      setSelectedDay(null);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to load weather for this location.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleUseLocation = () => {
    setError(null);

    if (!navigator.geolocation) {
      setError("Your browser does not support location services.");
      return;
    }

    setLoading(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          const weatherResponse = await getCurrentWeather(latitude, longitude);

          setWeatherData({
            locationName: "Current Location",
            latitude,
            longitude,
            weather: weatherResponse,
          });
        } catch (error) {
          setError(
            error instanceof Error
              ? error.message
              : "Unable to load weather information.",
          );
        } finally {
          setLoading(false);
        }
      },
      (positionError) => {
        setLoading(false);

        switch (positionError.code) {
          case positionError.PERMISSION_DENIED:
            setError(
              "Location permission was denied. Please allow location access and try again.",
            );
            break;

          case positionError.POSITION_UNAVAILABLE:
            setError("Your location is currently unavailable.");
            break;

          case positionError.TIMEOUT:
            setError("The location request took too long. Please try again.");
            break;

          default:
            setError("Unable to determine your current location.");
        }
      },
      {
        enableHighAccuracy: false,
        timeout: 10_000,
        maximumAge: 5 * 60 * 1000,
      },
    );
  };

  const handleSaveLocation = () => {
    if (!weatherData) {
      return;
    }

    const alreadySaved = savedLocations.some(
      (location) =>
        location.latitude === weatherData.latitude &&
        location.longitude === weatherData.longitude,
    );

    if (alreadySaved) {
      setError("This location has already been saved.");
      return;
    }

    const savedLocation: SavedLocation = {
      id: `${weatherData.latitude}-${weatherData.longitude}`,
      name: weatherData.locationName,
      latitude: weatherData.latitude,
      longitude: weatherData.longitude,
      temperature: weatherData.weather.current.temperature_2m,
    };

    setSavedLocations((currentLocations) => [
      ...currentLocations,
      savedLocation,
    ]);
  };

  const handleSelectSavedLocation = async (location: SavedLocation) => {
    setLoading(true);
    setError(null);

    try {
      const weatherResponse = await getCurrentWeather(
        location.latitude,
        location.longitude,
      );

      setWeatherData({
        locationName: location.name,
        latitude: location.latitude,
        longitude: location.longitude,
        weather: weatherResponse,
      });

      setSavedLocations((currentLocations) =>
        currentLocations.map((savedLocation) =>
          savedLocation.id === location.id
            ? {
                ...savedLocation,
                temperature: weatherResponse.current.temperature_2m,
              }
            : savedLocation,
        ),
      );
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to load this saved location.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveSavedLocation = (id: string) => {
    setSavedLocations((currentLocations) =>
      currentLocations.filter((location) => location.id !== id),
    );
  };

  return (
    <main className="app">
      {loading && <Loader message="Loading weather for your location..." />}
      <div className="app-container">
        <Header onSearch={handleSearch} onUseLocation={handleUseLocation} />

        {error && (
          <div className="weather-error" role="alert">
            {error}
          </div>
        )}

        {!loading && !weatherData && !error && (
          <div className="weather-message">
            Search for a city or use your current location.
          </div>
        )}

        {weatherData && (
          <>
            <div className="save-location-wrapper">
              <button
                type="button"
                className="save-location-button"
                onClick={handleSaveLocation}
              >
                Save location
              </button>
            </div>
            <CurrentWeather
              selectedDay={selectedDay}
              locationName={weatherData.locationName}
              weather={weatherData.weather}
            />

            <HourlyForecast
              weather={weatherData.weather}
              selectedDay={selectedDay}
            />

            <div className="weather-container">
              <div className="weather-details">
                <DailyWeather
                  weather={weatherData.weather}
                  selectedDay={selectedDay}
                  onSelectDay={setSelectedDay}
                />
              </div>

              <div className="weather-details">
                <WeatherDetails weather={weatherData.weather} />
              </div>
            </div>
          </>
        )}

        <SavedLocations
          locations={savedLocations}
          onSelect={handleSelectSavedLocation}
          onRemove={handleRemoveSavedLocation}
        />
      </div>
    </main>
  );
}

function formatLocationName(location: {
  name: string;
  admin1?: string;
  country?: string;
}): string {
  const parts = [location.name, location.admin1, location.country].filter(
    Boolean,
  );

  return parts.join(", ");
}

export default App;
