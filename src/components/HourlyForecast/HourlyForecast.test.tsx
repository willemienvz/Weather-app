import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type {
  ForecastDay,
  OpenMeteoCurrentWeatherResponse,
} from "../../types/weather";
import { HourlyForecast } from "./HourlyForecast";

const mockWeather = {
  current: {
    time: "2026-07-15T10:00",
  },
  hourly: {
    time: [
      "2026-07-15T08:00",
      "2026-07-15T09:00",
      "2026-07-15T10:00",
      "2026-07-15T11:00",
      "2026-07-15T12:00",
      "2026-07-15T13:00",
      "2026-07-15T14:00",
      "2026-07-15T15:00",
      "2026-07-15T16:00",
      "2026-07-15T17:00",

      "2026-07-16T05:00",
      "2026-07-16T06:00",
      "2026-07-16T07:00",
      "2026-07-16T08:00",
      "2026-07-16T09:00",
      "2026-07-16T10:00",
      "2026-07-16T11:00",
      "2026-07-16T12:00",
      "2026-07-16T13:00",
    ],
    temperature_2m: [
      12, 13, 14, 15, 16, 17, 18, 19, 20, 19, 8, 9, 10, 11, 12, 13, 14, 15, 16,
    ],
    weather_code: [
      0, 1, 2, 3, 61, 63, 80, 95, 45, 0, 0, 0, 1, 2, 3, 61, 63, 80, 95,
    ],
    is_day: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1],
  },
  hourly_units: {
    temperature_2m: "°C",
  },
} as unknown as OpenMeteoCurrentWeatherResponse;

const selectedDay: ForecastDay = {
  index: 4,
  date: "2026-07-16",
  weatherCode: 61,
  temperatureMax: 24,
  temperatureMin: 12,
  apparentTemperatureMax: 23,
  apparentTemperatureMin: 11,
  precipitationProbability: 60,
  windSpeed: 14,
  sunrise: "2026-07-16T06:47",
  sunset: "2026-07-16T17:34",
};

describe("HourlyForecast", () => {
  it("displays the next eight hours when no day is selected", () => {
    render(<HourlyForecast weather={mockWeather} selectedDay={null} />);

    expect(
      screen.getByRole("heading", {
        level: 2,
        name: "Hourly Forecast",
      }),
    ).toBeInTheDocument();

    const forecastItems = document.querySelectorAll(".hourly-forecast__item");

    expect(forecastItems).toHaveLength(8);

    expect(screen.getByText("14°C")).toBeInTheDocument();
  });

  it("starts the current forecast at the current API time", () => {
    render(<HourlyForecast weather={mockWeather} selectedDay={null} />);

    expect(screen.queryByText("12°C")).not.toBeInTheDocument();

    expect(screen.queryByText("13°C")).not.toBeInTheDocument();

    expect(screen.getByText("14°C")).toBeInTheDocument();
  });

  it("displays hours for the selected day", () => {
    render(<HourlyForecast weather={mockWeather} selectedDay={selectedDay} />);

    expect(
      screen.getByRole("heading", {
        level: 2,
        name: /Thursday, 16 Jul Forecast/i,
      }),
    ).toBeInTheDocument();

    const forecastItems = document.querySelectorAll(".hourly-forecast__item");

    expect(forecastItems).toHaveLength(8);
  });

  it("starts a selected future day from 6 AM", () => {
    render(<HourlyForecast weather={mockWeather} selectedDay={selectedDay} />);

    expect(screen.queryByText("8°C")).not.toBeInTheDocument();
    expect(screen.getByText("9°C")).toBeInTheDocument();
  });

  it("renders weather icons with accessible descriptions", () => {
    render(<HourlyForecast weather={mockWeather} selectedDay={null} />);

    expect(
      screen.getByRole("img", {
        name: "Partly cloudy",
      }),
    ).toHaveTextContent("⛅");

    expect(
      screen.getByRole("img", {
        name: "Rain",
      }),
    ).toHaveTextContent("🌧️");
  });

  it("returns nothing when hourly data is empty", () => {
    const emptyWeather = {
      ...mockWeather,
      hourly: {
        time: [],
        temperature_2m: [],
        weather_code: [],
        is_day: [],
      },
    } as unknown as OpenMeteoCurrentWeatherResponse;

    const { container } = render(
      <HourlyForecast weather={emptyWeather} selectedDay={null} />,
    );

    expect(container).toBeEmptyDOMElement();
  });
});
