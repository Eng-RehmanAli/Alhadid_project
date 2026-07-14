import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Header } from "@/components/Header";

vi.mock("next/navigation", () => ({
  usePathname: () => "/",
}));

vi.mock("next/image", () => ({
  default: (props: { alt: string; src: string }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img alt={props.alt} src={props.src} />
  ),
}));

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
  logoutAction: vi.fn(),
}));

describe("Header", () => {
  it("shows Log In when logged out", () => {
    render(<Header user={null} />);

    const loginLinks = screen.getAllByRole("link", { name: /log in/i });
    expect(loginLinks.length).toBeGreaterThan(0);
    expect(loginLinks[0]).toHaveAttribute("href", "/login");
    expect(screen.queryByRole("button", { name: /log out/i })).not.toBeInTheDocument();
  });

  it("shows account name and Log out when logged in", () => {
    render(
      <Header user={{ name: "Rehman", email: "rehman@example.com" }} />,
    );

    const accountLinks = screen.getAllByRole("link", { name: "Rehman" });
    expect(accountLinks[0]).toHaveAttribute("href", "/account");
    expect(
      screen.getAllByRole("button", { name: /log out/i }).length,
    ).toBeGreaterThan(0);
  });

  it("opens mobile menu with main nav links", async () => {
    const user = userEvent.setup();
    render(<Header user={null} />);

    await user.click(screen.getByRole("button", { name: /open menu/i }));

    const mobileNav = document.getElementById("mobile-nav");
    expect(mobileNav).not.toBeNull();
    expect(mobileNav).not.toHaveClass("hidden");

    const nav = within(mobileNav as HTMLElement);
    expect(nav.getByRole("link", { name: "Courses" })).toHaveAttribute(
      "href",
      "/courses",
    );
    expect(nav.getByRole("link", { name: "Contact" })).toHaveAttribute(
      "href",
      "/contact",
    );
  });
});
