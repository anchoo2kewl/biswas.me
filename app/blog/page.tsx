"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Calendar, ArrowUpRight, ExternalLink } from "lucide-react";
import { fetchBlogPosts, type BlogPost } from "@/lib/blog-api";
import config from "@/config";

export default function BlogPage() {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadBlogPosts = async () => {
      setLoading(true);
      setError(null);
      try {
        const posts = await fetchBlogPosts(9);
        setBlogPosts(posts);
      } catch (err) {
        console.error('Failed to load blog posts:', err);
        setError('Failed to load blog posts. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadBlogPosts();
  }, []);

  return (
    <main className="min-h-screen">
      {/* Navigation */}
      <nav className="mx-auto max-w-6xl px-4 py-8 md:px-6">
        <div className="flex justify-between items-center">
          <Link href="/" className="flex items-center gap-1 text-xl font-semibold text-gray-900 hover:text-gray-600 transition-colors">
            <div className="w-8 h-8 inline-flex items-center justify-center">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="transition-transform hover:scale-125">
                <circle cx="16" cy="16" r="16" fill="url(#gradient)" />
                <g fill="#ffffff">
                  <path d="M16 9 L21 23 L19.25 23 L18.25 20 L13.75 20 L12.75 23 L11 23 L16 9 Z" />
                  <rect x="14.25" y="17" width="3.5" height="1.5" />
                  <path d="M16 12 L17.25 16 L14.75 16 L16 12 Z" fill="url(#gradient)" />
                </g>
                <g opacity="0.6" fill="#ffffff">
                  <rect x="5" y="5" width="1" height="1" />
                  <rect x="26" y="5" width="1" height="1" />
                  <rect x="5" y="26" width="1" height="1" />
                  <rect x="26" y="26" width="1" height="1" />
                </g>
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{stopColor: '#667eea', stopOpacity: 1}} />
                    <stop offset="50%" style={{stopColor: '#764ba2', stopOpacity: 1}} />
                    <stop offset="100%" style={{stopColor: '#4338ca', stopOpacity: 1}} />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <span className="font-semibold tracking-tight">Anshuman Biswas</span>
          </Link>
          
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:bg-slate-50 hover:text-slate-950"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
        </div>
      </nav>

      {/* Header */}
      <section className="mx-auto max-w-6xl px-4 py-8 md:px-6">
        <div className="text-center space-y-4">
          <h1 className="font-display text-4xl md:text-5xl text-slate-950">
            Writing & Insights
          </h1>
          <p className="mx-auto max-w-2xl text-lg leading-8 text-slate-600">
            Essays on enterprise software, cloud systems, AI, security, and the software ideas I keep returning to.
          </p>
          <div className="flex justify-center pt-4">
            <Link
              href={config.BLOG_VIEW_ALL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:bg-slate-50 hover:text-slate-950"
            >
              <ExternalLink className="h-4 w-4" />
              Visit Full Blog Site
            </Link>
          </div>
        </div>
      </section>

      {/* Blog Posts */}
      <section className="mx-auto max-w-6xl px-4 py-8 md:px-6">
        {loading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="overflow-hidden rounded-[28px] border border-slate-200 bg-white/85 shadow-[0_18px_50px_-34px_rgba(15,23,42,0.35)]">
                <div className="aspect-[16/10] animate-pulse bg-slate-200" />
                <div className="space-y-3 p-6">
                  <div className="h-4 w-1/3 animate-pulse rounded bg-slate-100" />
                  <div className="h-6 w-4/5 animate-pulse rounded bg-slate-200" />
                  <div className="h-4 w-full animate-pulse rounded bg-slate-100" />
                  <div className="h-4 w-2/3 animate-pulse rounded bg-slate-100" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="mb-4 text-red-600">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:bg-slate-50 hover:text-slate-950"
            >
              Try Again
            </button>
          </div>
        ) : blogPosts.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {blogPosts.map((post, index) => (
              <article key={index} className="group overflow-hidden rounded-[28px] border border-slate-200 bg-white/85 shadow-[0_18px_50px_-34px_rgba(15,23,42,0.35)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_28px_70px_-38px_rgba(15,23,42,0.45)]">
                <Link
                  href={post.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  {post.cover_image_url ? (
                    <img
                      src={post.cover_image_url}
                      alt={post.title}
                      className="aspect-[16/10] w-full object-cover"
                    />
                  ) : (
                    <div className="aspect-[16/10] w-full bg-[linear-gradient(135deg,#082f49,#0f172a_45%,#164e63)]" />
                  )}

                  <div className="space-y-4 p-6">
                    <div className="flex items-center justify-between gap-4">
                      {post.categories.length > 0 ? (
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                          {post.categories[0]}
                        </span>
                      ) : (
                        <span />
                      )}
                      <ArrowUpRight className="h-4 w-4 text-slate-400 transition group-hover:text-slate-700" />
                    </div>

                    <div className="space-y-3">
                      <h3 className="line-clamp-2 text-xl font-semibold leading-snug text-slate-950 transition group-hover:text-slate-700">
                        {post.title}
                      </h3>
                      {post.excerpt && (
                        <p className="line-clamp-4 text-sm leading-7 text-slate-600">
                          {post.excerpt}
                        </p>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-4 border-t border-slate-100 pt-3 text-sm text-slate-500">
                      <span className="inline-flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {post.date}
                      </span>
                      <span>{post.read_time}</span>
                    </div>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="mb-4 text-gray-600">No blog posts available at the moment.</p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:bg-slate-50 hover:text-slate-950"
            >
              Back to Home
            </Link>
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="mx-auto mt-16 max-w-6xl border-t border-gray-200 px-4 py-16 md:px-6">
        <div className="text-center">
          <p className="text-sm text-gray-600">
            © {new Date().getFullYear()} Anshuman Biswas. All rights reserved.
          </p>
        </div>
      </footer>
    </main>
  );
}
