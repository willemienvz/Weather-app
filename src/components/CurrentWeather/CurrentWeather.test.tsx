import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type {
  ForecastDay,
  OpenMeteoCurrentWeatherResponse,
} from "../../types/weather";
import { CurrentWeather } from "./CurrentWeather";

const mockWeather = {
  current: {
    time: "2026-07-15T10:30",
    temperature_2m: 21.4,
    apparent_temperature: 20.6,
    relative_humidity_2m: 58,
    weather_code: 2,
    wind_speed_10m: 14.6,
    visibility: 12500,
    pressure_msl: 1018.4,
  },
  hourly_units: {
    temperature_2m: "°C",
  },
} as OpenMeteoCurrentWeatherResponse;

const mockSelectedDay: ForecastDay = {
  index: 0,
  date: "2026-07-16",
  weatherCode: 61,
  temperatureMax: 24.6,
  temperatureMin: 12.4,
  apparentTemperatureMax: 23.8,
  apparentTemperatureMin: 11.5,
  precipitationProbability: 65,
  windSpeed: 19.7,
  sunrise: "2026-07-16T06:45",
  sunset: "2026-07-16T17:35",
};

describe("CurrentWeather", () => {
  it("displays the location name", () => {
    render(
      <CurrentWeather
        locationName="Centurion"
        weather={mockWeather}
        selectedDay={null}
      />,
    );

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "Centurion",
      }),
    ).toBeInTheDocument();
  });

  it("displays current weather information when no day is selected", () => {
    render(
      <CurrentWeather
        locationName="Centurion"
        weather={mockWeather}
        selectedDay={null}
      />,
    );

    expect(screen.getByText("Partly cloudy")).toBeInTheDocument();
    expect(screen.getByText("Feels like 21°C")).toBeInTheDocument();

    expect(screen.getByText("Humidity")).toBeInTheDocument();
    expect(screen.getByText("58%")).toBeInTheDocument();

    expect(screen.getByText("Visibility")).toBeInTheDocument();
    expect(screen.getByText("12.5 km")).toBeInTheDocument();

    expect(screen.getByText("Pressure")).toBeInTheDocument();
    expect(screen.getByText("1018 hPa")).toBeInTheDocument();

    expect(screen.getByText("Wind")).toBeInTheDocument();
    expect(screen.getByText("15 km/h")).toBeInTheDocument();
  });

  it("does not display selected-day details for current weather", () => {
    render(
      <CurrentWeather
        locationName="Centurion"
        weather={mockWeather}
        selectedDay={null}
      />,
    );

    expect(screen.queryByText("Rain chance")).not.toBeInTheDocument();
    expect(screen.queryByText("Sunrise")).not.toBeInTheDocument();
    expect(screen.queryByText("Sunset")).not.toBeInTheDocument();
  });

  it("displays the selected day's weather information", () => {
    render(
      <CurrentWeather
        locationName="Centurion"
        weather={mockWeather}
        selectedDay={mockSelectedDay}
      />,
    );

    expect(screen.getByText("Light rain")).toBeInTheDocument();

    expect(
      screen.getByText("Feels like up to 24°C · Low 12°C"),
    ).toBeInTheDocument();

    expect(screen.getByText("Rain chance")).toBeInTheDocument();
    expect(screen.getByText("65%")).toBeInTheDocument();

    expect(screen.getByText("Wind")).toBeInTheDocument();
    expect(screen.getByText("20 km/h")).toBeInTheDocument();

    expect(screen.getByText("Sunrise")).toBeInTheDocument();
    expect(screen.getByText("Sunset")).toBeInTheDocument();
  });

  it("hides current-only details when a day is selected", () => {
    render(
      <CurrentWeather
        locationName="Centurion"
        weather={mockWeather}
        selectedDay={mockSelectedDay}
      />,
    );

    expect(screen.queryByText("Humidity")).not.toBeInTheDocument();
    expect(screen.queryByText("Visibility")).not.toBeInTheDocument();
    expect(screen.queryByText("Pressure")).not.toBeInTheDocument();
  });

  it("uses the selected day's weather icon and accessible description", () => {
    render(
      <CurrentWeather
        locationName="Centurion"
        weather={mockWeather}
        selectedDay={mockSelectedDay}
      />,
    );

    expect(
      screen.getByRole("img", {
        name: "Light rain",
      }),
    ).toHaveTextContent("🌧️");
  });

  it("uses the current weather icon when no day is selected", () => {
    render(
      <CurrentWeather
        locationName="Centurion"
        weather={mockWeather}
        selectedDay={null}
      />,
    );

    expect(
      screen.getByRole("img", {
        name: "Partly cloudy",
      }),
    ).toHaveTextContent("⛅");
  });
});
