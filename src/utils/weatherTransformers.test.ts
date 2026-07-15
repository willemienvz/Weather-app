import { describe, expect, it } from "vitest";
import type { OpenMeteoCurrentWeatherResponse } from "../types/weather";
import { mapDailyWeather } from "./weatherTransformers";

describe("mapDailyWeather", () => {
  const mockWeather = {
    daily: {
      time: ["2026-07-15", "2026-07-16"],
      weather_code: [0, 61],
      temperature_2m_max: [24.2, 18.7],
      temperature_2m_min: [12.4, 9.1],
      apparent_temperature_max: [23.5, 17.9],
      apparent_temperature_min: [11.8, 8.4],
      precipitation_probability_max: [5, 80],
      wind_speed_10m_max: [12.3, 24.5],
      sunrise: ["2026-07-15T06:47", "2026-07-16T06:46"],
      sunset: ["2026-07-15T17:35", "2026-07-16T17:36"],
    },
  } as unknown as OpenMeteoCurrentWeatherResponse;

  it("maps daily weather into ForecastDay objects", () => {
    const result = mapDailyWeather(mockWeather);

    expect(result).toHaveLength(2);

    expect(result[0]).toEqual({
      index: 0,
      date: "2026-07-15",
      weatherCode: 0,
      temperatureMax: 24.2,
      temperatureMin: 12.4,
      apparentTemperatureMax: 23.5,
      apparentTemperatureMin: 11.8,
      precipitationProbability: 5,
      windSpeed: 12.3,
      sunrise: "2026-07-15T06:47",
      sunset: "2026-07-15T17:35",
    });
  });

  it("maps all entries in the daily arrays", () => {
    const result = mapDailyWeather(mockWeather);

    expect(result[1]).toEqual({
      index: 1,
      date: "2026-07-16",
      weatherCode: 61,
      temperatureMax: 18.7,
      temperatureMin: 9.1,
      apparentTemperatureMax: 17.9,
      apparentTemperatureMin: 8.4,
      precipitationProbability: 80,
      windSpeed: 24.5,
      sunrise: "2026-07-16T06:46",
      sunset: "2026-07-16T17:36",
    });
  });

  it("preserves the array order", () => {
    const result = mapDailyWeather(mockWeather);

    expect(result.map((day) => day.date)).toEqual(["2026-07-15", "2026-07-16"]);
  });

  it("assigns the correct index to each day", () => {
    const result = mapDailyWeather(mockWeather);

    expect(result[0].index).toBe(0);
    expect(result[1].index).toBe(1);
  });

  it("returns an empty array when there is no daily data", () => {
    const weather = {
      daily: {
        time: [],
        weather_code: [],
        temperature_2m_max: [],
        temperature_2m_min: [],
        apparent_temperature_max: [],
        apparent_temperature_min: [],
        precipitation_probability_max: [],
        wind_speed_10m_max: [],
        sunrise: [],
        sunset: [],
      },
    } as unknown as OpenMeteoCurrentWeatherResponse;

    expect(mapDailyWeather(weather)).toEqual([]);
  });
});
