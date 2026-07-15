import { describe, expect, it } from "vitest";
import { formatLocationName } from "./formatLocationName";

describe("formatLocationName", () => {
  it("formats a complete location", () => {
    expect(
      formatLocationName({
        name: "Centurion",
        admin1: "Gauteng",
        country: "South Africa",
      }),
    ).toBe("Centurion, Gauteng, South Africa");
  });

  it("formats a location without admin1", () => {
    expect(
      formatLocationName({
        name: "London",
        country: "United Kingdom",
      }),
    ).toBe("London, United Kingdom");
  });

  it("formats a location without country", () => {
    expect(
      formatLocationName({
        name: "Centurion",
        admin1: "Gauteng",
      }),
    ).toBe("Centurion, Gauteng");
  });

  it("returns only the name when optional values are missing", () => {
    expect(
      formatLocationName({
        name: "Centurion",
      }),
    ).toBe("Centurion");
  });

  it("ignores undefined values", () => {
    expect(
      formatLocationName({
        name: "Centurion",
        admin1: undefined,
        country: "South Africa",
      }),
    ).toBe("Centurion, South Africa");
  });

  it("ignores empty strings", () => {
    expect(
      formatLocationName({
        name: "Centurion",
        admin1: "",
        country: "South Africa",
      }),
    ).toBe("Centurion, South Africa");
  });
});
