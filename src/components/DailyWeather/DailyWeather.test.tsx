import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import type {
  ForecastDay,
  OpenMeteoCurrentWeatherResponse,
} from "../../types/weather";
import { DailyWeather } from "./DailyWeather";

const mockWeather = {
  daily: {
    time: [
      "2026-07-12",
      "2026-07-13",
      "2026-07-14",
      "2026-07-15",
      "2026-07-16",
      "2026-07-17",
      "2026-07-18",
      "2026-07-19",
      "2026-07-20",
      "2026-07-21",
    ],
    weather_code: [0, 1, 2, 3, 61, 63, 80, 45, 95, 71],
    temperature_2m_max: [20, 21, 22, 23, 24, 25, 26, 27, 28, 19],
    temperature_2m_min: [8, 9, 10, 11, 12, 13, 14, 15, 16, 5],
    apparent_temperature_max: [19, 20, 21, 22, 23, 24, 25, 26, 27, 18],
    apparent_temperature_min: [7, 8, 9, 10, 11, 12, 13, 14, 15, 4],
    precipitation_probability_max: [0, 5, 10, 15, 60, 70, 50, 20, 80, 30],
    wind_speed_10m_max: [10, 11, 12, 13, 14, 15, 16, 17, 18, 19],
    sunrise: [
      "2026-07-12T06:50",
      "2026-07-13T06:49",
      "2026-07-14T06:49",
      "2026-07-15T06:48",
      "2026-07-16T06:47",
      "2026-07-17T06:47",
      "2026-07-18T06:46",
      "2026-07-19T06:45",
      "2026-07-20T06:45",
      "2026-07-21T06:44",
    ],
    sunset: [
      "2026-07-12T17:32",
      "2026-07-13T17:33",
      "2026-07-14T17:33",
      "2026-07-15T17:34",
      "2026-07-16T17:34",
      "2026-07-17T17:35",
      "2026-07-18T17:35",
      "2026-07-19T17:36",
      "2026-07-20T17:36",
      "2026-07-21T17:37",
    ],
  },
} as unknown as OpenMeteoCurrentWeatherResponse;

const selectedForecastDay: ForecastDay = {
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

describe("DailyWeather", () => {
  it("displays the seven forecast days by default", () => {
    render(
      <DailyWeather
        weather={mockWeather}
        selectedDay={null}
        onSelectDay={vi.fn()}
      />,
    );

    expect(screen.getByText("7-Day Forecast")).toHaveAttribute(
      "aria-pressed",
      "true",
    );

    expect(screen.getByText("Jul 15")).toBeInTheDocument();
    expect(screen.getByText("Jul 21")).toBeInTheDocument();

    expect(screen.queryByText("Jul 12")).not.toBeInTheDocument();
    expect(screen.queryByText("Jul 14")).not.toBeInTheDocument();

    expect(screen.getAllByRole("button")).toHaveLength(9);
  });

  it("switches to the three history days", async () => {
    const user = userEvent.setup();

    render(
      <DailyWeather
        weather={mockWeather}
        selectedDay={null}
        onSelectDay={vi.fn()}
      />,
    );

    await user.click(
      screen.getByRole("button", {
        name: "3-Day History",
      }),
    );

    expect(screen.getByText("3-Day History")).toHaveAttribute(
      "aria-pressed",
      "true",
    );

    expect(screen.getByText("Jul 12")).toBeInTheDocument();
    expect(screen.getByText("Jul 13")).toBeInTheDocument();
    expect(screen.getByText("Jul 14")).toBeInTheDocument();

    expect(screen.queryByText("Jul 15")).not.toBeInTheDocument();
  });

  it("calls onSelectDay with the clicked forecast day", async () => {
    const user = userEvent.setup();
    const onSelectDay = vi.fn();

    render(
      <DailyWeather
        weather={mockWeather}
        selectedDay={null}
        onSelectDay={onSelectDay}
      />,
    );

    const forecastCard = screen.getByText("Jul 16").closest("button");

    expect(forecastCard).not.toBeNull();

    await user.click(forecastCard!);

    expect(onSelectDay).toHaveBeenCalledTimes(1);
    expect(onSelectDay).toHaveBeenCalledWith(
      expect.objectContaining({
        date: "2026-07-16",
        weatherCode: 61,
        temperatureMax: 24,
        temperatureMin: 12,
      }),
    );
  });

  it("marks the selected day as selected", () => {
    render(
      <DailyWeather
        weather={mockWeather}
        selectedDay={selectedForecastDay}
        onSelectDay={vi.fn()}
      />,
    );

    const selectedCard = screen.getByText("Jul 16").closest("button");

    expect(selectedCard).toHaveAttribute("aria-pressed", "true");
    expect(selectedCard).toHaveClass("daily-weather__item--selected");
  });

  it("displays the weather description and accessible icon", () => {
    render(
      <DailyWeather
        weather={mockWeather}
        selectedDay={null}
        onSelectDay={vi.fn()}
      />,
    );

    expect(screen.getByText("Light rain")).toBeInTheDocument();

    expect(
      screen.getByRole("img", {
        name: "Light rain",
      }),
    ).toHaveTextContent("🌧️");
  });

  it("displays high and low temperatures", () => {
    render(
      <DailyWeather
        weather={mockWeather}
        selectedDay={null}
        onSelectDay={vi.fn()}
      />,
    );

    expect(
      screen.getByLabelText("High 24 degrees, low 12 degrees"),
    ).toBeInTheDocument();
  });
});
