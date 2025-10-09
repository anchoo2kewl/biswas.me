"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Link from "next/link"
import { Github, Linkedin, Mail, Calendar, ArrowUpRight, FileText } from "lucide-react"
import Script from "next/script"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { InteractiveTimeline } from "@/components/interactive-timeline"
import { fetchBlogPosts, type BlogPost } from "@/lib/blog-api"
import config from "@/config"

// Dynamically import PDF viewer to avoid SSR issues
const SimplePDFViewer = dynamic(() => import("@/components/simple-pdf-viewer").then(mod => ({ default: mod.SimplePDFViewer })), {
  ssr: false,
  loading: () => (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center">
      <div className="text-white">Loading PDF viewer...</div>
    </div>
  )
});



export default function Home() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState("");
  const [showPDF, setShowPDF] = useState(false);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [blogLoading, setBlogLoading] = useState(true);
  
  // Load values from our git-ignored config
  const { RECAPTCHA_SITE_KEY, API_URL, BLOG_VIEW_ALL_URL } = config;

  // Check for resume hash on load
  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.hash === '#resume') {
      setShowPDF(true);
    }
  }, []);

  // Fetch blog posts on component mount
  useEffect(() => {
    const loadBlogPosts = async () => {
      setBlogLoading(true);
      try {
        const posts = await fetchBlogPosts();
        setBlogPosts(posts.slice(0, 3)); // Show only first 3 posts on homepage
      } catch (error) {
        console.error('Failed to load blog posts:', error);
      } finally {
        setBlogLoading(false);
      }
    };

    loadBlogPosts();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  // Define the onSubmit function that will be called by reCAPTCHA
  useEffect(() => {
    window.onSubmit = function(token) {
      console.log("reCAPTCHA token received:", token);
      
      // Get the current form data directly from the form elements
      const name = document.getElementById('name') as HTMLInputElement;
      const email = document.getElementById('email') as HTMLInputElement;
      const message = document.getElementById('message') as HTMLTextAreaElement;
      
      if (!name.value || !email.value || !message.value) {
        setStatus("Please fill in all fields before submitting.");
        return;
      }
      
      setStatus("Sending...");
      
      // Create JSON payload for REST API
      const payload = {
        name: name.value,
        email: email.value,
        message: message.value,
        'g-recaptcha-response': token
      };
      
      // Send JSON request to REST API
      fetch(API_URL, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      })
      .then(response => {
        if (response.type === 'opaqueredirect') {
          throw new Error('Received redirect from server - check server CORS configuration');
        }
        
        if (!response.ok) {
          throw new Error(`Server responded with status: ${response.status} ${response.statusText}`);
        }
        
        return response.json();
      })
      .then(data => {
        if (data.status === 'success') {
          setStatus("Message sent successfully! Thank you for reaching out.");
          // Reset form on success
          setFormData({ name: "", email: "", message: "" });
          name.value = "";
          email.value = "";
          message.value = "";
        } else {
          setStatus(data.error_message || "Failed to send message. Please try again.");
        }
      })
      .catch(error => {
        console.error("Error submitting form:", error);
        setStatus("There was an error sending your message. Please try again or email me directly.");
      });
    };
  }, [API_URL]);

  // Normal form submission handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  // Enhanced smooth scrolling
  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    const element = document.getElementById(targetId.replace('#', ''));
    if (element) {
      const offsetTop = element.offsetTop - 80; // Account for nav height
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      });
    }
  };

  return (
    <main className="min-h-screen bg-white">
      {/* Load reCAPTCHA script */}
      <Script
        src="https://www.google.com/recaptcha/api.js"
        strategy="afterInteractive"
      />
      
      {/* Navigation */}
      <nav className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center">
          <Link href="/" className="flex items-center gap-1 text-xl font-semibold text-gray-900 hover:text-gray-600 transition-colors">
            <div className="w-8 h-8 inline-flex items-center justify-center">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="transition-transform hover:scale-125 animate-pulse-custom hover:animate-pulse-fast">
                {/* Background Circle with Tech Gradient */}
                <circle cx="16" cy="16" r="16" fill="url(#gradient)" />
                
                {/* Letter 'A' */}
                <g fill="#ffffff">
                  {/* Main body of A */}
                  <path d="M16 9 L21 23 L19.25 23 L18.25 20 L13.75 20 L12.75 23 L11 23 L16 9 Z" />
                  {/* Horizontal bar */}
                  <rect x="14.25" y="17" width="3.5" height="1.5" />
                  {/* Inner triangle cutout for depth */}
                  <path d="M16 12 L17.25 16 L14.75 16 L16 12 Z" fill="url(#gradient)" />
                </g>
                
                {/* Tech accent elements */}
                <g opacity="0.6" fill="#ffffff">
                  {/* Small squares in corners */}
                  <rect x="5" y="5" width="1" height="1" />
                  <rect x="26" y="5" width="1" height="1" />
                  <rect x="5" y="26" width="1" height="1" />
                  <rect x="26" y="26" width="1" height="1" />
                </g>
                
                {/* Gradient Definitions */}
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
          <div className="flex items-center gap-8">
            <div className="hidden md:flex items-center gap-6">
              <Link 
                href="#about" 
                onClick={(e) => handleSmoothScroll(e, '#about')}
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                About
              </Link>
              <Link 
                href="#work" 
                onClick={(e) => handleSmoothScroll(e, '#work')}
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                Work
              </Link>
              <Link 
                href="#writing" 
                onClick={(e) => handleSmoothScroll(e, '#writing')}
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                Writing
              </Link>
              <Link 
                href="#contact" 
                onClick={(e) => handleSmoothScroll(e, '#contact')}
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                Contact
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-4xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-8 items-center">
          <div className="md:col-span-2 space-y-8">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                I optimize cloud systems for scale.
              </h1>
              <p className="text-lg text-gray-600 max-w-2xl leading-relaxed">
                VP of Engineering at <Link href="https://elastio.com" className="text-gray-900 hover:text-gray-600 underline underline-offset-4">Elastio</Link> with 
                nearly two decades of experience in cloud computing and distributed systems. 
                I build resilient architectures that scale gracefully.
              </p>
              
              <div className="flex items-center gap-4 pt-2">
                <Button 
                  onClick={() => setShowPDF(true)}
                  className="bg-gray-900 hover:bg-gray-800 text-white flex items-center gap-2"
                >
                  <FileText className="h-4 w-4" />
                  View PDF Resume
                </Button>
                <Button 
                  variant="outline" 
                  asChild
                >
                  <Link href="/resume">
                    📄 HTML Resume
                  </Link>
                </Button>
                <Button 
                  variant="outline" 
                  asChild
                >
                  <a href="/AnshumanBiswas.pdf" download="Anshuman_Biswas_Resume.pdf">
                    Download PDF
                  </a>
                </Button>
              </div>
            </div>

            <div className="flex items-center gap-6 pt-4">
              <Link 
                href="https://github.com/anchoo2kewl" 
                className="text-gray-600 hover:text-gray-900 transition-colors flex items-center gap-2"
              >
                <Github className="h-5 w-5" />
                <span>GitHub</span>
              </Link>
              <Link 
                href="https://linkedin.com/in/anshumanbiswas" 
                className="text-gray-600 hover:text-gray-900 transition-colors flex items-center gap-2"
              >
                <Linkedin className="h-5 w-5" />
                <span>LinkedIn</span>
              </Link>
            </div>
          </div>
          
          <div className="md:col-span-1 flex justify-center md:justify-end">
            <div className="relative">
              <img 
                src="/me_medium.jpg" 
                alt="Anshuman Biswas"
                className="w-48 h-48 md:w-56 md:h-56 rounded-full object-cover shadow-lg ring-4 ring-white"
              />
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-blue-500/10 to-purple-500/10"></div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="max-w-4xl mx-auto px-4 py-16 border-t border-gray-100">
        <div className="space-y-12">
          <h2 className="text-2xl font-semibold text-gray-900">About</h2>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-700 leading-relaxed">
              I serve as Vice President of Engineering at <Link href="https://elastio.com" className="text-gray-900 hover:text-gray-600 underline underline-offset-4">Elastio</Link>, where I lead the development of cutting-edge cloud-native data protection and recovery solutions. For nearly two decades, I have specialized in cloud computing and distributed systems, with recent emphasis on leveraging AI to transform engineering methodologies.
            </p>
            <p className="text-gray-700 leading-relaxed">
              My expertise centers on designing scalable and resilient architectures that enable organizations to safeguard their data and ensure rapid recovery from disruptions. I hold a <Link href="https://carleton.scholaris.ca/items/be9fc98a-4d7a-431b-9095-7eccccf8eea3/full" className="text-gray-900 hover:text-gray-600 underline underline-offset-4">Ph.D. in Computer Science from Carleton University</Link>, where my research focused on machine learning approaches for cloud performance optimization. This academic foundation continues to shape my approach to complex technical challenges.
            </p>
            <p className="text-gray-700 leading-relaxed">
              At Elastio, I am committed to building world-class engineering teams while advancing the frontiers of AI integration. We are implementing custom models within our platform to enhance threat detection, streamline workflows, and accelerate recovery processes across cloud environments. This work represents a significant advancement in enterprise data protection, and I take pride in our collective achievements.
            </p>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section id="work" className="max-w-6xl mx-auto px-4 py-16 border-t border-gray-100">
        <div className="space-y-12">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-gray-900">Career Journey</h2>
            <p className="text-gray-600 mt-2">A chronological timeline of my professional experience</p>
          </div>
          
          <InteractiveTimeline />
        </div>
      </section>

      {/* Writing Section */}
      <section id="writing" className="max-w-4xl mx-auto px-4 py-16 border-t border-gray-100">
        <div className="space-y-12">
          <h2 className="text-2xl font-semibold text-gray-900">Recent Writing</h2>
          
          {blogLoading ? (
            <div className="space-y-6">
              {/* Loading skeleton */}
              {[1, 2, 3].map((i) => (
                <div key={i} className="py-4 border-b border-gray-100">
                  <div className="space-y-2">
                    <div className="h-6 bg-gray-200 rounded animate-pulse w-3/4"></div>
                    <div className="h-4 bg-gray-100 rounded animate-pulse w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : blogPosts.length > 0 ? (
            <div className="space-y-6">
              {blogPosts.map((post, index) => (
                <article key={index} className="group">
                  <Link href={post.link} target="_blank" rel="noopener noreferrer" className="block">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 py-4 border-b border-gray-100 hover:border-gray-200 transition-colors">
                      <div className="space-y-1">
                        <h3 className="text-lg font-medium text-gray-900 group-hover:text-gray-600 transition-colors">
                          {post.title}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {post.date}
                          </span>
                          {post.categories.length > 0 && <span>{post.categories[0]}</span>}
                          <span>{post.read_time}</span>
                        </div>
                      </div>
                      <ArrowUpRight className="h-4 w-4 text-gray-400 group-hover:text-gray-600 transition-colors self-start md:self-center" />
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">No blog posts available at the moment.</p>
            </div>
          )}
          
          <div className="pt-4">
            <Link 
              href="/blog"
              className="text-gray-600 hover:text-gray-900 transition-colors text-sm flex items-center gap-2"
            >
              View all posts
              <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="max-w-4xl mx-auto px-4 py-16 border-t border-gray-100">
        <div className="space-y-12">
          <h2 className="text-2xl font-semibold text-gray-900">Get In Touch</h2>
          
          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-6">
              <p className="text-gray-700 leading-relaxed">
                Interested in collaborating on cloud infrastructure, distributed systems, or machine learning projects? 
                I'd love to hear from you.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                    <Github className="h-4 w-4 text-gray-600" />
                  </div>
                  <Link href="https://github.com/anchoo2kewl" className="text-gray-700 hover:text-gray-900 transition-colors">
                    github.com/anchoo2kewl
                  </Link>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                    <Linkedin className="h-4 w-4 text-gray-600" />
                  </div>
                  <Link href="https://linkedin.com/in/anshumanbiswas" className="text-gray-700 hover:text-gray-900 transition-colors">
                    linkedin.com/in/anshumanbiswas
                  </Link>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                    <Mail className="h-4 w-4 text-gray-600" />
                  </div>
                  <Link href="mailto:anshuman@biswas.me" className="text-gray-700 hover:text-gray-900 transition-colors">
                    anshuman@biswas.me
                  </Link>
                </div>
              </div>
            </div>
            
            <div>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium text-gray-700">Name</label>
                  <Input 
                    type="text" 
                    name="name" 
                    id="name" 
                    placeholder="Your name" 
                    required 
                    onChange={handleChange} 
                    value={formData.name}
                    className="border-gray-200 focus:border-gray-400 focus:ring-0"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium text-gray-700">Email</label>
                  <Input 
                    type="email" 
                    name="email" 
                    id="email" 
                    placeholder="your.email@example.com" 
                    required 
                    onChange={handleChange} 
                    value={formData.email}
                    className="border-gray-200 focus:border-gray-400 focus:ring-0"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-medium text-gray-700">Message</label>
                  <Textarea 
                    name="message" 
                    id="message" 
                    placeholder="Your message" 
                    rows={4} 
                    required 
                    onChange={handleChange} 
                    value={formData.message}
                    className="border-gray-200 focus:border-gray-400 focus:ring-0 resize-none"
                  />
                </div>

                <Button 
                  className="g-recaptcha w-full bg-gray-900 hover:bg-gray-800 text-white" 
                  data-sitekey={RECAPTCHA_SITE_KEY} 
                  data-callback="onSubmit" 
                  data-action="submit"
                  type="submit"
                >
                  Send Message
                </Button>
                
                {status && (
                  <p className={`text-sm ${
                    status.includes("success") 
                      ? "text-green-600" 
                      : "text-red-600"
                  }`}>
                    {status}
                  </p>
                )}
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* PDF Viewer Modal */}
      {showPDF && (
        <SimplePDFViewer 
          isOpen={showPDF}
          onClose={() => {
            setShowPDF(false);
            if (typeof window !== 'undefined' && window.location.hash === '#resume') {
              history.replaceState('', document.title, window.location.pathname + window.location.search);
            }
          }}
          pdfUrl="/AnshumanBiswas.pdf"
        />
      )}

      {/* Footer */}
      <footer className="max-w-4xl mx-auto px-4 py-16 border-t border-gray-100">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2">
            <Link href="/" className="text-lg font-semibold text-gray-900 hover:text-gray-600 transition-colors">
              Anshuman Biswas
            </Link>
            <p className="text-sm text-gray-600">
              VP of Engineering & Cloud Architect
            </p>
          </div>

          <div className="flex items-center gap-6">
            <Link 
              href="https://github.com/anshumanbiswas" 
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              <Github className="h-4 w-4" />
              <span className="sr-only">GitHub</span>
            </Link>
            <Link 
              href="https://linkedin.com/in/anshumanbiswas" 
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              <Linkedin className="h-4 w-4" />
              <span className="sr-only">LinkedIn</span>
            </Link>
            <Link 
              href="mailto:anshuman@biswas.me" 
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              <Mail className="h-4 w-4" />
              <span className="sr-only">Email</span>
            </Link>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-100 text-center">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} Anshuman Biswas. All rights reserved.
          </p>
        </div>
      </footer>
    </main>
  );
}

// Add the global type definition needed for reCAPTCHA
declare global {
  interface Window {
    onSubmit: (token: string) => void;
  }
}

