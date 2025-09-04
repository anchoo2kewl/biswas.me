"use client"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

// Sample blog data
const blogPosts = [
  {
    id: 1,
    title: "Optimizing Cloud Resource Allocation with Machine Learning",
    excerpt:
      "Learn how to use machine learning algorithms to optimize cloud resource allocation across multiple providers.",
    date: "March 15, 2023",
    category: "Cloud Computing",
    image: "/placeholder.svg?height=400&width=600",
  },
  {
    id: 2,
    title: "Building Resilient Distributed Systems",
    excerpt: "A comprehensive guide to building resilient and scalable distributed systems for modern applications.",
    date: "February 22, 2023",
    category: "Distributed Systems",
    image: "/placeholder.svg?height=400&width=600",
  },
  {
    id: 3,
    title: "The Future of Cloud Middleware Performance",
    excerpt:
      "Exploring the latest advancements in cloud middleware performance and what it means for your applications.",
    date: "January 10, 2023",
    category: "Cloud Computing",
    image: "/placeholder.svg?height=400&width=600",
  },
  {
    id: 4,
    title: "Machine Learning for Cloud Optimization",
    excerpt: "How machine learning is revolutionizing the way we optimize cloud resources and infrastructure.",
    date: "December 5, 2022",
    category: "Machine Learning",
    image: "/placeholder.svg?height=400&width=600",
  },
  {
    id: 5,
    title: "Designing Multi-Cloud Architectures",
    excerpt: "Best practices for designing and implementing multi-cloud architectures for enterprise applications.",
    date: "November 18, 2022",
    category: "Cloud Architecture",
    image: "/placeholder.svg?height=400&width=600",
  },
]

export function BlogCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [visibleCount, setVisibleCount] = useState(3)
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
            disabled={currentIndex === 0}
            className="rounded-full"
          >
            <ChevronLeft className="h-5 w-5" />
            <span className="sr-only">Previous</span>
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={handleNext}
            disabled={currentIndex >= maxIndex}
            className="rounded-full"
          >
            <ChevronRight className="h-5 w-5" />
            <span className="sr-only">Next</span>
          </Button>
        </div>
      </div>

      <div ref={containerRef} className="overflow-hidden">
        <div
          className="flex transition-transform duration-300 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * (100 / visibleCount)}%)` }}
        >
          {blogPosts.map((post) => (
            <div key={post.id} className="w-full sm:w-1/2 lg:w-1/3 flex-shrink-0 p-3">
              <Card className="h-full overflow-hidden hover:shadow-md transition-shadow">
                <div className="relative h-48 w-full">
                  <Image src={post.image || "/placeholder.svg"} alt={post.title} fill className="object-cover" />
                </div>
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Badge variant="secondary">{post.category}</Badge>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3 mr-1" />
                      {post.date}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold mb-2 line-clamp-2">{post.title}</h3>
                  <p className="text-muted-foreground mb-4 line-clamp-3">{post.excerpt}</p>
                  <Link
                    href={`/blog/${post.id}`}
                    className="text-primary font-medium hover:underline inline-flex items-center"
                  >
                    Read More
                  </Link>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

