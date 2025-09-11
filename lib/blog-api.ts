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
    const response = await fetch(config.BLOG_API_URL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
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