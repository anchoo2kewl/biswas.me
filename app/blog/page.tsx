"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Calendar, ArrowUpRight, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
        const posts = await fetchBlogPosts();
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
    <main className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="max-w-4xl mx-auto px-4 py-8">
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
            <span className="font-semibold tracking-tight">nshuman Biswas</span>
          </Link>
          
          <Button variant="outline" asChild className="border-gray-300 text-gray-700 hover:bg-gray-50">
            <Link href="/" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Link>
          </Button>
        </div>
      </nav>

      {/* Header */}
      <section className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
            Writing & Insights
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Thoughts on cloud computing, distributed systems, machine learning, and software engineering.
          </p>
          <div className="flex justify-center pt-4">
            <Button variant="outline" asChild className="border-gray-300 text-gray-700 hover:bg-gray-50">
              <Link 
                href={config.BLOG_VIEW_ALL_URL} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                <ExternalLink className="h-4 w-4" />
                Visit Full Blog Site
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Blog Posts */}
      <section className="max-w-4xl mx-auto px-4 py-8">
        {loading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="h-64 border border-gray-200">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-1/3"></div>
                    <div className="h-6 bg-gray-200 rounded animate-pulse w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-full"></div>
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-2/3"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-600 mb-4">{error}</p>
            <Button 
              variant="outline" 
              onClick={() => window.location.reload()}
              className="border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Try Again
            </Button>
          </div>
        ) : blogPosts.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {blogPosts.map((post, index) => (
              <Card key={index} className="group hover:shadow-lg transition-all duration-200 border border-gray-200 bg-white">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      {post.categories.length > 0 && (
                        <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-700 hover:bg-gray-200">
                          {post.categories[0]}
                        </Badge>
                      )}
                      <div className="flex items-center text-xs text-gray-500">
                        <Calendar className="h-3 w-3 mr-1" />
                        {post.date}
                      </div>
                    </div>
                    
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-gray-700 transition-colors line-clamp-2 leading-snug">
                      {post.title}
                    </h3>
                    
                    <div className="flex items-center justify-between text-sm pt-2 border-t border-gray-100">
                      <span className="text-gray-600 font-medium">{post.read_time}</span>
                      <Link
                        href={post.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-gray-900 hover:text-gray-600 transition-colors font-medium"
                      >
                        Read More
                        <ArrowUpRight className="h-3 w-3" />
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">No blog posts available at the moment.</p>
            <Button variant="outline" asChild className="border-gray-300 text-gray-700 hover:bg-gray-50">
              <Link href="/">Back to Home</Link>
            </Button>
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="max-w-4xl mx-auto px-4 py-16 border-t border-gray-200 mt-16">
        <div className="text-center">
          <p className="text-sm text-gray-600">
            © {new Date().getFullYear()} Anshuman Biswas. All rights reserved.
          </p>
        </div>
      </footer>
    </main>
  );
}