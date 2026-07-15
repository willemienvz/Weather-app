import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Loader } from "./Loader";

describe("Loader", () => {
  it("renders the loader", () => {
    render(<Loader />);

    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("displays the default message", () => {
    render(<Loader />);

    expect(screen.getByText("Loading weather...")).toBeInTheDocument();
  });

  it("displays a custom message", () => {
    render(<Loader message="Fetching forecast..." />);

    expect(screen.getByText("Fetching forecast...")).toBeInTheDocument();
  });

  it("has the correct accessibility attributes", () => {
    render(<Loader />);

    const loader = screen.getByRole("status");

    expect(loader).toHaveAttribute("aria-live", "polite");

    expect(loader).toHaveAttribute("aria-label", "Loading weather...");
  });

  it("marks the spinner as decorative", () => {
    const { container } = render(<Loader />);

    const spinner = container.querySelector(".loader-spinner");

    expect(spinner).toHaveAttribute("aria-hidden", "true");
  });
});
