import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import type { SavedLocation } from "../types/SavedLocation";
import type { WeatherData } from "./useWeather";
import { useSavedLocations } from "./useSavedLocations";

const STORAGE_KEY = "weather-app-saved-locations";

const mockWeatherData = {
  locationName: "Centurion",
  latitude: -25.86,
  longitude: 28.19,
  weather: {
    current: {
      temperature_2m: 21.6,
    },
  },
} as WeatherData;

describe("useSavedLocations", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("starts with an empty list when localStorage is empty", () => {
    const { result } = renderHook(() => useSavedLocations());

    expect(result.current.savedLocations).toEqual([]);
  });

  it("loads saved locations from localStorage", () => {
    const storedLocations: SavedLocation[] = [
      {
        id: "-25.86-28.19",
        name: "Centurion",
        latitude: -25.86,
        longitude: 28.19,
        temperature: 20,
      },
    ];

    localStorage.setItem(STORAGE_KEY, JSON.stringify(storedLocations));

    const { result } = renderHook(() => useSavedLocations());

    expect(result.current.savedLocations).toEqual(storedLocations);
  });

  it("returns an empty list when stored JSON is invalid", () => {
    localStorage.setItem(STORAGE_KEY, "invalid JSON");

    const { result } = renderHook(() => useSavedLocations());

    expect(result.current.savedLocations).toEqual([]);
  });

  it("saves a new location", () => {
    const { result } = renderHook(() => useSavedLocations());

    let wasSaved = false;

    act(() => {
      wasSaved = result.current.saveLocation(mockWeatherData);
    });

    expect(wasSaved).toBe(true);

    expect(result.current.savedLocations).toEqual([
      {
        id: "-25.86-28.19",
        name: "Centurion",
        latitude: -25.86,
        longitude: 28.19,
        temperature: 21.6,
      },
    ]);
  });

  it("persists saved locations to localStorage", () => {
    const { result } = renderHook(() => useSavedLocations());

    act(() => {
      result.current.saveLocation(mockWeatherData);
    });

    const storedValue = localStorage.getItem(STORAGE_KEY);

    expect(storedValue).not.toBeNull();

    expect(JSON.parse(storedValue!)).toEqual(result.current.savedLocations);
  });

  it("does not save a duplicate location", () => {
    const { result } = renderHook(() => useSavedLocations());

    act(() => {
      result.current.saveLocation(mockWeatherData);
    });

    let wasSaved = true;

    act(() => {
      wasSaved = result.current.saveLocation(mockWeatherData);
    });

    expect(wasSaved).toBe(false);
    expect(result.current.savedLocations).toHaveLength(1);
  });

  it("updates a saved location temperature", () => {
    const { result } = renderHook(() => useSavedLocations());

    act(() => {
      result.current.saveLocation(mockWeatherData);
    });

    act(() => {
      result.current.updateTemperature("-25.86-28.19", 27.4);
    });

    expect(result.current.savedLocations[0].temperature).toBe(27.4);
  });

  it("does not change other locations when updating temperature", () => {
    const secondWeatherData = {
      ...mockWeatherData,
      locationName: "Cape Town",
      latitude: -33.92,
      longitude: 18.42,
      weather: {
        current: {
          temperature_2m: 18,
        },
      },
    } as WeatherData;

    const { result } = renderHook(() => useSavedLocations());

    act(() => {
      result.current.saveLocation(mockWeatherData);
      result.current.saveLocation(secondWeatherData);
    });

    act(() => {
      result.current.updateTemperature("-25.86-28.19", 25);
    });

    expect(result.current.savedLocations).toEqual([
      expect.objectContaining({
        id: "-25.86-28.19",
        temperature: 25,
      }),
      expect.objectContaining({
        id: "-33.92-18.42",
        temperature: 18,
      }),
    ]);
  });

  it("removes a saved location", () => {
    const { result } = renderHook(() => useSavedLocations());

    act(() => {
      result.current.saveLocation(mockWeatherData);
    });

    act(() => {
      result.current.removeLocation("-25.86-28.19");
    });

    expect(result.current.savedLocations).toEqual([]);
  });

  it("updates localStorage after removing a location", () => {
    const { result } = renderHook(() => useSavedLocations());

    act(() => {
      result.current.saveLocation(mockWeatherData);
    });

    act(() => {
      result.current.removeLocation("-25.86-28.19");
    });

    expect(localStorage.getItem(STORAGE_KEY)).toBe("[]");
  });
});
