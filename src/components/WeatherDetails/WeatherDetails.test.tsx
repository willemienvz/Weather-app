import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { OpenMeteoCurrentWeatherResponse } from "../../types/weather";
import { WeatherDetails } from "./WeatherDetails";

const mockWeather = {
  current: {
    precipitation: 1.8,
    relative_humidity_2m: 67,
  },
  current_units: {
    precipitation: "mm",
    relative_humidity_2m: "%",
  },
  daily: {
    sunrise: ["2026-07-15T06:47"],
    sunset: ["2026-07-15T17:35"],
    uv_index_max: [7.2],
  },
} as unknown as OpenMeteoCurrentWeatherResponse;

describe("WeatherDetails", () => {
  it("renders all weather detail cards", () => {
    render(<WeatherDetails weather={mockWeather} />);

    expect(
      screen.getByRole("heading", {
        level: 3,
        name: "Sunrise & Sunset",
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("heading", {
        level: 3,
        name: "UV Index",
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("heading", {
        level: 3,
        name: "Precipitation",
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("heading", {
        level: 3,
        name: "Humidity",
      }),
    ).toBeInTheDocument();
  });

  it("displays sunrise and sunset times", () => {
    render(<WeatherDetails weather={mockWeather} />);

    expect(screen.getByText("Sunrise")).toBeInTheDocument();
    expect(screen.getByText("Sunset")).toBeInTheDocument();

    expect(screen.getByText("06:47")).toBeInTheDocument();
    expect(screen.getByText("17:35")).toBeInTheDocument();
  });

  it("displays the UV index and its label", () => {
    render(<WeatherDetails weather={mockWeather} />);

    expect(screen.getByText("7.2")).toBeInTheDocument();
    expect(screen.getByText("High")).toBeInTheDocument();
  });

  it("sets the correct UV progressbar attributes", () => {
    render(<WeatherDetails weather={mockWeather} />);

    const progressbars = screen.getAllByRole("progressbar");

    expect(progressbars[0]).toHaveAttribute("aria-valuenow", "7.2");
  });

  it("sets the UV progress fill width", () => {
    const { container } = render(<WeatherDetails weather={mockWeather} />);

    const fill = container.querySelector(".uv-progress__fill");

    expect(fill).toHaveStyle({
      width: `${(7.2 / 11) * 100}%`,
    });
  });

  it("caps the UV progress width at 100 percent", () => {
    const extremeWeather = {
      ...mockWeather,
      daily: {
        ...mockWeather.daily,
        uv_index_max: [14],
      },
    } as unknown as OpenMeteoCurrentWeatherResponse;

    const { container } = render(<WeatherDetails weather={extremeWeather} />);

    const fill = container.querySelector(".uv-progress__fill");

    expect(fill).toHaveStyle({
      width: "100%",
    });

    expect(screen.getByText("Extreme")).toBeInTheDocument();
  });

  it("displays precipitation with its unit", () => {
    render(<WeatherDetails weather={mockWeather} />);

    expect(screen.getByText("Precipitation")).toBeInTheDocument();
    expect(screen.getByText("mm")).toBeInTheDocument();
  });

  it("displays humidity with its unit", () => {
    render(<WeatherDetails weather={mockWeather} />);

    expect(screen.getByText("67")).toBeInTheDocument();
    expect(screen.getByText("%")).toBeInTheDocument();
  });

  it("sets the correct humidity progressbar attributes", () => {
    render(<WeatherDetails weather={mockWeather} />);

    const progressbar = screen.getByRole("progressbar", {
      name: "Humidity",
    });

    expect(progressbar).toHaveAttribute("aria-valuemin", "0");
    expect(progressbar).toHaveAttribute("aria-valuemax", "100");
    expect(progressbar).toHaveAttribute("aria-valuenow", "67");
  });

  it("sets the humidity progress fill width", () => {
    const { container } = render(<WeatherDetails weather={mockWeather} />);

    const fill = container.querySelector(".humidity-progress__fill");

    expect(fill).toHaveStyle({
      width: "67%",
    });
  });

  it("displays unavailable when sunrise or sunset is missing", () => {
    const weatherWithoutTimes = {
      ...mockWeather,
      daily: {
        ...mockWeather.daily,
        sunrise: [],
        sunset: [],
      },
    } as unknown as OpenMeteoCurrentWeatherResponse;

    render(<WeatherDetails weather={weatherWithoutTimes} />);

    expect(screen.getAllByText("Unavailable")).toHaveLength(2);
  });
});
