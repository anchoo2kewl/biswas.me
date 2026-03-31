import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { BlogPost } from "@/lib/blog-api";

vi.mock("@/config", () => ({
  default: {
    RECAPTCHA_SITE_KEY: "test-site-key",
    API_URL: "/api/messages",
    BLOG_API_URL: "/api/posts",
    BLOG_VIEW_ALL_URL: "https://anshumanbiswas.com",
    BLOG_API_TOKEN: undefined,
  },
}));

const mockFetchBlogPosts = vi.fn();
vi.mock("@/lib/blog-api", () => ({
  fetchBlogPosts: (...args: any[]) => mockFetchBlogPosts(...args),
}));

vi.mock("next/link", () => ({
  default: ({ children, href, onClick, ...props }: any) => (
    <a href={href} onClick={onClick} {...props}>
      {children}
    </a>
  ),
}));

vi.mock("next/dynamic", () => ({
  default: () => {
    const Component = ({ isOpen }: any) =>
      isOpen ? <div data-testid="pdf-viewer">PDF Viewer</div> : null;
    Component.displayName = "DynamicComponent";
    return Component;
  },
}));

vi.mock("next/script", () => ({
  default: (props: any) => <script {...props} />,
}));

vi.mock("lucide-react", () => ({
  Github: () => <span data-testid="github-icon">GitHub</span>,
  Linkedin: () => <span data-testid="linkedin-icon">LinkedIn</span>,
  Mail: () => <span data-testid="mail-icon">Mail</span>,
  Calendar: () => <span data-testid="calendar-icon">Cal</span>,
  ArrowUpRight: () => <span data-testid="arrow-up-right">Arrow</span>,
  ExternalLink: () => <span data-testid="external-link">External</span>,
  FileText: () => <span data-testid="file-text">FileText</span>,
  X: () => <span data-testid="x-icon">X</span>,
}));

vi.mock("@/components/ui/button", () => ({
  Button: ({ children, onClick, asChild, ...props }: any) => {
    if (asChild) return <>{children}</>;
    return (
      <button onClick={onClick} {...props}>
        {children}
      </button>
    );
  },
}));

vi.mock("@/components/ui/input", () => ({
  Input: (props: any) => <input {...props} />,
}));

vi.mock("@/components/ui/textarea", () => ({
  Textarea: (props: any) => <textarea {...props} />,
}));

vi.mock("@/components/interactive-timeline", () => ({
  InteractiveTimeline: () => <div data-testid="interactive-timeline">Timeline</div>,
}));

const mockPosts: BlogPost[] = [
  {
    date: "2026-03-25",
    title: "Practical AI Systems",
    categories: ["AI"],
    read_time: "5 min read",
    link: "https://example.com/post1",
    excerpt: "A practical note on AI systems.",
    cover_image_url: "https://example.com/cover1.jpg",
  },
  {
    date: "2026-03-20",
    title: "Small Software Wins",
    categories: ["Product"],
    read_time: "4 min read",
    link: "https://example.com/post2",
    excerpt: "Why smaller software still wins.",
    cover_image_url: "https://example.com/cover2.jpg",
  },
  {
    date: "2026-03-10",
    title: "Cloud Systems Notes",
    categories: ["Cloud"],
    read_time: "6 min read",
    link: "https://example.com/post3",
    excerpt: "Cloud systems notes.",
    cover_image_url: "https://example.com/cover3.jpg",
  },
  {
    date: "2026-03-01",
    title: "Hidden Post",
    categories: ["Other"],
    read_time: "3 min read",
    link: "https://example.com/post4",
  },
];

import Home from "@/app/page";

describe("HomePage", () => {
  beforeEach(() => {
    mockFetchBlogPosts.mockReset();
    Object.defineProperty(window, "location", {
      writable: true,
      value: { ...window.location, hash: "", pathname: "/", search: "" },
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders the hero content and resume actions", async () => {
    mockFetchBlogPosts.mockResolvedValue([]);
    render(<Home />);

    await waitFor(() => {
      expect(mockFetchBlogPosts).toHaveBeenCalled();
    });
    expect(screen.getAllByText("Anshuman Biswas").length).toBeGreaterThan(0);
    expect(screen.getByText("I build enterprise software")).toBeInTheDocument();
    expect(screen.getByText("View PDF resume")).toBeInTheDocument();
    expect(screen.getByText("Open HTML resume")).toBeInTheDocument();
    expect(screen.getByText("Download PDF")).toBeInTheDocument();
  });

  it("renders section navigation and core sections", async () => {
    mockFetchBlogPosts.mockResolvedValue([]);
    render(<Home />);

    await waitFor(() => {
      expect(mockFetchBlogPosts).toHaveBeenCalled();
    });
    expect(screen.getAllByText("Description").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Products").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Libraries").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Work").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Writing").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Contact").length).toBeGreaterThan(0);
    expect(screen.getByText("What I build outside work")).toBeInTheDocument();
    expect(screen.getByText("Libraries and tools I reuse")).toBeInTheDocument();
  });

  it("renders showcased products and libraries", async () => {
    mockFetchBlogPosts.mockResolvedValue([]);
    render(<Home />);

    await waitFor(() => {
      expect(mockFetchBlogPosts).toHaveBeenCalled();
    });
    expect(screen.getAllByText("TaskAI").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Pingrly").length).toBeGreaterThan(0);
    expect(screen.getAllByText("FlagTGL").length).toBeGreaterThan(0);
    expect(screen.getAllByText("AI Agent Lens").length).toBeGreaterThan(0);
    expect(screen.getAllByText("go-wiki").length).toBeGreaterThan(0);
    expect(screen.getAllByText("go-draw").length).toBeGreaterThan(0);
    expect(screen.getAllByText("BuildMe").length).toBeGreaterThan(0);
  });

  it("opens project details in the modal lightbox", async () => {
    mockFetchBlogPosts.mockResolvedValue([]);
    render(<Home />);
    const user = userEvent.setup();

    await user.click(screen.getAllByText("Open details")[0]);

    expect(screen.getByText("Snapshot")).toBeInTheDocument();
    expect(screen.queryByText("Visit source")).not.toBeInTheDocument();
    expect(screen.getByText("Visit taskai.cc")).toBeInTheDocument();
  });

  it("shows the pdf viewer when resume is opened", async () => {
    mockFetchBlogPosts.mockResolvedValue([]);
    render(<Home />);
    const user = userEvent.setup();

    await user.click(screen.getByText("View PDF resume"));
    expect(screen.getByTestId("pdf-viewer")).toBeInTheDocument();
  });

  it("renders the career timeline section", async () => {
    mockFetchBlogPosts.mockResolvedValue([]);
    render(<Home />);

    await waitFor(() => {
      expect(mockFetchBlogPosts).toHaveBeenCalled();
    });
    expect(screen.getByText("Career journey")).toBeInTheDocument();
    expect(screen.getByTestId("interactive-timeline")).toBeInTheDocument();
  });

  it("shows only the first three blog posts", async () => {
    mockFetchBlogPosts.mockResolvedValue(mockPosts);
    render(<Home />);

    await waitFor(() => {
      expect(screen.getByText("Practical AI Systems")).toBeInTheDocument();
    });

    expect(screen.getByText("Small Software Wins")).toBeInTheDocument();
    expect(screen.getByText("Cloud Systems Notes")).toBeInTheDocument();
    expect(screen.queryByText("Hidden Post")).not.toBeInTheDocument();
  });

  it("shows empty state when there are no blog posts", async () => {
    mockFetchBlogPosts.mockResolvedValue([]);
    render(<Home />);

    await waitFor(() => {
      expect(
        screen.getByText("No blog posts available at the moment.")
      ).toBeInTheDocument();
    });
  });

  it("renders contact form fields and links", async () => {
    mockFetchBlogPosts.mockResolvedValue([]);
    render(<Home />);

    await waitFor(() => {
      expect(mockFetchBlogPosts).toHaveBeenCalled();
    });
    expect(screen.getByLabelText("Name")).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Message")).toBeInTheDocument();
    expect(screen.getByText("Send message")).toBeInTheDocument();
    expect(screen.getAllByText("github.com/anchoo2kewl").length).toBeGreaterThan(0);
    expect(screen.getAllByText("linkedin.com/in/anshumanbiswas").length).toBeGreaterThan(0);
    expect(screen.getAllByText("anshuman@biswas.me").length).toBeGreaterThan(0);
  });

  it("updates form fields on input", async () => {
    mockFetchBlogPosts.mockResolvedValue([]);
    render(<Home />);
    const user = userEvent.setup();

    const nameInput = screen.getByLabelText("Name");
    await user.type(nameInput, "John Doe");
    expect(nameInput).toHaveValue("John Doe");

    const emailInput = screen.getByLabelText("Email");
    await user.type(emailInput, "john@example.com");
    expect(emailInput).toHaveValue("john@example.com");

    const messageInput = screen.getByLabelText("Message");
    await user.type(messageInput, "Hello!");
    expect(messageInput).toHaveValue("Hello!");
  });
});
