import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
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

// Mock Next.js modules
vi.mock("next/image", () => ({
  default: (props: any) => <img {...props} />,
}));

vi.mock("next/link", () => ({
  default: ({ children, href, ...props }: any) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

// Mock lucide-react
vi.mock("lucide-react", () => ({
  ChevronLeft: () => <span>ChevronLeft</span>,
  ChevronRight: () => <span>ChevronRight</span>,
  Calendar: () => <span data-testid="calendar">Cal</span>,
}));

// Mock UI components
vi.mock("@/components/ui/button", () => ({
  Button: ({ children, onClick, disabled, ...props }: any) => (
    <button onClick={onClick} disabled={disabled} {...props}>
      {children}
    </button>
  ),
}));

vi.mock("@/components/ui/card", () => ({
  Card: ({ children, ...props }: any) => <div data-testid="card" {...props}>{children}</div>,
  CardContent: ({ children, ...props }: any) => <div {...props}>{children}</div>,
}));

vi.mock("@/components/ui/badge", () => ({
  Badge: ({ children, ...props }: any) => <span data-testid="badge" {...props}>{children}</span>,
}));

const mockPosts: BlogPost[] = [
  {
    date: "2024-01-15",
    title: "Post 1",
    categories: ["Tech"],
    read_time: "5 min",
    link: "https://example.com/1",
  },
  {
    date: "2024-01-14",
    title: "Post 2",
    categories: ["Cloud"],
    read_time: "3 min",
    link: "https://example.com/2",
  },
  {
    date: "2024-01-13",
    title: "Post 3",
    categories: ["AI"],
    read_time: "7 min",
    link: "https://example.com/3",
  },
  {
    date: "2024-01-12",
    title: "Post 4",
    categories: ["ML"],
    read_time: "4 min",
    link: "https://example.com/4",
  },
];

import { BlogCarousel } from "@/components/blog-carousel";

describe("BlogCarousel", () => {
  beforeEach(() => {
    mockFetchBlogPosts.mockReset();
    // Default to desktop viewport
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: 1200,
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("shows loading skeletons while fetching", () => {
    mockFetchBlogPosts.mockReturnValue(new Promise(() => {}));
    const { container } = render(<BlogCarousel />);
    const skeletons = container.querySelectorAll(".animate-pulse");
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it("renders blog posts after loading", async () => {
    mockFetchBlogPosts.mockResolvedValue(mockPosts);
    render(<BlogCarousel />);

    await waitFor(() => {
      expect(screen.getByText("Post 1")).toBeInTheDocument();
    });
    expect(screen.getByText("Post 2")).toBeInTheDocument();
    expect(screen.getByText("Post 3")).toBeInTheDocument();
  });

  it("shows empty message when no posts", async () => {
    mockFetchBlogPosts.mockResolvedValue([]);
    render(<BlogCarousel />);

    await waitFor(() => {
      expect(
        screen.getByText("No blog posts available at the moment.")
      ).toBeInTheDocument();
    });
  });

  it("renders navigation buttons", () => {
    mockFetchBlogPosts.mockReturnValue(new Promise(() => {}));
    render(<BlogCarousel />);
    expect(screen.getByText("Previous")).toBeInTheDocument();
    expect(screen.getByText("Next")).toBeInTheDocument();
  });

  it("disables Previous button at start", async () => {
    mockFetchBlogPosts.mockResolvedValue(mockPosts);
    render(<BlogCarousel />);

    await waitFor(() => {
      expect(screen.getByText("Post 1")).toBeInTheDocument();
    });

    const prevButton = screen.getByText("Previous").closest("button");
    expect(prevButton).toBeDisabled();
  });

  it("enables Next button when there are more posts", async () => {
    mockFetchBlogPosts.mockResolvedValue(mockPosts);
    render(<BlogCarousel />);

    await waitFor(() => {
      expect(screen.getByText("Post 1")).toBeInTheDocument();
    });

    const nextButton = screen.getByText("Next").closest("button");
    expect(nextButton).not.toBeDisabled();
  });

  it("renders post categories", async () => {
    mockFetchBlogPosts.mockResolvedValue(mockPosts);
    render(<BlogCarousel />);

    await waitFor(() => {
      expect(screen.getByText("Tech")).toBeInTheDocument();
    });
  });

  it("renders Read More links", async () => {
    mockFetchBlogPosts.mockResolvedValue(mockPosts);
    render(<BlogCarousel />);

    await waitFor(() => {
      const readMoreLinks = screen.getAllByText("Read More");
      expect(readMoreLinks.length).toBeGreaterThan(0);
      expect(readMoreLinks[0].closest("a")).toHaveAttribute(
        "href",
        "https://example.com/1"
      );
    });
  });

  it("handles fetch error gracefully", async () => {
    mockFetchBlogPosts.mockRejectedValue(new Error("Network error"));
    render(<BlogCarousel />);

    await waitFor(() => {
      // Should show the empty message since fetchBlogPosts returns [] on error in the component
      // The component catches the error and logs it
      expect(
        screen.getByText("No blog posts available at the moment.")
      ).toBeInTheDocument();
    });
  });
});
