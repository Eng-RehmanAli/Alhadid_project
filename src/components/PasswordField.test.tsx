import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { PasswordField } from "@/components/PasswordField";

describe("PasswordField", () => {
  it("renders a password input hidden by default", () => {
    render(
      <PasswordField
        name="password"
        label="Password"
        placeholder="Your password"
        autoComplete="current-password"
      />,
    );

    const input = screen.getByPlaceholderText("Your password");
    expect(input).toHaveAttribute("type", "password");
    expect(input).toHaveAttribute("name", "password");
    expect(input).toBeRequired();
  });

  it("toggles visibility when the eye button is clicked", async () => {
    const user = userEvent.setup();
    render(
      <PasswordField
        name="password"
        label="Password"
        placeholder="Your password"
        autoComplete="current-password"
      />,
    );

    const input = screen.getByPlaceholderText("Your password");
    const toggle = screen.getByRole("button", { name: "Show password" });

    await user.click(toggle);
    expect(input).toHaveAttribute("type", "text");
    expect(screen.getByRole("button", { name: "Hide password" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );

    await user.click(screen.getByRole("button", { name: "Hide password" }));
    expect(input).toHaveAttribute("type", "password");
  });
});
