import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";

// Mock next/font/google
vi.mock("next/font/google", () => ({
  Manrope: () => ({
    variable: "manrope-mock",
  }),
  Fraunces: () => ({
    variable: "fraunces-mock",
  }),
}));

// Mock the ThemeProvider
vi.mock("@/components/theme-provider", () => ({
  ThemeProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="theme-provider">{children}</div>
  ),
}));

// Mock the CSS import
vi.mock("../styles/globals.css", () => ({}));

import RootLayout, { metadata } from "@/app/layout";

describe("RootLayout", () => {
  it("renders children inside ThemeProvider", () => {
    // RootLayout returns <html> which can't be rendered inside a div,
    // so we test the component's output structure
    const { container } = render(
      <RootLayout>
        <div>Test Content</div>
      </RootLayout>
    );
    expect(screen.getByText("Test Content")).toBeInTheDocument();
    expect(screen.getByTestId("theme-provider")).toBeInTheDocument();
  });

  it("exports correct metadata", () => {
    expect(metadata.title).toBe(
      "Anshuman Biswas | Products, Libraries, and Systems"
    );
    expect(metadata.description).toContain("Anshuman Biswas");
    expect(metadata.description).toContain("Elastio");
  });
});
