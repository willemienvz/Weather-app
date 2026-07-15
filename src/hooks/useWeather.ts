import { useState } from "react";
import { getCurrentWeather, searchLocation } from "../api/weatherApi";
import type {
  ForecastDay,
  OpenMeteoCurrentWeatherResponse,
} from "../types/weather";
import { formatLocationName } from "../utils/formatLocationName";

export interface WeatherData {
  locationName: string;
  latitude: number;
  longitude: number;
  weather: OpenMeteoCurrentWeatherResponse;
}

export interface NotificationState {
  message: string;
  type: "success" | "error";
}

export function useWeather() {
  const [selectedDay, setSelectedDay] = useState<ForecastDay | null>(null);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);

  const [notification, setNotification] = useState<NotificationState | null>(
    null,
  );

  const showError = (error: unknown, fallbackMessage: string) => {
    setNotification({
      message: error instanceof Error ? error.message : fallbackMessage,
      type: "error",
    });
  };

  const searchWeather = async (searchTerm: string) => {
    setLoading(true);
    setNotification(null);

    try {
      const location = await searchLocation(searchTerm);

      const weather = await getCurrentWeather(
        location.latitude,
        location.longitude,
      );

      setWeatherData({
        locationName: formatLocationName(location),
        latitude: location.latitude,
        longitude: location.longitude,
        weather,
      });

      setSelectedDay(null);
    } catch (error) {
      showError(error, "Unable to load weather for this location.");
    } finally {
      setLoading(false);
    }
  };

  const loadWeatherByCoordinates = async (
    latitude: number,
    longitude: number,
    locationName: string,
  ) => {
    setLoading(true);
    setNotification(null);

    try {
      const weather = await getCurrentWeather(latitude, longitude);

      const data: WeatherData = {
        locationName,
        latitude,
        longitude,
        weather,
      };

      setWeatherData(data);
      setSelectedDay(null);

      return data;
    } catch (error) {
      showError(error, "Unable to load weather information.");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    selectedDay,
    weatherData,
    loading,
    notification,
    setNotification,
    setSelectedDay,
    searchWeather,
    loadWeatherByCoordinates,
  };
}
