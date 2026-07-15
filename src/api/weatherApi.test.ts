import { beforeEach, describe, expect, it, vi } from "vitest";
import { getCurrentWeather } from "./weatherApi";

describe("getCurrentWeather", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it("fetches weather data when no cache exists", async () => {
    const mockWeather = {
      current: {
        temperature_2m: 21,
      },
    };

    const fetchSpy = vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: true,
      json: async () => mockWeather,
    } as Response);

    const result = await getCurrentWeather(-25.7479, 28.2293);

    expect(result).toEqual(mockWeather);
    expect(fetchSpy).toHaveBeenCalledTimes(1);
  });

  it("returns cached weather without calling fetch", async () => {
    const mockWeather = {
      current: {
        temperature_2m: 21,
      },
    };

    const cacheKey = "weather:-25.748:28.229";

    localStorage.setItem(
      cacheKey,
      JSON.stringify({
        data: mockWeather,
        expiresAt: Date.now() + 10000,
      }),
    );

    const fetchSpy = vi.spyOn(globalThis, "fetch");

    const result = await getCurrentWeather(-25.7479, 28.2293);

    expect(result).toEqual(mockWeather);
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("throws an error when the API request fails", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: false,
      status: 500,
    } as Response);

    await expect(getCurrentWeather(-25.7479, 28.2293)).rejects.toThrow(
      "Unable to load weather. Request failed with status 500.",
    );
  });
});
