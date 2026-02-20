import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";

const mockReplace = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    replace: mockReplace,
    push: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
    prefetch: vi.fn(),
  }),
}));

import ResumePage from "@/app/resume-pdf/page";

describe("ResumePdfPage", () => {
  it("renders loading spinner", () => {
    render(<ResumePage />);
    expect(screen.getByText("Opening resume...")).toBeInTheDocument();
  });

  it("redirects to /#resume", () => {
    render(<ResumePage />);
    expect(mockReplace).toHaveBeenCalledWith("/#resume");
  });
});
