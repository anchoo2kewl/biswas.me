import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import Resume, { metadata } from "@/app/resume/page";
import profile from "@/lib/profile.json";

describe("Shared one-page resume", () => {
  it("has resume-specific metadata and canonical URL", () => {
    expect(metadata.title).toContain("Anshuman Biswas");
    expect(metadata.alternates?.canonical).toBe("/resume");
  });
  it("renders the two-column sheet with contact, skills, and education", () => {
    const { container } = render(<Resume />);
    expect(container.querySelector(".r-sheet")).toBeInTheDocument();
    expect(container.querySelector(".r-aside")).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(profile.name);
    for (const title of ["About", "Skills", "Education", "Experience", "Selected hands-on work"]) {
      expect(screen.getByRole("heading", { name: title })).toBeInTheDocument();
    }
    expect(screen.getByText("PhD, Electrical & Computer Engineering")).toBeInTheDocument();
  });
  it("includes leadership scale, the patent contribution, and paying customers", () => {
    render(<Resume />);
    for (const phrase of ["~40 engineers", "~15-engineer organization", "~70 engineers", "patent-pending database-security technology", "multiple paying customers"]) {
      expect(screen.getByText(phrase)).toBeInTheDocument();
    }
    expect(screen.getByText(/Progression: Senior Software Engineer/)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "LifeAI" })).toHaveAttribute("href", "https://lifeai.cc");
  });
  it("keeps downloadable artifacts and print styles available", () => {
    render(<Resume />);
    expect(screen.getByRole("link", { name: /Download PDF/ })).toHaveAttribute("href", "/AnshumanBiswas.pdf");
    const html = readFileSync(join(process.cwd(), "public/resume.html"), "utf8");
    expect(html).toContain("@page{size:Letter;margin:0}");
    expect(html).toContain("max-width:620px");
    const pdf = readFileSync(join(process.cwd(), "public/AnshumanBiswas.pdf"));
    expect(pdf.subarray(0, 5).toString()).toBe("%PDF-");
  });
});
