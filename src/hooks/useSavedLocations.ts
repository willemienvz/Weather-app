import { useEffect, useState } from "react";
import type { SavedLocation } from "../types/SavedLocation";
import type { WeatherData } from "./useWeather";

const SAVED_LOCATIONS_KEY = "weather-app-saved-locations";

function getStoredLocations(): SavedLocation[] {
  const storedLocations = localStorage.getItem(SAVED_LOCATIONS_KEY);

  if (!storedLocations) {
    return [];
  }

  try {
    return JSON.parse(storedLocations) as SavedLocation[];
  } catch {
    return [];
  }
}

export function useSavedLocations() {
  const [savedLocations, setSavedLocations] =
    useState<SavedLocation[]>(getStoredLocations);

  useEffect(() => {
    localStorage.setItem(SAVED_LOCATIONS_KEY, JSON.stringify(savedLocations));
  }, [savedLocations]);

  const saveLocation = (weatherData: WeatherData): boolean => {
    const alreadySaved = savedLocations.some(
      (location) =>
        location.latitude === weatherData.latitude &&
        location.longitude === weatherData.longitude,
    );

    if (alreadySaved) {
      return false;
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

    return true;
  };

  const updateTemperature = (id: string, temperature: number) => {
    setSavedLocations((currentLocations) =>
      currentLocations.map((location) =>
        location.id === id
          ? {
              ...location,
              temperature,
            }
          : location,
      ),
    );
  };

  const removeLocation = (id: string) => {
    setSavedLocations((currentLocations) =>
      currentLocations.filter((location) => location.id !== id),
    );
  };

  return {
    savedLocations,
    saveLocation,
    updateTemperature,
    removeLocation,
  };
}
