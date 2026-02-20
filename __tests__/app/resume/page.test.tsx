import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Resume, { metadata } from "@/app/resume/page";

describe("ResumePage", () => {
  it("exports correct metadata", () => {
    expect(metadata.title).toBe("Resume - Anshuman Biswas");
    expect(metadata.description).toContain("VP of Engineering");
  });

  it("renders the resume container", () => {
    const { container } = render(<Resume />);
    expect(container.querySelector(".resume-container")).toBeInTheDocument();
  });

  it("renders the candidate name", () => {
    render(<Resume />);
    expect(screen.getByText("Anshuman Biswas")).toBeInTheDocument();
  });

  it("renders the job title", () => {
    render(<Resume />);
    const jobTitles = screen.getAllByText(/VP of Engineering/);
    expect(jobTitles.length).toBeGreaterThanOrEqual(1);
    // Specifically check the .job-title div
    const jobTitleDiv = document.querySelector(".job-title");
    expect(jobTitleDiv).toBeInTheDocument();
    expect(jobTitleDiv!.textContent).toBe("VP of Engineering");
  });

  it("renders contact information", () => {
    render(<Resume />);
    const emailLinks = screen.getAllByText(/anshuman@biswas.me/);
    expect(emailLinks.length).toBeGreaterThanOrEqual(1);
    const biswasLinks = screen.getAllByText(/biswas\.me/);
    expect(biswasLinks.length).toBeGreaterThanOrEqual(1);
    const linkedinLinks = screen.getAllByText(/LinkedIn/);
    expect(linkedinLinks.length).toBeGreaterThanOrEqual(1);
  });

  it("renders the sidebar sections", () => {
    render(<Resume />);
    expect(screen.getByText("About")).toBeInTheDocument();
    expect(screen.getByText("Skills")).toBeInTheDocument();
    expect(screen.getByText("Education")).toBeInTheDocument();
  });

  it("renders education details", () => {
    render(<Resume />);
    expect(screen.getByText(/Ph.D. Electrical & Comp. Eng./)).toBeInTheDocument();
    expect(screen.getByText(/Carleton University, 2019/)).toBeInTheDocument();
    expect(screen.getByText(/M.Sc. Computer Science/)).toBeInTheDocument();
    expect(screen.getByText(/B.Sc. Computer Science/)).toBeInTheDocument();
  });

  it("renders experience section with Elastio", () => {
    render(<Resume />);
    const elastioLinks = screen.getAllByText(/Elastio/);
    expect(elastioLinks.length).toBeGreaterThan(0);
    expect(screen.getByText(/Jan '25 – Present/)).toBeInTheDocument();
  });

  it("renders experience with Veeva Systems", () => {
    render(<Resume />);
    expect(screen.getByText(/Veeva Systems/)).toBeInTheDocument();
    expect(screen.getByText(/Mar '24 – Jan '25/)).toBeInTheDocument();
  });

  it("renders experience with IBM Turbonomic", () => {
    render(<Resume />);
    expect(screen.getByText(/IBM Turbonomic/)).toBeInTheDocument();
    expect(screen.getByText(/Jul '17 – Mar '24/)).toBeInTheDocument();
  });

  it("renders prior engineering roles", () => {
    render(<Resume />);
    expect(screen.getByText(/Prior Engineering Roles/)).toBeInTheDocument();
    expect(screen.getByText(/'07 – '17/)).toBeInTheDocument();
  });

  it("renders the PDF link", () => {
    render(<Resume />);
    const pdfLink = screen.getByText(/PDF Version/);
    expect(pdfLink).toBeInTheDocument();
    expect(pdfLink.closest("a")).toHaveAttribute("href", "/resume-pdf");
  });

  it("renders skills categories", () => {
    render(<Resume />);
    expect(screen.getByText("Leadership & Strategy")).toBeInTheDocument();
    expect(screen.getByText("Architecture & Systems")).toBeInTheDocument();
    expect(screen.getByText("Technical Expertise")).toBeInTheDocument();
  });

  it("has correct sidebar structure", () => {
    const { container } = render(<Resume />);
    const sidebar = container.querySelector(".sidebar");
    expect(sidebar).toBeInTheDocument();
    const mainContent = container.querySelector(".main-content");
    expect(mainContent).toBeInTheDocument();
  });

  it("renders font links", () => {
    const { container } = render(<Resume />);
    const links = container.querySelectorAll("link");
    const fontLink = Array.from(links).find((l) =>
      l.getAttribute("href")?.includes("fonts.googleapis.com")
    );
    expect(fontLink).toBeTruthy();
  });

  it("renders the earlier roles note for Turbonomic", () => {
    render(<Resume />);
    expect(
      screen.getByText(/Sr. Software Engineer → Engineering Mgr/)
    ).toBeInTheDocument();
  });

  it("renders inline styles", () => {
    const { container } = render(<Resume />);
    const styleTag = container.querySelector("style");
    expect(styleTag).toBeInTheDocument();
  });
});
