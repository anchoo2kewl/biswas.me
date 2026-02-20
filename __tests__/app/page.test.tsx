import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { BlogPost } from "@/lib/blog-api";

// Mock config
vi.mock("@/config", () => ({
  default: {
    RECAPTCHA_SITE_KEY: "test-site-key",
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
vi.mock("next/link", () => ({
  default: ({ children, href, onClick, ...props }: any) => (
    <a href={href} onClick={onClick} {...props}>
      {children}
    </a>
  ),
}));

vi.mock("next/dynamic", () => ({
  default: (loader: any) => {
    // Return a component that calls the loader
    const Component = (props: any) => {
      return <div data-testid="dynamic-component" {...props} />;
    };
    Component.displayName = "DynamicComponent";
    return Component;
  },
}));

vi.mock("next/script", () => ({
  default: (props: any) => <script {...props} />,
}));

// Mock lucide-react
vi.mock("lucide-react", () => ({
  Github: () => <span data-testid="github-icon">GitHub</span>,
  Linkedin: () => <span data-testid="linkedin-icon">LinkedIn</span>,
  Mail: () => <span data-testid="mail-icon">Mail</span>,
  Calendar: () => <span data-testid="calendar-icon">Cal</span>,
  ArrowUpRight: () => <span data-testid="arrow-up-right">ArrowUpRight</span>,
  FileText: () => <span data-testid="file-text">FileText</span>,
}));

// Mock UI components
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

// Mock InteractiveTimeline
vi.mock("@/components/interactive-timeline", () => ({
  InteractiveTimeline: () => (
    <div data-testid="interactive-timeline">Timeline</div>
  ),
}));

// Mock SimplePDFViewer (dynamically imported)
vi.mock("@/components/simple-pdf-viewer", () => ({
  SimplePDFViewer: ({ isOpen, onClose, pdfUrl }: any) =>
    isOpen ? (
      <div data-testid="pdf-viewer">
        <button onClick={onClose}>Close PDF</button>
      </div>
    ) : null,
}));

const mockPosts: BlogPost[] = [
  {
    date: "2024-01-15",
    title: "Test Blog Post",
    categories: ["Cloud"],
    read_time: "5 min read",
    link: "https://example.com/post1",
  },
  {
    date: "2024-01-10",
    title: "Another Post",
    categories: ["Tech"],
    read_time: "3 min read",
    link: "https://example.com/post2",
  },
  {
    date: "2024-01-05",
    title: "Third Post",
    categories: ["AI"],
    read_time: "7 min read",
    link: "https://example.com/post3",
  },
  {
    date: "2024-01-01",
    title: "Fourth Post (not shown)",
    categories: ["ML"],
    read_time: "4 min read",
    link: "https://example.com/post4",
  },
];

import Home from "@/app/page";

describe("HomePage", () => {
  beforeEach(() => {
    mockFetchBlogPosts.mockReset();
    // Reset location hash
    Object.defineProperty(window, "location", {
      writable: true,
      value: { ...window.location, hash: "", pathname: "/", search: "" },
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("Navigation", () => {
    it("renders the logo", () => {
      mockFetchBlogPosts.mockResolvedValue([]);
      render(<Home />);
      expect(screen.getByText("nshuman Biswas")).toBeInTheDocument();
    });

    it("renders navigation links", () => {
      mockFetchBlogPosts.mockResolvedValue([]);
      render(<Home />);
      // "About" appears both in nav and as a section heading
      const aboutLinks = screen.getAllByText("About");
      expect(aboutLinks.length).toBeGreaterThanOrEqual(2);
      expect(screen.getByText("Work")).toBeInTheDocument();
      expect(screen.getByText("Writing")).toBeInTheDocument();
      expect(screen.getByText("Contact")).toBeInTheDocument();
    });
  });

  describe("Hero Section", () => {
    it("renders the main heading", () => {
      mockFetchBlogPosts.mockResolvedValue([]);
      render(<Home />);
      expect(
        screen.getByText("I optimize cloud systems for scale.")
      ).toBeInTheDocument();
    });

    it("renders the bio text", () => {
      mockFetchBlogPosts.mockResolvedValue([]);
      render(<Home />);
      expect(screen.getByText(/VP of Engineering at/)).toBeInTheDocument();
    });

    it("renders resume action buttons", () => {
      mockFetchBlogPosts.mockResolvedValue([]);
      render(<Home />);
      expect(screen.getByText("View PDF Resume")).toBeInTheDocument();
      expect(screen.getByText(/HTML Resume/)).toBeInTheDocument();
      expect(screen.getByText("Download PDF")).toBeInTheDocument();
    });

    it("renders social links in hero", () => {
      mockFetchBlogPosts.mockResolvedValue([]);
      render(<Home />);
      // There are multiple GitHub links on the page
      const githubLinks = screen.getAllByText("GitHub");
      expect(githubLinks.length).toBeGreaterThan(0);
    });

    it("renders the profile image", () => {
      mockFetchBlogPosts.mockResolvedValue([]);
      render(<Home />);
      const img = screen.getByAltText("Anshuman Biswas");
      expect(img).toBeInTheDocument();
      expect(img).toHaveAttribute("src", "/me_medium.jpg");
    });
  });

  describe("About Section", () => {
    it("renders about heading", () => {
      mockFetchBlogPosts.mockResolvedValue([]);
      render(<Home />);
      const aboutElements = screen.getAllByText("About");
      // One in nav, one as section heading
      expect(aboutElements.length).toBeGreaterThanOrEqual(2);
    });

    it("renders about content", () => {
      mockFetchBlogPosts.mockResolvedValue([]);
      render(<Home />);
      expect(
        screen.getByText(/I serve as Vice President of Engineering/)
      ).toBeInTheDocument();
    });
  });

  describe("Career Journey Section", () => {
    it("renders career journey heading", () => {
      mockFetchBlogPosts.mockResolvedValue([]);
      render(<Home />);
      expect(screen.getByText("Career Journey")).toBeInTheDocument();
    });

    it("renders the interactive timeline component", () => {
      mockFetchBlogPosts.mockResolvedValue([]);
      render(<Home />);
      expect(screen.getByTestId("interactive-timeline")).toBeInTheDocument();
    });
  });

  describe("Recent Writing Section", () => {
    it("renders writing heading", () => {
      mockFetchBlogPosts.mockResolvedValue([]);
      render(<Home />);
      expect(screen.getByText("Recent Writing")).toBeInTheDocument();
    });

    it("shows loading skeletons initially", () => {
      mockFetchBlogPosts.mockReturnValue(new Promise(() => {}));
      const { container } = render(<Home />);
      const skeletons = container.querySelectorAll(".animate-pulse");
      expect(skeletons.length).toBeGreaterThan(0);
    });

    it("shows only first 3 blog posts", async () => {
      mockFetchBlogPosts.mockResolvedValue(mockPosts);
      render(<Home />);

      await waitFor(() => {
        expect(screen.getByText("Test Blog Post")).toBeInTheDocument();
      });
      expect(screen.getByText("Another Post")).toBeInTheDocument();
      expect(screen.getByText("Third Post")).toBeInTheDocument();
      // Fourth post should not be displayed
      expect(
        screen.queryByText("Fourth Post (not shown)")
      ).not.toBeInTheDocument();
    });

    it("shows empty state when no posts", async () => {
      mockFetchBlogPosts.mockResolvedValue([]);
      render(<Home />);

      await waitFor(() => {
        expect(
          screen.getByText("No blog posts available at the moment.")
        ).toBeInTheDocument();
      });
    });

    it("renders 'View all posts' link", () => {
      mockFetchBlogPosts.mockResolvedValue([]);
      render(<Home />);
      const link = screen.getByText("View all posts");
      expect(link.closest("a")).toHaveAttribute("href", "/blog");
    });
  });

  describe("Contact Section", () => {
    it("renders contact heading", () => {
      mockFetchBlogPosts.mockResolvedValue([]);
      render(<Home />);
      expect(screen.getByText("Get In Touch")).toBeInTheDocument();
    });

    it("renders contact form fields", () => {
      mockFetchBlogPosts.mockResolvedValue([]);
      render(<Home />);
      expect(screen.getByLabelText("Name")).toBeInTheDocument();
      expect(screen.getByLabelText("Email")).toBeInTheDocument();
      expect(screen.getByLabelText("Message")).toBeInTheDocument();
    });

    it("renders submit button", () => {
      mockFetchBlogPosts.mockResolvedValue([]);
      render(<Home />);
      expect(screen.getByText("Send Message")).toBeInTheDocument();
    });

    it("renders contact info links", () => {
      mockFetchBlogPosts.mockResolvedValue([]);
      render(<Home />);
      expect(screen.getByText("github.com/anchoo2kewl")).toBeInTheDocument();
      expect(
        screen.getByText("linkedin.com/in/anshumanbiswas")
      ).toBeInTheDocument();
      expect(screen.getByText("anshuman@biswas.me")).toBeInTheDocument();
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

  describe("Footer", () => {
    it("renders footer with name", () => {
      mockFetchBlogPosts.mockResolvedValue([]);
      render(<Home />);
      // Footer has "Anshuman Biswas" link
      const footerLinks = screen.getAllByText("Anshuman Biswas");
      expect(footerLinks.length).toBeGreaterThan(0);
    });

    it("renders footer with title", () => {
      mockFetchBlogPosts.mockResolvedValue([]);
      render(<Home />);
      expect(
        screen.getByText("VP of Engineering & Cloud Architect")
      ).toBeInTheDocument();
    });

    it("renders copyright", () => {
      mockFetchBlogPosts.mockResolvedValue([]);
      render(<Home />);
      expect(screen.getByText(/All rights reserved/)).toBeInTheDocument();
    });
  });
});
