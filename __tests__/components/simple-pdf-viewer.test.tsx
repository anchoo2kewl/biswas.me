import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SimplePDFViewer } from "@/components/simple-pdf-viewer";

// Mock lucide-react icons
vi.mock("lucide-react", () => ({
  X: () => <span data-testid="x-icon">X</span>,
  Download: () => <span data-testid="download-icon">Download</span>,
  ExternalLink: () => <span data-testid="external-link-icon">ExternalLink</span>,
}));

// Mock the Button component
vi.mock("@/components/ui/button", () => ({
  Button: ({ children, onClick, asChild, ...props }: any) => {
    if (asChild) {
      return <>{children}</>;
    }
    return (
      <button onClick={onClick} {...props}>
        {children}
      </button>
    );
  },
}));

describe("SimplePDFViewer", () => {
  const defaultProps = {
    isOpen: true,
    onClose: vi.fn(),
    pdfUrl: "/test.pdf",
  };

  it("renders nothing when isOpen is false", () => {
    const { container } = render(
      <SimplePDFViewer isOpen={false} onClose={vi.fn()} pdfUrl="/test.pdf" />
    );
    expect(container.innerHTML).toBe("");
  });

  it("renders the viewer when isOpen is true", () => {
    render(<SimplePDFViewer {...defaultProps} />);
    expect(screen.getByText("Resume - Anshuman Biswas")).toBeInTheDocument();
  });

  it("renders Open in New Tab link with correct href", () => {
    render(<SimplePDFViewer {...defaultProps} />);
    const link = screen.getByText("Open in New Tab").closest("a");
    expect(link).toHaveAttribute("href", "/test.pdf");
    expect(link).toHaveAttribute("target", "_blank");
  });

  it("renders Download link with correct download attribute", () => {
    render(<SimplePDFViewer {...defaultProps} />);
    // "Download" text appears in both icon mock and link text; query the link by download attribute
    const link = document.querySelector('a[download="Anshuman_Biswas_Resume.pdf"]');
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/test.pdf");
  });

  it("renders iframe with correct src", () => {
    render(<SimplePDFViewer {...defaultProps} />);
    const iframe = screen.getByTitle("Resume PDF");
    expect(iframe).toHaveAttribute(
      "src",
      "/test.pdf#toolbar=1&navpanes=1&scrollbar=1"
    );
  });

  it("calls onClose when close button is clicked", async () => {
    const onClose = vi.fn();
    render(<SimplePDFViewer isOpen={true} onClose={onClose} pdfUrl="/test.pdf" />);
    const user = userEvent.setup();
    // The close button contains the X icon
    const closeButton = screen.getByText("X").closest("button");
    await user.click(closeButton!);
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
