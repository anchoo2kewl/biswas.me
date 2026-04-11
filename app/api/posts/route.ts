import { NextResponse } from "next/server";

type BlogPost = {
  date: string;
  title: string;
  categories: string[];
  read_time: string;
  link: string;
  excerpt?: string;
  cover_image_url?: string;
};

type RawLoadMorePost = {
  Title: string;
  Slug: string;
  PublicationDate?: string;
  CreatedAt?: string;
  ReadingTime?: number;
  reading_time?: number;
  FeaturedImageURL?: string;
  Content?: string;
  Categories?: Array<{ name: string }>;
  categories?: Array<{ name: string }>;
};

type RawLoadMoreResponse = {
  Posts?: RawLoadMorePost[];
};

function normalizeRemoteUrl(value: string | undefined, baseURL: string) {
  if (!value) {
    return value;
  }

  // Some older load-more payloads contain wrapped absolute URLs such as:
  // https://anshumanbiswas.com/static/https://res.cloudinary.com/...
  // or /static/https://res.cloudinary.com/...
  // Prefer the embedded absolute URL when present.
  const wrappedAbsoluteMatch = value.match(/\/static\/(https?:\/\/.+)$/i);
  if (wrappedAbsoluteMatch?.[1]) {
    return wrappedAbsoluteMatch[1];
  }

  try {
    const normalized = new URL(value, baseURL);
    const base = new URL(baseURL);
    if (normalized.hostname === base.hostname) {
      normalized.protocol = base.protocol;
    }
    return normalized.toString();
  } catch {
    return value;
  }
}

function decodeHtmlEntities(value: string) {
  return value
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

function extractMeta(html: string, key: string) {
  const patterns = [
    new RegExp(`<meta[^>]+property=["']${key}["'][^>]+content=["']([^"']+)["']`, "i"),
    new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+property=["']${key}["']`, "i"),
    new RegExp(`<meta[^>]+name=["']${key}["'][^>]+content=["']([^"']+)["']`, "i"),
    new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+name=["']${key}["']`, "i"),
  ];

  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match?.[1]) {
      return decodeHtmlEntities(match[1]);
    }
  }

  return "";
}

function buildExcerpt(content: string | undefined, maxWords = 40) {
  if (!content) {
    return "";
  }

  let excerpt = content;
  for (const marker of ["<more-->", "<more -->", "<more-- >", "<more --\u003e", "<more -- >"]) {
    const index = excerpt.indexOf(marker);
    if (index !== -1) {
      excerpt = excerpt.slice(0, index);
      break;
    }
  }

  excerpt = excerpt
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`[^`]*`/g, " ")
    .replace(/!\[[^\]]*\]\([^)]+\)/g, " ")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/<[^>]+>/g, " ")
    .replace(/[#>*_-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  const words = excerpt.split(" ").filter(Boolean);
  if (words.length <= maxWords) {
    return excerpt;
  }

  return `${words.slice(0, maxWords).join(" ")}...`;
}

function normalizePost(post: BlogPost, baseURL: string): BlogPost {
  return {
    ...post,
    link: normalizeRemoteUrl(post.link, baseURL) || post.link,
    cover_image_url: normalizeRemoteUrl(post.cover_image_url, baseURL),
  };
}

function mapLoadMorePost(post: RawLoadMorePost, baseURL: string): BlogPost {
  const categories = post.Categories || post.categories || [];
  const readingTime = post.ReadingTime ?? post.reading_time;

  return normalizePost(
    {
      date: post.PublicationDate || post.CreatedAt || "",
      title: post.Title,
      categories: categories.map((category) => category.name).filter(Boolean),
      read_time: readingTime ? `${readingTime} min read` : "",
      link: `/blog/${post.Slug}`,
      excerpt: buildExcerpt(post.Content),
      cover_image_url: post.FeaturedImageURL,
    },
    baseURL
  );
}

async function enrichPost(post: BlogPost): Promise<BlogPost> {
  if (post.excerpt && post.cover_image_url) {
    return post;
  }

  try {
    const response = await fetch(post.link, {
      headers: { Accept: "text/html" },
      next: { revalidate: 300 },
    });

    if (!response.ok) {
      return post;
    }

    const html = await response.text();
    return {
      ...post,
      excerpt: post.excerpt || extractMeta(html, "description") || extractMeta(html, "og:description"),
      cover_image_url:
        post.cover_image_url || extractMeta(html, "og:image") || extractMeta(html, "twitter:image"),
    };
  } catch {
    return post;
  }
}

async function fetchAdditionalPosts(baseURL: string, offset: number, limit: number) {
  try {
    const response = await fetch(`${baseURL}/api/posts/load-more?offset=${offset}`, {
      headers: { Accept: "application/json" },
      next: { revalidate: 300 },
    });

    if (!response.ok) {
      return [] as BlogPost[];
    }

    const payload = (await response.json()) as RawLoadMoreResponse;
    return (payload.Posts || []).slice(0, limit).map((post) => mapLoadMorePost(post, baseURL));
  } catch {
    return [] as BlogPost[];
  }
}

export async function GET(request: Request) {
  const baseURL = (process.env.BLOG_API_URL || "https://anshumanbiswas.com").replace(/\/$/, "");
  const token = process.env.BLOG_API_TOKEN;
  const cfClientId = process.env.CF_ACCESS_CLIENT_ID;
  const cfClientSecret = process.env.CF_ACCESS_CLIENT_SECRET;
  const requestURL = new URL(request.url);
  const limit = requestURL.searchParams.get("limit");
  const requestedLimit = limit ? Number.parseInt(limit, 10) : undefined;

  if (!token) {
    return NextResponse.json(
      { status: "error", error_message: "Blog API not configured" },
      { status: 500 }
    );
  }

  const headers: HeadersInit = {
    Accept: "application/json",
    Authorization: `Bearer ${token}`,
  };

  if (cfClientId && cfClientSecret) {
    headers["CF-Access-Client-Id"] = cfClientId;
    headers["CF-Access-Client-Secret"] = cfClientSecret;
  }

  try {
    const upstreamURL = new URL(`${baseURL}/api/posts/formatted`);
    if (limit) {
      upstreamURL.searchParams.set("limit", limit);
    }

    const response = await fetch(upstreamURL.toString(), {
      method: "GET",
      headers,
      next: { revalidate: 300 },
    });

    if (!response.ok) {
      return NextResponse.json(
        { status: "error", error_message: `Blog API returned ${response.status}` },
        { status: response.status }
      );
    }

    let posts = ((await response.json()) as BlogPost[]).map((post) => normalizePost(post, baseURL));

    if (requestedLimit && requestedLimit > posts.length) {
      const additionalPosts = await fetchAdditionalPosts(
        baseURL,
        posts.length,
        requestedLimit - posts.length
      );
      const existingLinks = new Set(posts.map((post) => post.link));
      for (const post of additionalPosts) {
        if (!existingLinks.has(post.link)) {
          posts.push(post);
          existingLinks.add(post.link);
        }
      }
    }

    if (requestedLimit && requestedLimit > 0) {
      posts = posts.slice(0, requestedLimit);
    }

    const enrichedPosts = await Promise.all(posts.map(enrichPost));

    return NextResponse.json(enrichedPosts, {
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: "error",
        error_message: error instanceof Error ? error.message : "Failed to fetch blog posts",
      },
      { status: 500 }
    );
  }
}
