import { describe, expect, it } from "vitest";
import {
  formatDateOnly,
  formatDateTime,
  formatDayTitle,
  formatHour,
  formatTime,
  getLocalDateString,
  parseDateOnly,
} from "./dateFormatters";

describe("dateFormatters", () => {
  describe("parseDateOnly", () => {
    it("creates a date from a yyyy-mm-dd string", () => {
      const date = parseDateOnly("2026-07-15");

      expect(date.getFullYear()).toBe(2026);
      expect(date.getMonth()).toBe(6);
      expect(date.getDate()).toBe(15);
    });
  });

  describe("getLocalDateString", () => {
    it("formats a date as yyyy-mm-dd", () => {
      const date = new Date(2026, 6, 15);

      expect(getLocalDateString(date)).toBe("2026-07-15");
    });

    it("pads month and day values", () => {
      const date = new Date(2026, 0, 5);

      expect(getLocalDateString(date)).toBe("2026-01-05");
    });
  });

  describe("formatDateOnly", () => {
    it("formats a date-only string", () => {
      const result = formatDateOnly("2026-07-15");

      expect(result).toContain("Wednesday");
      expect(result).toContain("July");
      expect(result).toContain("15");
    });
  });

  describe("formatDayTitle", () => {
    it("formats a short date title", () => {
      const result = formatDayTitle("2026-07-15");

      expect(result).toContain("Jul");
      expect(result).toContain("15");
    });
  });

  describe("formatDateTime", () => {
    it("formats a datetime string", () => {
      const result = formatDateTime("2026-07-15T10:30:00");

      expect(result).toContain("Wednesday");
      expect(result).toContain("July");
      expect(result).toContain("15");
    });
  });

  describe("formatTime", () => {
    it("formats a time value", () => {
      const result = formatTime("2026-07-15T10:30:00");

      expect(result).toMatch(/10:30|10:30 AM/);
    });
  });

  describe("formatHour", () => {
    it("formats an hourly value", () => {
      const result = formatHour("2026-07-15T15:00:00");

      expect(result.toLowerCase()).toMatch(/3 pm|3:00 pm|15/);
    });
  });
});
