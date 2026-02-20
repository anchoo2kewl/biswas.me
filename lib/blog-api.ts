import config from "@/config";

export interface BlogPost {
  date: string;
  title: string;
  categories: string[];
  read_time: string;
  link: string;
}

export interface ApiResponse<T> {
  status: string;
  data?: T;
  error_message?: string;
}

export async function fetchBlogPosts(): Promise<BlogPost[]> {
  try {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    // Add Authorization header if API token is available
    const apiToken = process.env.BLOG_API_TOKEN || config.BLOG_API_TOKEN;
    if (apiToken) {
      headers['Authorization'] = `Bearer ${apiToken}`;
    }

    // Add Cloudflare Access headers if available
    const cfClientId = process.env.CF_ACCESS_CLIENT_ID;
    const cfClientSecret = process.env.CF_ACCESS_CLIENT_SECRET;
    if (cfClientId && cfClientSecret) {
      headers['CF-Access-Client-Id'] = cfClientId;
      headers['CF-Access-Client-Secret'] = cfClientSecret;
    }

    const response = await fetch(config.BLOG_API_URL, {
      method: 'GET',
      headers,
      // Add cache options for better performance
      next: { revalidate: 300 }, // Revalidate every 5 minutes
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch blog posts: ${response.status} ${response.statusText}`);
    }

    const posts: BlogPost[] = await response.json();
    return posts;
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    // Return empty array on error to gracefully handle failures
    return [];
  }
}