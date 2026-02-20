import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { InteractiveTimeline } from "@/components/interactive-timeline";

// Mock lucide-react
vi.mock("lucide-react", () => ({
  X: ({ className }: any) => <span data-testid="x-icon" className={className}>X</span>,
  ExternalLink: ({ className }: any) => (
    <span data-testid="external-link-icon" className={className}>ExtLink</span>
  ),
}));

describe("InteractiveTimeline", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("renders all timeline items", () => {
    render(<InteractiveTimeline />);
    expect(screen.getByText("VP of Engineering")).toBeInTheDocument();
    expect(screen.getAllByText(/Sr. Software Engineering Manager/).length).toBe(2);
    expect(screen.getByText("Software Engineer")).toBeInTheDocument();
    expect(screen.getByText("CTO & Co-Founder")).toBeInTheDocument();
    expect(screen.getByText("Ph.D. in Computer Engineering")).toBeInTheDocument();
  });

  it("renders company names", () => {
    render(<InteractiveTimeline />);
    expect(screen.getByText("Elastio")).toBeInTheDocument();
    expect(screen.getByText("Veeva")).toBeInTheDocument();
    expect(screen.getByText("Turbonomic, an IBM Company")).toBeInTheDocument();
    expect(screen.getByText("Trend Micro")).toBeInTheDocument();
    expect(screen.getByText("Nearest")).toBeInTheDocument();
    expect(screen.getByText("Carleton University")).toBeInTheDocument();
  });

  it("renders periods for each item", () => {
    render(<InteractiveTimeline />);
    expect(screen.getByText("2025 - Present")).toBeInTheDocument();
    expect(screen.getByText("2024 - 2025")).toBeInTheDocument();
    expect(screen.getByText("2017 - 2024")).toBeInTheDocument();
    expect(screen.getByText("2016 - 2017")).toBeInTheDocument();
    expect(screen.getByText("2012 - 2014")).toBeInTheDocument();
    expect(screen.getByText("2011 - 2019")).toBeInTheDocument();
  });

  it("renders 'Click to learn more' for each item", () => {
    render(<InteractiveTimeline />);
    const learnMoreTexts = screen.getAllByText(/Click to learn more/);
    expect(learnMoreTexts).toHaveLength(6);
  });

  it("opens popup when a timeline item is clicked", async () => {
    const user = userEvent.setup();
    render(<InteractiveTimeline />);

    // Click on the Elastio timeline item
    const elastioItem = screen.getByText("Elastio").closest("[data-timeline-id]");
    const clickableArea = elastioItem!.querySelector(".cursor-pointer");
    await user.click(clickableArea!);

    // Popup should show detailed content
    expect(screen.getByText("Key Highlights:")).toBeInTheDocument();
    expect(
      screen.getByText("Architecting scalable cloud infrastructure solutions")
    ).toBeInTheDocument();
  });

  it("shows 'Learn more' link in popup for items with links", async () => {
    const user = userEvent.setup();
    render(<InteractiveTimeline />);

    const elastioItem = screen.getByText("Elastio").closest("[data-timeline-id]");
    const clickableArea = elastioItem!.querySelector(".cursor-pointer");
    await user.click(clickableArea!);

    const learnMoreLink = screen.getByText("Learn more");
    expect(learnMoreLink.closest("a")).toHaveAttribute("href", "https://elastio.com");
  });

  it("closes popup when close button is clicked", async () => {
    const user = userEvent.setup();
    render(<InteractiveTimeline />);

    // Open popup
    const elastioItem = screen.getByText("Elastio").closest("[data-timeline-id]");
    const clickableArea = elastioItem!.querySelector(".cursor-pointer");
    await user.click(clickableArea!);

    expect(screen.getByText("Key Highlights:")).toBeInTheDocument();

    // Close popup via the close button
    const closeButtons = screen.getAllByTestId("x-icon");
    const popupCloseBtn = closeButtons[0].closest("button");
    await user.click(popupCloseBtn!);

    expect(screen.queryByText("Key Highlights:")).not.toBeInTheDocument();
  });

  it("closes popup when Escape key is pressed", async () => {
    const user = userEvent.setup();
    render(<InteractiveTimeline />);

    // Open popup
    const elastioItem = screen.getByText("Elastio").closest("[data-timeline-id]");
    const clickableArea = elastioItem!.querySelector(".cursor-pointer");
    await user.click(clickableArea!);

    expect(screen.getByText("Key Highlights:")).toBeInTheDocument();

    // Press Escape
    await user.keyboard("{Escape}");

    expect(screen.queryByText("Key Highlights:")).not.toBeInTheDocument();
  });

  it("closes popup when backdrop is clicked", async () => {
    const user = userEvent.setup();
    render(<InteractiveTimeline />);

    // Open popup
    const elastioItem = screen.getByText("Elastio").closest("[data-timeline-id]");
    const clickableArea = elastioItem!.querySelector(".cursor-pointer");
    await user.click(clickableArea!);

    expect(screen.getByText("Key Highlights:")).toBeInTheDocument();

    // Click the backdrop (the overlay)
    const backdrop = screen.getByText("Key Highlights:").closest(".bg-white")!
      .parentElement!;
    fireEvent.click(backdrop);

    expect(screen.queryByText("Key Highlights:")).not.toBeInTheDocument();
  });

  it("renders timeline items with data-timeline-id attributes", () => {
    const { container } = render(<InteractiveTimeline />);
    const items = container.querySelectorAll("[data-timeline-id]");
    expect(items).toHaveLength(6);
    expect(items[0].getAttribute("data-timeline-id")).toBe("2025");
    expect(items[5].getAttribute("data-timeline-id")).toBe("2011");
  });

  it("shows images in popup for items that have them", async () => {
    const user = userEvent.setup();
    render(<InteractiveTimeline />);

    // Click on Turbonomic item (which has images)
    const turbonomicItem = screen
      .getByText("Turbonomic, an IBM Company")
      .closest("[data-timeline-id]");
    const clickableArea = turbonomicItem!.querySelector(".cursor-pointer");
    await user.click(clickableArea!);

    // Should have an image in the popup
    const img = screen.getByAltText("Turbonomic, an IBM Company");
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute("src", "/04.png");
  });

  it("shows image expand text for items with images", async () => {
    const user = userEvent.setup();
    render(<InteractiveTimeline />);

    const turbonomicItem = screen
      .getByText("Turbonomic, an IBM Company")
      .closest("[data-timeline-id]");
    const clickableArea = turbonomicItem!.querySelector(".cursor-pointer");
    await user.click(clickableArea!);

    expect(screen.getByText("Click image to expand")).toBeInTheDocument();
  });

  it("opens image modal when clicking an image in the popup", async () => {
    const user = userEvent.setup();
    render(<InteractiveTimeline />);

    // Open Turbonomic popup
    const turbonomicItem = screen
      .getByText("Turbonomic, an IBM Company")
      .closest("[data-timeline-id]");
    const clickableArea = turbonomicItem!.querySelector(".cursor-pointer");
    await user.click(clickableArea!);

    // Click the image to expand
    const img = screen.getByAltText("Turbonomic, an IBM Company");
    await user.click(img);

    // Should show the expanded image modal
    const expandedImg = screen.getByAltText("Expanded view");
    expect(expandedImg).toBeInTheDocument();
    expect(expandedImg).toHaveAttribute("src", "/04.png");
  });

  it("does not show images section for items without images", async () => {
    const user = userEvent.setup();
    render(<InteractiveTimeline />);

    // Open Elastio popup (no images)
    const elastioItem = screen.getByText("Elastio").closest("[data-timeline-id]");
    const clickableArea = elastioItem!.querySelector(".cursor-pointer");
    await user.click(clickableArea!);

    expect(screen.queryByText("Click image to expand")).not.toBeInTheDocument();
  });

  it("renders timeline line", () => {
    const { container } = render(<InteractiveTimeline />);
    const line = container.querySelector(".bg-gray-300.h-full");
    expect(line).toBeInTheDocument();
  });

  it("renders description text in each timeline card", () => {
    render(<InteractiveTimeline />);
    expect(
      screen.getByText(/Leading engineering teams in building next-generation/)
    ).toBeInTheDocument();
  });
});
