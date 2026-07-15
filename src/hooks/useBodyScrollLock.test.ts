import { renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { useBodyScrollLock } from "./useBodyScrollLock";

describe("useBodyScrollLock", () => {
  it("does not lock scrolling when locked is false", () => {
    document.body.style.overflow = "";

    renderHook(() => useBodyScrollLock(false));

    expect(document.body.style.overflow).toBe("");
  });

  it("locks scrolling when locked is true", () => {
    document.body.style.overflow = "";

    renderHook(() => useBodyScrollLock(true));

    expect(document.body.style.overflow).toBe("hidden");
  });

  it("restores the previous overflow value on unmount", () => {
    document.body.style.overflow = "auto";

    const { unmount } = renderHook(() => useBodyScrollLock(true));

    expect(document.body.style.overflow).toBe("hidden");

    unmount();

    expect(document.body.style.overflow).toBe("auto");
  });

  it("restores overflow when locked changes from true to false", () => {
    document.body.style.overflow = "scroll";

    const { rerender } = renderHook(({ locked }) => useBodyScrollLock(locked), {
      initialProps: {
        locked: true,
      },
    });

    expect(document.body.style.overflow).toBe("hidden");

    rerender({
      locked: false,
    });

    expect(document.body.style.overflow).toBe("scroll");
  });
});
