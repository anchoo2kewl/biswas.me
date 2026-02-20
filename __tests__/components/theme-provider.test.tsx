import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";

vi.mock("next-themes", () => ({
  ThemeProvider: ({ children, ...props }: any) => (
    <div data-testid="next-themes-provider" data-props={JSON.stringify(props)}>
      {children}
    </div>
  ),
}));

import { ThemeProvider } from "@/components/theme-provider";

describe("ThemeProvider", () => {
  it("renders children", () => {
    render(
      <ThemeProvider attribute="class" defaultTheme="light">
        <div>Test Child</div>
      </ThemeProvider>
    );
    expect(screen.getByText("Test Child")).toBeInTheDocument();
  });

  it("passes props to NextThemesProvider", () => {
    render(
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
        <div>Content</div>
      </ThemeProvider>
    );
    const provider = screen.getByTestId("next-themes-provider");
    const props = JSON.parse(provider.getAttribute("data-props")!);
    expect(props.attribute).toBe("class");
    expect(props.defaultTheme).toBe("dark");
    expect(props.enableSystem).toBe(true);
  });
});
