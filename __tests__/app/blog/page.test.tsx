import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import type { BlogPost } from "@/lib/blog-api";

// Mock config
vi.mock("@/config", () => ({
  default: {
    RECAPTCHA_SITE_KEY: "stub",
    API_URL: "/api/messages",
    BLOG_API_URL: "/api/posts",
    BLOG_VIEW_ALL_URL: "https://anshumanbiswas.com",
    BLOG_API_TOKEN: undefined,
  },
}));

// Mock blog-api
const mockFetchBlogPosts = vi.fn();
vi.mock("@/lib/blog-api", () => ({
  fetchBlogPosts: (...args: any[]) => mockFetchBlogPosts(...args),
}));

// Mock Next.js Link
vi.mock("next/link", () => ({
  default: ({ children, href, ...props }: any) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

// Mock lucide-react
vi.mock("lucide-react", () => ({
  Calendar: () => <span data-testid="calendar">Cal</span>,
  ArrowUpRight: () => <span data-testid="arrow-up-right">ArrowUpRight</span>,
  ExternalLink: () => <span data-testid="external-link">ExtLink</span>,
}));

// Mock UI components
vi.mock("@/components/ui/button", () => ({
  Button: ({ children, asChild, ...props }: any) => {
    if (asChild) return <>{children}</>;
    return <button {...props}>{children}</button>;
  },
}));

const mockPosts: BlogPost[] = [
  {
    date: "2024-01-15",
    title: "Cloud Computing Best Practices",
    categories: ["Cloud"],
    read_time: "5 min read",
    link: "https://example.com/post1",
    excerpt: "Cloud computing teams need simpler operating models.",
    cover_image_url: "https://example.com/post1.jpg",
  },
  {
    date: "2024-01-10",
    title: "Distributed Systems Design",
    categories: ["Engineering"],
    read_time: "8 min read",
    link: "https://example.com/post2",
    excerpt: "Distributed systems design notes.",
    cover_image_url: "https://example.com/post2.jpg",
  },
];

import BlogPage from "@/app/blog/page";

describe("BlogPage", () => {
  beforeEach(() => {
    mockFetchBlogPosts.mockReset();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders loading skeletons initially", () => {
    mockFetchBlogPosts.mockReturnValue(new Promise(() => {})); // never resolves
    const { container } = render(<BlogPage />);
    const skeletons = container.querySelectorAll(".animate-pulse");
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it("renders page heading", () => {
    mockFetchBlogPosts.mockReturnValue(new Promise(() => {}));
    render(<BlogPage />);
    expect(screen.getByText("Writing & Insights")).toBeInTheDocument();
  });

  it("renders page description", () => {
    mockFetchBlogPosts.mockReturnValue(new Promise(() => {}));
    render(<BlogPage />);
    expect(
      screen.getByText(/Essays on enterprise software/)
    ).toBeInTheDocument();
  });

  it("renders Visit Full Blog Site link", () => {
    mockFetchBlogPosts.mockReturnValue(new Promise(() => {}));
    render(<BlogPage />);
    const blogLink = screen.getByText("Visit Full Blog Site").closest("a");
    expect(blogLink).toHaveAttribute("href", "https://anshumanbiswas.com");
  });

  it("renders shared header navigation links", () => {
    mockFetchBlogPosts.mockReturnValue(new Promise(() => {}));
    render(<BlogPage />);
    expect(screen.getByText("Description").closest("a")).toHaveAttribute("href", "/#description");
    expect(screen.getByText("Work").closest("a")).toHaveAttribute("href", "/#work");
    expect(screen.getByText("Products").closest("a")).toHaveAttribute("href", "/#products");
    expect(screen.getByText("Libraries").closest("a")).toHaveAttribute("href", "/#libraries");
    expect(screen.getByText("Writing").closest("a")).toHaveAttribute("href", "/blog");
    expect(screen.getByText("Contact").closest("a")).toHaveAttribute("href", "/#contact");
  });

  it("renders blog posts after loading", async () => {
    mockFetchBlogPosts.mockResolvedValue(mockPosts);
    render(<BlogPage />);

    await waitFor(() => {
      expect(screen.getByText("Cloud Computing Best Practices")).toBeInTheDocument();
    });
    expect(screen.getByText("Distributed Systems Design")).toBeInTheDocument();
    expect(mockFetchBlogPosts).toHaveBeenCalledWith(9);
  });

  it("renders post categories", async () => {
    mockFetchBlogPosts.mockResolvedValue(mockPosts);
    render(<BlogPage />);

    await waitFor(() => {
      expect(screen.getByText("Cloud")).toBeInTheDocument();
    });
    expect(screen.getByText("Engineering")).toBeInTheDocument();
  });

  it("renders post dates", async () => {
    mockFetchBlogPosts.mockResolvedValue(mockPosts);
    render(<BlogPage />);

    await waitFor(() => {
      expect(screen.getByText("2024-01-15")).toBeInTheDocument();
    });
    expect(screen.getByText("2024-01-10")).toBeInTheDocument();
  });

  it("renders read time", async () => {
    mockFetchBlogPosts.mockResolvedValue(mockPosts);
    render(<BlogPage />);

    await waitFor(() => {
      expect(screen.getByText("5 min read")).toBeInTheDocument();
    });
    expect(screen.getByText("8 min read")).toBeInTheDocument();
  });

  it("renders post links", async () => {
    mockFetchBlogPosts.mockResolvedValue(mockPosts);
    render(<BlogPage />);

    await waitFor(() => {
      const articleLinks = screen.getAllByRole("link");
      const postLink = articleLinks.find((link) => link.getAttribute("href") === "https://example.com/post1");
      expect(postLink).toBeTruthy();
      expect(postLink).toHaveAttribute(
        "href",
        "https://example.com/post1"
      );
    });
  });

  it("renders post excerpts", async () => {
    mockFetchBlogPosts.mockResolvedValue(mockPosts);
    render(<BlogPage />);

    await waitFor(() => {
      expect(
        screen.getByText("Cloud computing teams need simpler operating models.")
      ).toBeInTheDocument();
    });
  });

  it("shows empty state when no posts", async () => {
    mockFetchBlogPosts.mockResolvedValue([]);
    render(<BlogPage />);

    await waitFor(() => {
      expect(
        screen.getByText("No blog posts available at the moment.")
      ).toBeInTheDocument();
    });
  });

  it("renders footer with copyright", () => {
    mockFetchBlogPosts.mockReturnValue(new Promise(() => {}));
    render(<BlogPage />);
    expect(screen.getByText(/Anshuman Biswas. All rights reserved/)).toBeInTheDocument();
  });

  it("renders navigation logo", () => {
    mockFetchBlogPosts.mockReturnValue(new Promise(() => {}));
    render(<BlogPage />);
    expect(screen.getByText("Anshuman Biswas")).toBeInTheDocument();
  });
});
