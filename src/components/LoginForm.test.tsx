import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import LoginForm from "@/components/LoginForm";

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
  loginAction: vi.fn(async () => ({})),
}));

describe("LoginForm", () => {
  it("renders email, password, submit, and signup link", () => {
    render(<LoginForm next="/courses" />);

    expect(screen.getByPlaceholderText("your.email@example.com")).toHaveAttribute(
      "type",
      "email",
    );
    expect(screen.getByPlaceholderText("your.email@example.com")).toBeRequired();
    expect(screen.getByPlaceholderText("Your password")).toHaveAttribute(
      "type",
      "password",
    );
    expect(screen.getByRole("button", { name: "Log In" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Sign up" })).toHaveAttribute(
      "href",
      "/signup",
    );
    expect(document.querySelector('input[name="next"]')).toHaveValue("/courses");
  });

  it("does not show an error alert by default", () => {
    render(<LoginForm />);
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });
});
