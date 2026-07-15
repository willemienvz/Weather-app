import { describe, expect, it } from "vitest";
import { getWeatherCondition, getWeatherIcon } from "./weatherConditions";

describe("weatherConditions", () => {
  describe("getWeatherCondition", () => {
    it("returns the correct condition for clear sky", () => {
      expect(getWeatherCondition(0)).toEqual({
        description: "Clear sky",
        icon: "☀️",
        nightIcon: "🌙",
      });
    });

    it("returns the correct condition for rain", () => {
      expect(getWeatherCondition(63)).toEqual({
        description: "Rain",
        icon: "🌧️",
      });
    });

    it("returns the correct condition for thunderstorm", () => {
      expect(getWeatherCondition(95)).toEqual({
        description: "Thunderstorm",
        icon: "⛈️",
      });
    });

    it("returns the correct condition for snow", () => {
      expect(getWeatherCondition(73)).toEqual({
        description: "Snow",
        icon: "🌨️",
      });
    });

    it("returns the default condition for unknown codes", () => {
      expect(getWeatherCondition(999)).toEqual({
        description: "Unknown conditions",
        icon: "❔",
        nightIcon: "🌙",
      });
    });
  });

  describe("getWeatherIcon", () => {
    it("returns the day icon by default", () => {
      expect(getWeatherIcon(0)).toBe("☀️");
    });

    it("returns the day icon when isDay is true", () => {
      expect(getWeatherIcon(0, true)).toBe("☀️");
    });

    it("returns the night icon when available", () => {
      expect(getWeatherIcon(0, false)).toBe("🌙");
    });

    it("returns the night icon for mainly clear conditions", () => {
      expect(getWeatherIcon(1, false)).toBe("🌙");
    });

    it("returns the night icon for partly cloudy conditions", () => {
      expect(getWeatherIcon(2, false)).toBe("☁️");
    });

    it("falls back to the normal icon when no night icon exists", () => {
      expect(getWeatherIcon(61, false)).toBe("🌧️");
    });

    it("returns the default icon for unknown codes during the day", () => {
      expect(getWeatherIcon(999, true)).toBe("❔");
    });

    it("returns the default night icon for unknown codes at night", () => {
      expect(getWeatherIcon(999, false)).toBe("🌙");
    });
  });
});
