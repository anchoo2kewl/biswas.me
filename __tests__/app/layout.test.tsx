import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";

vi.mock("next/font/google", () => ({
  Manrope: () => ({ variable: "manrope-mock" }),
  Fraunces: () => ({ variable: "fraunces-mock" }),
}));
vi.mock("@/components/theme-provider", () => ({
  ThemeProvider: ({ children }: { children: React.ReactNode }) => <div data-testid="theme-provider">{children}</div>,
}));
vi.mock("../styles/globals.css", () => ({}));
import RootLayout, { metadata } from "@/app/layout";

describe("RootLayout", () => {
  it("renders children inside ThemeProvider", () => {
    render(<RootLayout><div>Test Content</div></RootLayout>);
    expect(screen.getByText("Test Content")).toBeInTheDocument();
    expect(screen.getByTestId("theme-provider")).toBeInTheDocument();
  });
  it("exports engineering leadership metadata", () => {
    expect(metadata.title).toBe("Anshuman Biswas | Hands-on Engineering Leadership in AI, Cloud & Security");
    expect(metadata.description).toContain("VP of Engineering");
    expect(metadata.description).toContain("multi-team");
    expect(metadata.alternates?.canonical).toBe("/");
  });
});
