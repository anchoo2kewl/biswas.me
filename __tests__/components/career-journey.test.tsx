import { beforeEach, afterEach, describe, it, expect, vi } from "vitest";
import { cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CareerJourney } from "@/components/career-journey";
import { BuilderPortrait } from "@/components/builder-portrait";
import profile from "@/lib/profile.json";

const nativeShow = Object.getOwnPropertyDescriptor(HTMLDialogElement.prototype, "showModal");
const nativeClose = Object.getOwnPropertyDescriptor(HTMLDialogElement.prototype, "close");
beforeEach(() => {
  Object.defineProperty(HTMLDialogElement.prototype, "showModal", { configurable: true, writable: true, value: function (this: HTMLDialogElement) { this.setAttribute("open", ""); } });
  Object.defineProperty(HTMLDialogElement.prototype, "close", { configurable: true, writable: true, value: function (this: HTMLDialogElement) { this.removeAttribute("open"); } });
});
afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  if (nativeShow) Object.defineProperty(HTMLDialogElement.prototype, "showModal", nativeShow); else Reflect.deleteProperty(HTMLDialogElement.prototype, "showModal");
  if (nativeClose) Object.defineProperty(HTMLDialogElement.prototype, "close", nativeClose); else Reflect.deleteProperty(HTMLDialogElement.prototype, "close");
});

describe("Interactive career chapters", () => {
  it("exposes keyboard-operable chapters and all milestone anchors", () => {
    const { container } = render(<CareerJourney />);
    expect(screen.getAllByRole("button", { name: /^Explore / })).toHaveLength(7);
    expect(within(screen.getByRole("navigation", { name: "Career milestones" })).getAllByRole("link")).toHaveLength(7);
    expect(container.textContent).not.toMatch(/~(?:15|40|70)/);
  });
  it("opens the Veeva story and restores focus after closing", async () => {
    render(<CareerJourney />);
    const button = screen.getByRole("button", { name: "Explore Veeva Systems" });
    await userEvent.click(button);
    const dialog = screen.getByRole("dialog");
    expect(within(dialog).getByRole("heading", { name: "Veeva Systems" })).toBeInTheDocument();
    expect(within(dialog).getByText(/Built the team from the ground up/)).toBeInTheDocument();
    expect(within(dialog).getByText(/Carried this hands-on team-building/)).toBeInTheDocument();
    await userEvent.click(within(dialog).getByRole("button", { name: "Close details" }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(button).toHaveFocus();
  });
  it("moves through chapters without leaving the dialog", async () => {
    render(<CareerJourney />);
    await userEvent.click(screen.getByRole("button", { name: "Explore Veeva Systems" }));
    await userEvent.click(screen.getByRole("button", { name: /Earlier chapter/ }));
    expect(within(screen.getByRole("dialog")).getByRole("heading", { name: "IBM Turbonomic" })).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: /Newer chapter/ }));
    expect(within(screen.getByRole("dialog")).getByRole("heading", { name: "Veeva Systems" })).toBeInTheDocument();
  });
  it("keeps recruiting and team-building evidence in both resume roles", () => {
    expect(profile.skills[0].text).toContain("hiring");
    expect(profile.experience[1].bullets.join(" ")).toMatch(/from scratch, hiring/);
    expect(profile.experience[0].bullets.join(" ")).toContain("hire and develop teams");
  });
});

describe("Original builder portrait treatment", () => {
  it("offers interactive design principles without team-size counts", async () => {
    const { container } = render(<BuilderPortrait />);
    await userEvent.click(screen.getByRole("button", { name: "Security" }));
    expect(screen.getByRole("button", { name: "Security" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByText(/Resilience and security belong in the architecture/)).toBeInTheDocument();
    expect(container.textContent).not.toMatch(/~(?:15|40|70)/);
  });
});
