"use client"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { fetchBlogPosts, type BlogPost } from "@/lib/blog-api"


export function BlogCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [visibleCount, setVisibleCount] = useState(3)
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const updateVisibleCount = () => {
      if (window.innerWidth < 640) {
        setVisibleCount(1)
      } else if (window.innerWidth < 1024) {
        setVisibleCount(2)
      } else {
        setVisibleCount(3)
      }
    }

    updateVisibleCount()
    window.addEventListener("resize", updateVisibleCount)
    return () => window.removeEventListener("resize", updateVisibleCount)
  }, [])

  // Fetch blog posts on component mount
  useEffect(() => {
    const loadBlogPosts = async () => {
      setLoading(true)
      try {
        const posts = await fetchBlogPosts()
        setBlogPosts(posts)
      } catch (error) {
        console.error('Failed to load blog posts:', error)
      } finally {
        setLoading(false)
      }
    }

    loadBlogPosts()
  }, [])

  const maxIndex = Math.max(0, blogPosts.length - visibleCount)

  const handlePrev = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1))
  }

  const handleNext = () => {
    setCurrentIndex((prev) => Math.min(maxIndex, prev + 1))
  }

  return (
    <div className="relative">
      <div className="flex justify-between items-center mb-6">
        <div className="flex-1"></div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={handlePrev}
            disabled={loading || currentIndex === 0 || blogPosts.length === 0}
            className="rounded-full"
          >
            <ChevronLeft className="h-5 w-5" />
            <span className="sr-only">Previous</span>
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={handleNext}
            disabled={loading || currentIndex >= maxIndex || blogPosts.length === 0}
            className="rounded-full"
          >
            <ChevronRight className="h-5 w-5" />
            <span className="sr-only">Next</span>
          </Button>
        </div>
      </div>

      <div ref={containerRef} className="overflow-hidden">
        {loading ? (
          <div className="flex gap-4">
            {Array.from({ length: visibleCount }).map((_, i) => (
              <div key={i} className="w-full sm:w-1/2 lg:w-1/3 flex-shrink-0 p-3">
                <Card className="h-full overflow-hidden">
                  <div className="h-48 w-full bg-gray-200 animate-pulse"></div>
                  <CardContent className="p-6">
                    <div className="space-y-3">
                      <div className="h-4 bg-gray-200 rounded animate-pulse w-1/3"></div>
                      <div className="h-6 bg-gray-200 rounded animate-pulse w-3/4"></div>
                      <div className="h-4 bg-gray-200 rounded animate-pulse w-full"></div>
                      <div className="h-4 bg-gray-200 rounded animate-pulse w-2/3"></div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        ) : blogPosts.length > 0 ? (
          <div
            className="flex transition-transform duration-300 ease-in-out"
            style={{ transform: `translateX(-${currentIndex * (100 / visibleCount)}%)` }}
          >
            {blogPosts.map((post, index) => (
              <div key={index} className="w-full sm:w-1/2 lg:w-1/3 flex-shrink-0 p-3">
                <Card className="h-full overflow-hidden hover:shadow-md transition-shadow">
                  <div className="relative h-48 w-full bg-gradient-to-br from-blue-500/10 to-purple-500/10 flex items-center justify-center">
                    <div className="text-6xl opacity-20">📝</div>
                  </div>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      {post.categories.length > 0 && (
                        <Badge variant="secondary">{post.categories[0]}</Badge>
                      )}
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3 mr-1" />
                        {post.date}
                      </div>
                    </div>
                    <h3 className="text-xl font-bold mb-2 line-clamp-2">{post.title}</h3>
                    <p className="text-muted-foreground mb-4 text-sm">
                      {post.read_time}
                    </p>
                    <Link
                      href={post.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary font-medium hover:underline inline-flex items-center"
                    >
                      Read More
                    </Link>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No blog posts available at the moment.</p>
          </div>
        )}
      </div>
    </div>
  )
}

