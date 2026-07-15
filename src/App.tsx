import "./App.css";
import { CurrentWeather } from "./components/CurrentWeather/CurrentWeather";
import { DailyWeather } from "./components/DailyWeather/DailyWeather";
import { Header } from "./components/Header/Header";
import { HourlyForecast } from "./components/HourlyForecast/HourlyForecast";
import { Loader } from "./components/Loader/Loader";
import { Notification } from "./components/Notification/Notification";
import { SavedLocations } from "./components/SavedLocations/SavedLocations";
import { WeatherDetails } from "./components/WeatherDetails/WeatherDetails";
import { useBodyScrollLock } from "./hooks/useBodyScrollLock";
import { useSavedLocations } from "./hooks/useSavedLocations";
import { useWeather } from "./hooks/useWeather";
import type { SavedLocation } from "./types/SavedLocation";
import { getLocationName } from "./api/weatherApi";

export function App() {
  const {
    selectedDay,
    weatherData,
    loading,
    notification,
    setNotification,
    setSelectedDay,
    searchWeather,
    loadWeatherByCoordinates,
  } = useWeather();

  const { savedLocations, saveLocation, updateTemperature, removeLocation } =
    useSavedLocations();

  useBodyScrollLock(loading);

  const handleUseLocation = () => {
    setNotification(null);

    if (!navigator.geolocation) {
      setNotification({
        message: "Your browser does not support location services.",
        type: "error",
      });

      return;
    }

    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        const { latitude, longitude } = coords;

        try {
          const locationName = await getLocationName(latitude, longitude);

          await loadWeatherByCoordinates(latitude, longitude, locationName);
        } catch {
          await loadWeatherByCoordinates(
            latitude,
            longitude,
            "Current Location",
          );
        }
      },
      (positionError) => {
        switch (positionError.code) {
          case positionError.PERMISSION_DENIED:
            setNotification({
              message:
                "Location permission was denied. Please allow location access and try again.",
              type: "error",
            });
            break;

          case positionError.POSITION_UNAVAILABLE:
            setNotification({
              message: "Your location is currently unavailable.",
              type: "error",
            });
            break;

          case positionError.TIMEOUT:
            setNotification({
              message: "The location request took too long. Please try again.",
              type: "error",
            });
            break;

          default:
            setNotification({
              message: "Unable to determine your current location.",
              type: "error",
            });
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

    const saved = saveLocation(weatherData);

    if (!saved) {
      setNotification({
        message: "This location has already been saved.",
        type: "error",
      });

      return;
    }

    setNotification({
      message: `${weatherData.locationName} was saved successfully.`,
      type: "success",
    });
  };

  const handleSelectSavedLocation = async (location: SavedLocation) => {
    const result = await loadWeatherByCoordinates(
      location.latitude,
      location.longitude,
      location.name,
    );

    if (result) {
      updateTemperature(location.id, result.weather.current.temperature_2m);

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  return (
    <main className="app">
      {loading && <Loader message="Loading weather for your location..." />}

      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}

      <div className="app-container">
        <Header onSearch={searchWeather} onUseLocation={handleUseLocation} />

        {!loading && !weatherData && (
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
          onRemove={removeLocation}
        />
      </div>
    </main>
  );
}

export default App;
