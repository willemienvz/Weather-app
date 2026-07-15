import { act, renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { getCurrentWeather, searchLocation } from "../api/weatherApi";
import type {
  ForecastDay,
  OpenMeteoCurrentWeatherResponse,
} from "../types/weather";
import { formatLocationName } from "../utils/formatLocationName";
import { useWeather } from "./useWeather";

vi.mock("../api/weatherApi", () => ({
  searchLocation: vi.fn(),
  getCurrentWeather: vi.fn(),
}));

vi.mock("../utils/formatLocationName", () => ({
  formatLocationName: vi.fn(),
}));

const mockedSearchLocation = vi.mocked(searchLocation);
const mockedGetCurrentWeather = vi.mocked(getCurrentWeather);
const mockedFormatLocationName = vi.mocked(formatLocationName);
type SearchLocationResult = Awaited<ReturnType<typeof searchLocation>>;

const mockLocation = {
  name: "Centurion",
  latitude: -25.86,
  longitude: 28.19,
  country: "South Africa",
  admin1: "Gauteng",
} as SearchLocationResult;

const mockWeather = {
  current: {
    time: "2026-07-15T11:00",
    temperature_2m: 21,
  },
} as unknown as OpenMeteoCurrentWeatherResponse;

const mockSelectedDay = {
  index: 3,
  date: "2026-07-16",
  weatherCode: 0,
  temperatureMax: 24,
  temperatureMin: 12,
  apparentTemperatureMax: 23,
  apparentTemperatureMin: 11,
  precipitationProbability: 10,
  windSpeed: 12,
  sunrise: "2026-07-16T06:45",
  sunset: "2026-07-16T17:35",
} satisfies ForecastDay;

describe("useWeather", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockedFormatLocationName.mockReturnValue(
      "Centurion, Gauteng, South Africa",
    );
  });

  it("starts with the correct initial state", () => {
    const { result } = renderHook(() => useWeather());

    expect(result.current.selectedDay).toBeNull();
    expect(result.current.weatherData).toBeNull();
    expect(result.current.loading).toBe(false);
    expect(result.current.notification).toBeNull();
  });

  it("searches for a location and loads its weather", async () => {
    mockedSearchLocation.mockResolvedValue(mockLocation);
    mockedGetCurrentWeather.mockResolvedValue(mockWeather);

    const { result } = renderHook(() => useWeather());

    await act(async () => {
      await result.current.searchWeather("Centurion");
    });

    expect(mockedSearchLocation).toHaveBeenCalledTimes(1);
    expect(mockedSearchLocation).toHaveBeenCalledWith("Centurion");

    expect(mockedGetCurrentWeather).toHaveBeenCalledWith(-25.86, 28.19);

    expect(mockedFormatLocationName).toHaveBeenCalledWith(mockLocation);

    expect(result.current.weatherData).toEqual({
      locationName: "Centurion, Gauteng, South Africa",
      latitude: -25.86,
      longitude: 28.19,
      weather: mockWeather,
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.notification).toBeNull();
  });

  it("sets loading while a weather search is in progress", async () => {
    let resolveSearch: ((location: typeof mockLocation) => void) | undefined;

    mockedSearchLocation.mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveSearch = resolve;
        }),
    );

    mockedGetCurrentWeather.mockResolvedValue(mockWeather);

    const { result } = renderHook(() => useWeather());

    let searchPromise: Promise<void>;

    act(() => {
      searchPromise = result.current.searchWeather("Centurion");
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(true);
    });

    await act(async () => {
      resolveSearch?.(mockLocation);
      await searchPromise!;
    });

    expect(result.current.loading).toBe(false);
  });

  it("resets the selected day after a successful search", async () => {
    mockedSearchLocation.mockResolvedValue(mockLocation);
    mockedGetCurrentWeather.mockResolvedValue(mockWeather);

    const { result } = renderHook(() => useWeather());

    act(() => {
      result.current.setSelectedDay(mockSelectedDay);
    });

    expect(result.current.selectedDay).toEqual(mockSelectedDay);

    await act(async () => {
      await result.current.searchWeather("Centurion");
    });

    expect(result.current.selectedDay).toBeNull();
  });

  it("shows the API error message when searching fails with an Error", async () => {
    mockedSearchLocation.mockRejectedValue(new Error("Location not found"));

    const { result } = renderHook(() => useWeather());

    await act(async () => {
      await result.current.searchWeather("Invalid city");
    });

    expect(result.current.notification).toEqual({
      message: "Location not found",
      type: "error",
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.weatherData).toBeNull();
    expect(mockedGetCurrentWeather).not.toHaveBeenCalled();
  });

  it("shows the fallback message for a non-Error search failure", async () => {
    mockedSearchLocation.mockRejectedValue("Request failed");

    const { result } = renderHook(() => useWeather());

    await act(async () => {
      await result.current.searchWeather("Invalid city");
    });

    expect(result.current.notification).toEqual({
      message: "Unable to load weather for this location.",
      type: "error",
    });
  });

  it("loads weather directly using coordinates", async () => {
    mockedGetCurrentWeather.mockResolvedValue(mockWeather);

    const { result } = renderHook(() => useWeather());

    let returnedData;

    await act(async () => {
      returnedData = await result.current.loadWeatherByCoordinates(
        -25.86,
        28.19,
        "Centurion",
      );
    });

    const expectedData = {
      locationName: "Centurion",
      latitude: -25.86,
      longitude: 28.19,
      weather: mockWeather,
    };

    expect(mockedSearchLocation).not.toHaveBeenCalled();

    expect(mockedGetCurrentWeather).toHaveBeenCalledWith(-25.86, 28.19);

    expect(returnedData).toEqual(expectedData);
    expect(result.current.weatherData).toEqual(expectedData);
    expect(result.current.selectedDay).toBeNull();
    expect(result.current.loading).toBe(false);
  });

  it("returns null when loading weather by coordinates fails", async () => {
    mockedGetCurrentWeather.mockRejectedValue(
      new Error("Weather service unavailable"),
    );

    const { result } = renderHook(() => useWeather());

    let returnedData;

    await act(async () => {
      returnedData = await result.current.loadWeatherByCoordinates(
        -25.86,
        28.19,
        "Centurion",
      );
    });

    expect(returnedData).toBeNull();

    expect(result.current.notification).toEqual({
      message: "Weather service unavailable",
      type: "error",
    });

    expect(result.current.loading).toBe(false);
  });

  it("uses the fallback coordinate error message for non-Error failures", async () => {
    mockedGetCurrentWeather.mockRejectedValue("Failed");

    const { result } = renderHook(() => useWeather());

    await act(async () => {
      await result.current.loadWeatherByCoordinates(-25.86, 28.19, "Centurion");
    });

    expect(result.current.notification).toEqual({
      message: "Unable to load weather information.",
      type: "error",
    });
  });

  it("clears an existing notification before starting a new request", async () => {
    let resolveSearch: ((location: typeof mockLocation) => void) | undefined;

    mockedSearchLocation.mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveSearch = resolve;
        }),
    );

    mockedGetCurrentWeather.mockResolvedValue(mockWeather);

    const { result } = renderHook(() => useWeather());

    act(() => {
      result.current.setNotification({
        message: "Previous error",
        type: "error",
      });
    });

    expect(result.current.notification).not.toBeNull();

    let searchPromise: Promise<void>;

    act(() => {
      searchPromise = result.current.searchWeather("Centurion");
    });

    await waitFor(() => {
      expect(result.current.notification).toBeNull();
      expect(result.current.loading).toBe(true);
    });

    await act(async () => {
      resolveSearch?.(mockLocation);
      await searchPromise!;
    });
  });
});
