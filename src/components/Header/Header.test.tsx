import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Header } from "./Header";

describe("Header", () => {
  it("renders the logo and title", () => {
    render(<Header onSearch={vi.fn()} onUseLocation={vi.fn()} />);

    expect(screen.getByText("WeatherApp")).toBeInTheDocument();
    expect(screen.getByAltText("logo")).toBeInTheDocument();
  });

  it("renders the search input", () => {
    render(<Header onSearch={vi.fn()} onUseLocation={vi.fn()} />);

    expect(
      screen.getByPlaceholderText("Search for a city..."),
    ).toBeInTheDocument();
  });

  it("calls onSearch when a city is submitted", async () => {
    const user = userEvent.setup();
    const onSearch = vi.fn();

    render(<Header onSearch={onSearch} onUseLocation={vi.fn()} />);

    const input = screen.getByPlaceholderText("Search for a city...");

    await user.type(input, "Pretoria");

    const form = input.closest("form");

    fireEvent.submit(form!);

    expect(onSearch).toHaveBeenCalledTimes(1);
    expect(onSearch).toHaveBeenCalledWith("Pretoria");
  });

  it("trims whitespace before searching", async () => {
    const user = userEvent.setup();
    const onSearch = vi.fn();

    render(<Header onSearch={onSearch} onUseLocation={vi.fn()} />);

    const input = screen.getByPlaceholderText("Search for a city...");

    await user.type(input, "   Centurion   ");

    const form = input.closest("form");

    fireEvent.submit(form!);

    expect(onSearch).toHaveBeenCalledWith("Centurion");
  });

  it("calls onUseLocation when location button is clicked", async () => {
    const user = userEvent.setup();
    const onUseLocation = vi.fn();

    render(<Header onSearch={vi.fn()} onUseLocation={onUseLocation} />);

    await user.click(
      screen.getByRole("button", {
        name: /use my location/i,
      }),
    );

    expect(onUseLocation).toHaveBeenCalledTimes(1);
  });

  it("renders the use my location button", () => {
    render(<Header onSearch={vi.fn()} onUseLocation={vi.fn()} />);

    expect(
      screen.getByRole("button", {
        name: /use my location/i,
      }),
    ).toBeInTheDocument();
  });
});
