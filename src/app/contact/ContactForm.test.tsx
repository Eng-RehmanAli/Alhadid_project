import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import ContactForm from "@/app/contact/ContactForm";

const track = vi.fn();

vi.mock("@/lib/analytics", () => ({
  track: (...args: unknown[]) => track(...args),
}));

describe("ContactForm", () => {
  beforeEach(() => {
    track.mockClear();
    // jsdom Location is hard to assign; stub via delete + redefine
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete (window as any).location;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).location = { href: "" };
  });

  it("renders required contact fields", () => {
    render(<ContactForm emailHref="mailto:hello@alhadid.org" />);

    expect(screen.getByPlaceholderText("Your full name")).toBeRequired();
    expect(screen.getByPlaceholderText("your.email@example.com")).toBeRequired();
    expect(screen.getByPlaceholderText("Inquiry subject")).toBeRequired();
    expect(screen.getByPlaceholderText("Your message…")).toBeRequired();
    expect(
      screen.getByRole("button", { name: /send message/i }),
    ).toBeInTheDocument();
  });

  it("builds a mailto link and tracks lead on submit", async () => {
    const user = userEvent.setup();
    render(<ContactForm emailHref="mailto:hello@alhadid.org" />);

    await user.type(screen.getByPlaceholderText("Your full name"), "Ayesha");
    await user.type(
      screen.getByPlaceholderText("your.email@example.com"),
      "ayesha@example.com",
    );
    await user.type(screen.getByPlaceholderText("Inquiry subject"), "Courses");
    await user.type(
      screen.getByPlaceholderText("Your message…"),
      "I want details",
    );
    await user.click(screen.getByRole("button", { name: /send message/i }));

    expect(track).toHaveBeenCalledWith("generate_lead", { form_id: "contact" });
    expect(window.location.href).toContain("mailto:hello@alhadid.org");
    expect(window.location.href).toContain(encodeURIComponent("Courses"));
    expect(window.location.href).toContain(encodeURIComponent("Ayesha"));
    expect(
      screen.getByText("Your email client should open shortly."),
    ).toBeInTheDocument();
  });
});
