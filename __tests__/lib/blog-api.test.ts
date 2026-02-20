import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

// Mock the config module before importing blog-api
vi.mock("@/config", () => ({
  default: {
    RECAPTCHA_SITE_KEY: "stub",
    API_URL: "/api/messages",
    BLOG_API_URL: "/api/posts",
    BLOG_VIEW_ALL_URL: "https://anshumanbiswas.com",
    BLOG_API_TOKEN: undefined,
  },
}));

import { fetchBlogPosts, type BlogPost } from "@/lib/blog-api";

const mockPosts: BlogPost[] = [
  {
    date: "2024-01-15",
    title: "Test Post 1",
    categories: ["Tech"],
    read_time: "5 min read",
    link: "https://example.com/post1",
  },
  {
    date: "2024-01-10",
    title: "Test Post 2",
    categories: ["Cloud"],
    read_time: "3 min read",
    link: "https://example.com/post2",
  },
];

describe("fetchBlogPosts", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
    // Clean up env vars
    delete process.env.BLOG_API_TOKEN;
    delete process.env.CF_ACCESS_CLIENT_ID;
    delete process.env.CF_ACCESS_CLIENT_SECRET;
  });

  it("returns blog posts on success", async () => {
    (fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockPosts),
    });

    const posts = await fetchBlogPosts();
    expect(posts).toEqual(mockPosts);
    expect(posts).toHaveLength(2);
  });

  it("calls the configured API URL", async () => {
    (fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve([]),
    });

    await fetchBlogPosts();
    expect(fetch).toHaveBeenCalledWith(
      "/api/posts",
      expect.objectContaining({
        method: "GET",
        headers: expect.objectContaining({
          "Content-Type": "application/json",
        }),
      })
    );
  });

  it("returns empty array on network error", async () => {
    (fetch as ReturnType<typeof vi.fn>).mockRejectedValue(new Error("Network error"));

    const posts = await fetchBlogPosts();
    expect(posts).toEqual([]);
  });

  it("returns empty array on non-ok response", async () => {
    (fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: false,
      status: 500,
      statusText: "Internal Server Error",
    });

    const posts = await fetchBlogPosts();
    expect(posts).toEqual([]);
  });

  it("includes Authorization header when BLOG_API_TOKEN env is set", async () => {
    process.env.BLOG_API_TOKEN = "test-token";

    (fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve([]),
    });

    await fetchBlogPosts();
    expect(fetch).toHaveBeenCalledWith(
      "/api/posts",
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: "Bearer test-token",
        }),
      })
    );
  });

  it("includes Cloudflare Access headers when env vars are set", async () => {
    process.env.CF_ACCESS_CLIENT_ID = "cf-id";
    process.env.CF_ACCESS_CLIENT_SECRET = "cf-secret";

    (fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve([]),
    });

    await fetchBlogPosts();
    expect(fetch).toHaveBeenCalledWith(
      "/api/posts",
      expect.objectContaining({
        headers: expect.objectContaining({
          "CF-Access-Client-Id": "cf-id",
          "CF-Access-Client-Secret": "cf-secret",
        }),
      })
    );
  });

  it("does not include CF headers when only one is set", async () => {
    process.env.CF_ACCESS_CLIENT_ID = "cf-id";
    // CF_ACCESS_CLIENT_SECRET is not set

    (fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve([]),
    });

    await fetchBlogPosts();
    const callArgs = (fetch as ReturnType<typeof vi.fn>).mock.calls[0];
    const headers = callArgs[1].headers;
    expect(headers["CF-Access-Client-Id"]).toBeUndefined();
  });
});
