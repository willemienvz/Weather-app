import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { App } from "./App";
import { useWeather } from "./hooks/useWeather";
import { useSavedLocations } from "./hooks/useSavedLocations";

vi.mock("./hooks/useWeather");
vi.mock("./hooks/useSavedLocations");

vi.mock("./hooks/useBodyScrollLock", () => ({
  useBodyScrollLock: vi.fn(),
}));

vi.mock("./components/CurrentWeather/CurrentWeather", () => ({
  CurrentWeather: ({ locationName }: { locationName: string }) => (
    <div>{locationName}</div>
  ),
}));

vi.mock("./components/HourlyForecast/HourlyForecast", () => ({
  HourlyForecast: () => <div>Hourly forecast</div>,
}));

vi.mock("./components/DailyWeather/DailyWeather", () => ({
  DailyWeather: () => <div>Daily weather</div>,
}));

vi.mock("./components/WeatherDetails/WeatherDetails", () => ({
  WeatherDetails: () => <div>Weather details</div>,
}));

const mockedUseWeather = vi.mocked(useWeather);
const mockedUseSavedLocations = vi.mocked(useSavedLocations);

describe("App", () => {
  const setNotification = vi.fn();
  const setSelectedDay = vi.fn();
  const searchWeather = vi.fn();
  const loadWeatherByCoordinates = vi.fn();

  const saveLocation = vi.fn();
  const updateTemperature = vi.fn();
  const removeLocation = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    mockedUseWeather.mockReturnValue({
      selectedDay: null,
      weatherData: null,
      loading: false,
      notification: null,
      setNotification,
      setSelectedDay,
      searchWeather,
      loadWeatherByCoordinates,
    });

    mockedUseSavedLocations.mockReturnValue({
      savedLocations: [],
      saveLocation,
      updateTemperature,
      removeLocation,
    });
  });

  it("shows the initial weather prompt", () => {
    render(<App />);

    expect(
      screen.getByText("Search for a city or use your current location."),
    ).toBeInTheDocument();
  });

  it("shows weather content when weather data is available", () => {
    mockedUseWeather.mockReturnValue({
      selectedDay: null,
      weatherData: {
        locationName: "Centurion, Gauteng, South Africa",
        latitude: -25.86,
        longitude: 28.19,
        weather: {
          current: {
            time: "2026-07-15T13:00",
            temperature_2m: 21,
          },
        },
      } as ReturnType<typeof useWeather>["weatherData"],
      loading: false,
      notification: null,
      setNotification,
      setSelectedDay,
      searchWeather,
      loadWeatherByCoordinates,
    });

    render(<App />);

    expect(
      screen.getByRole("button", {
        name: /save location/i,
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByText("Centurion, Gauteng, South Africa"),
    ).toBeInTheDocument();

    expect(screen.getByText("Hourly forecast")).toBeInTheDocument();

    expect(screen.getByText("Daily weather")).toBeInTheDocument();

    expect(screen.getByText("Weather details")).toBeInTheDocument();
  });

  it("loads weather when a saved location is selected", async () => {
    const user = userEvent.setup();

    mockedUseSavedLocations.mockReturnValue({
      savedLocations: [
        {
          id: "centurion",
          name: "Centurion",
          latitude: -25.86,
          longitude: 28.19,
          temperature: 20,
        },
      ],
      saveLocation,
      updateTemperature,
      removeLocation,
    });

    loadWeatherByCoordinates.mockResolvedValue({
      locationName: "Centurion",
      latitude: -25.86,
      longitude: 28.19,
      weather: {
        current: {
          temperature_2m: 23,
        },
      },
    } as Awaited<ReturnType<typeof loadWeatherByCoordinates>>);

    vi.spyOn(window, "scrollTo").mockImplementation(() => undefined);

    render(<App />);

    await user.click(
      screen.getByRole("button", {
        name: /Centurion 20°C/i,
      }),
    );

    expect(loadWeatherByCoordinates).toHaveBeenCalledWith(
      -25.86,
      28.19,
      "Centurion",
    );

    expect(updateTemperature).toHaveBeenCalledWith("centurion", 23);

    expect(window.scrollTo).toHaveBeenCalledWith({
      top: 0,
      behavior: "smooth",
    });
  });
});
