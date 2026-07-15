import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Notification } from "./Notification";

describe("Notification", () => {
  it("renders the notification message", () => {
    render(<Notification message="Weather loaded successfully" />);

    expect(screen.getByText("Weather loaded successfully")).toBeInTheDocument();
  });

  it("renders as an alert", () => {
    render(<Notification message="Weather loaded successfully" />);

    expect(screen.getByRole("alert")).toBeInTheDocument();
  });

  it("uses success styling by default", () => {
    render(<Notification message="Weather loaded successfully" />);

    expect(screen.getByRole("alert")).toHaveClass(
      "notification",
      "notification-success",
    );
  });

  it("uses error styling when type is error", () => {
    render(<Notification message="Failed to load weather" type="error" />);

    expect(screen.getByRole("alert")).toHaveClass(
      "notification",
      "notification-error",
    );
  });

  it("renders a close button when onClose is provided", () => {
    render(
      <Notification message="Weather loaded successfully" onClose={vi.fn()} />,
    );

    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("does not render a close button when onClose is not provided", () => {
    render(<Notification message="Weather loaded successfully" />);

    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("calls onClose when the close button is clicked", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();

    render(
      <Notification message="Weather loaded successfully" onClose={onClose} />,
    );

    await user.click(screen.getByRole("button"));

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("renders the correct close button text", () => {
    render(
      <Notification message="Weather loaded successfully" onClose={vi.fn()} />,
    );

    expect(screen.getByRole("button")).toHaveTextContent("×");
  });
});
