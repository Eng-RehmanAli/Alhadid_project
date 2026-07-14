import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import SignupForm from "@/components/SignupForm";

vi.mock("next/link", () => ({
  default: ({
    href,
    children,
    ...props
  }: {
    href: string;
    children: React.ReactNode;
  }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

vi.mock("@/lib/auth-actions", () => ({
  signupAction: vi.fn(async () => ({})),
}));

describe("SignupForm", () => {
  it("renders name, email, password fields and login link", () => {
    render(<SignupForm next="/account" />);

    expect(screen.getByPlaceholderText("Your full name")).toBeRequired();
    expect(screen.getByPlaceholderText("your.email@example.com")).toHaveAttribute(
      "type",
      "email",
    );
    expect(screen.getByPlaceholderText("At least 8 characters")).toHaveAttribute(
      "type",
      "password",
    );
    expect(screen.getByPlaceholderText("Repeat password")).toHaveAttribute(
      "type",
      "password",
    );
    expect(
      screen.getByRole("button", { name: "Create account" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Log In" })).toHaveAttribute(
      "href",
      "/login",
    );
    expect(document.querySelector('input[name="next"]')).toHaveValue("/account");
  });

  it("does not show an error alert by default", () => {
    render(<SignupForm />);
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });
});
