import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { AnchorHTMLAttributes, ImgHTMLAttributes } from "react";

const { fetchPosts } = vi.hoisted(() => ({ fetchPosts: vi.fn() }));
vi.mock("@/config", () => ({ default: { RECAPTCHA_SITE_KEY: "test-site-key", API_URL: "/api/messages" } }));
vi.mock("@/lib/blog-api", () => ({ fetchBlogPosts: fetchPosts }));
vi.mock("next/link", () => ({ default: (props: AnchorHTMLAttributes<HTMLAnchorElement>) => <a {...props} /> }));
vi.mock("next/image", () => ({ default: (props: ImgHTMLAttributes<HTMLImageElement>) => <img {...props} alt={props.alt || ""} /> }));
vi.mock("next/script", () => ({ default: () => null }));
vi.mock("next/dynamic", () => ({ default: () => function MockPDF({ isOpen }: { isOpen: boolean }) { return isOpen ? <div data-testid="pdf-viewer">PDF Viewer</div> : null; } }));
import Home from "@/app/page";

beforeEach(() => { fetchPosts.mockReset().mockResolvedValue([]); });
afterEach(() => { vi.restoreAllMocks(); vi.unstubAllGlobals(); });

async function renderHome() {
  const result = render(<Home />);
  await waitFor(() => expect(fetchPosts).toHaveBeenCalled());
  return result;
}

async function fillContact() {
  await userEvent.type(screen.getByLabelText("Name"), "Test Person");
  await userEvent.type(screen.getByLabelText("Email"), "test@example.com");
  await userEvent.type(screen.getByLabelText("Message"), "Hello");
}

describe("Engineering leadership homepage", () => {
  it("renders the hands-on positioning and resume links", async () => {
    await renderHome();
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("I lead engineering.");
    expect(screen.getByRole("link", { name: "Open HTML resume" })).toHaveAttribute("href", "/resume");
    expect(screen.getByRole("link", { name: /Download PDF/ })).toHaveAttribute("href", "/AnshumanBiswas.pdf");
  });
  it("shows approximate organization sizes, management scope, and patent work", async () => {
    await renderHome();
    for (const number of ["~40", "~15", "~70"]) expect(screen.getAllByText(new RegExp(number)).length).toBeGreaterThan(0);
    expect(screen.getByText(/not direct-report counts/)).toBeInTheDocument();
    expect(screen.getByText("Patent-pending database security")).toBeInTheDocument();
    expect(screen.getAllByText(/multiple engineering managers/i).length).toBeGreaterThan(0);
  });
  it("keeps the product, financial, lifestyle, and library portfolio", async () => {
    await renderHome();
    for (const name of ["FlagTGL", "AI Agent Lens", "TaskAI", "Pingrly", "TickrAPI", "Folioworth", "LifeAI", "75 Hard", "Pool", "Learn", "Trading Pod", "Questrade Reserve", "go-ai", "go-wiki", "go-draw", "BuildMe"]) {
      expect(screen.getByRole("heading", { name: new RegExp(`^${name}`) })).toBeInTheDocument();
    }
    expect(screen.getByRole("link", { name: "Visit LifeAI" })).toHaveAttribute("href", "https://lifeai.cc");
    expect(screen.getAllByText(/multiple paying customers/).length).toBeGreaterThan(0);
  });
  it("opens the existing PDF viewer", async () => {
    await renderHome();
    await userEvent.click(screen.getByRole("button", { name: "View PDF resume" }));
    expect(screen.getByTestId("pdf-viewer")).toBeInTheDocument();
  });
  it("limits recent writing to three posts", async () => {
    fetchPosts.mockResolvedValue([1,2,3,4].map((n) => ({ title: `Post ${n}`, link: `https://example.com/${n}`, date: "2026-10-01", read_time: "5 min" })));
    await renderHome();
    await screen.findByText("Post 1 ↗");
    expect(screen.queryByText("Post 4 ↗")).not.toBeInTheDocument();
  });
  it("handles blog API failure gracefully", async () => {
    fetchPosts.mockRejectedValue(new Error("Offline")); await renderHome();
    expect(await screen.findByText("No blog posts available at the moment.")).toBeInTheDocument();
  });
  it("keeps required accessible contact fields", async () => {
    await renderHome();
    for (const label of ["Name", "Email", "Message"]) expect(screen.getByLabelText(label)).toBeRequired();
    expect(screen.getByLabelText("Email")).toHaveAttribute("type", "email");
  });
  it("submits the verified captcha token and resets on success", async () => {
    const send = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ status: "success" }) });
    vi.stubGlobal("fetch", send); await renderHome(); await fillContact();
    await act(async () => { await window.onSubmit("verified-token"); });
    expect(JSON.parse(send.mock.calls[0][1].body)).toEqual({ name: "Test Person", email: "test@example.com", message: "Hello", "g-recaptcha-response": "verified-token" });
    expect(await screen.findByText("Message sent successfully.")).toBeInTheDocument();
    expect(screen.getByLabelText("Name")).toHaveValue("");
  });
  it("does not send a message without a captcha token", async () => {
    const send = vi.fn(); vi.stubGlobal("fetch", send);
    await renderHome(); await fillContact();
    await act(async () => { await window.onSubmit(""); });
    expect(send).not.toHaveBeenCalled();
    expect(screen.getByText(/complete the security check/)).toBeInTheDocument();
  });
  it("preserves the message and offers email after a server error", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false }));
    await renderHome(); await fillContact();
    await act(async () => { await window.onSubmit("verified-token"); });
    expect(screen.getByText(/There was an error sending your message/)).toBeInTheDocument();
    expect(screen.getByLabelText("Message")).toHaveValue("Hello");
    expect(screen.getByRole("button", { name: "Send message" })).not.toBeDisabled();
  });
});
