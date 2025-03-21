"use client";

import { useState, useEffect } from "react";
import Image from "next/image"
import Link from "next/link"
import { Github, Linkedin, Facebook, Twitter, ExternalLink } from "lucide-react"
import Script from "next/script"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { BlogCarousel } from "@/components/blog-carousel"
import config from "@/config"

export default function Home() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState("");
  
  // Load values from our git-ignored config
  const { RECAPTCHA_SITE_KEY, API_URL } = config;

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
      
      console.log(`Attempting to fetch from: ${API_URL}`);
      
      // Send AJAX request with fetch using the API_URL from config
      fetch(API_URL, {
        method: "POST",
        headers: { 
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: new URLSearchParams({
          name: name.value,
          email: email.value,
          message: message.value,
          'g-recaptcha-response': token
        }).toString(),
        redirect: 'manual' // Don't follow redirects
      })
      .then(response => {
        console.log('Response received:', {
          status: response.status,
          statusText: response.statusText,
          type: response.type,
          url: response.url,
          redirected: response.redirected
        });
        
        if (response.type === 'opaqueredirect') {
          // This means we got a redirect that we're not allowed to follow due to CORS
          throw new Error('Received redirect from server - check server CORS configuration');
        }
        
        if (!response.ok) {
          throw new Error(`Server responded with status: ${response.status} ${response.statusText}`);
        }
        
        return response.json();
      })
      .then(data => {
        console.log('Response data:', data);
        
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
        
        // More detailed error for troubleshooting
        if (error.message.includes('Failed to fetch')) {
          setStatus("Connection error: Could not reach the server. Please check that your server is running at " + API_URL);
        } else {
          setStatus("Error: " + error.message);
        }
      });
    };
  }, []);

  // Normal form submission handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // We don't need to do anything here - reCAPTCHA will call onSubmit
  };

  return (
    <main className="min-h-screen bg-background">
      {/* Load reCAPTCHA script exactly as in your index.html */}
      <Script
        src="https://www.google.com/recaptcha/api.js"
        strategy="afterInteractive"
      />
      
      {/* Navigation */}
      <nav className="container mx-auto py-6 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold">
          Anshuman Biswas
        </Link>
        <div className="hidden md:flex items-center gap-6">
          <Link href="#about" className="text-foreground hover:text-primary transition-colors">
            About
          </Link>
          <Link href="#work" className="text-foreground hover:text-primary transition-colors">
            Work
          </Link>
          <Link href="#blog" className="text-foreground hover:text-primary transition-colors">
            Blog
          </Link>
          <Link href="#contact" className="text-foreground hover:text-primary transition-colors">
            Contact
          </Link>
        </div>
        <Button variant="outline" size="sm" className="hidden md:flex">
          Resume
        </Button>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto py-24 md:py-32 flex flex-col md:flex-row items-center gap-12">
        <div className="flex-1 space-y-8">
          <div className="space-y-4">
            <h1 className="text-5xl md:text-7xl font-bold leading-tight">I optimize cloud systems for scale.</h1>
            <p className="text-xl text-muted-foreground max-w-2xl">
              Engineering Manager at IBM with over a decade of experience in cloud computing and distributed systems.
            </p>
          </div>

          <div className="flex gap-4">
            <Button size="lg">View My Work</Button>
            <Button variant="outline" size="lg">
              Contact Me
            </Button>
          </div>

          <div className="flex gap-6 pt-4">
            <Link href="https://github.com" className="text-muted-foreground hover:text-foreground transition-colors">
              <Github className="h-6 w-6" />
              <span className="sr-only">GitHub</span>
            </Link>
            <Link href="https://linkedin.com" className="text-muted-foreground hover:text-foreground transition-colors">
              <Linkedin className="h-6 w-6" />
              <span className="sr-only">LinkedIn</span>
            </Link>
            <Link href="https://facebook.com" className="text-muted-foreground hover:text-foreground transition-colors">
              <Facebook className="h-6 w-6" />
              <span className="sr-only">Facebook</span>
            </Link>
            <Link href="https://twitter.com" className="text-muted-foreground hover:text-foreground transition-colors">
              <Twitter className="h-6 w-6" />
              <span className="sr-only">Twitter</span>
            </Link>
          </div>
        </div>

        <div className="relative w-full md:w-1/2 h-[400px] md:h-[500px]">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 md:w-80 md:h-80 rounded-full bg-primary/10"></div>

          <div className="absolute top-[10%] right-[20%] w-20 h-20 rounded-full bg-primary flex items-center justify-center text-white font-medium text-sm">
            <span className="text-center">
              Cloud
              <br />
              Computing
            </span>
          </div>

          <div className="absolute top-[30%] left-[15%] w-20 h-20 rounded-full bg-primary flex items-center justify-center text-white font-medium text-sm">
            <span className="text-center">
              Distributed
              <br />
              Systems
            </span>
          </div>

          <div className="absolute bottom-[20%] right-[30%] w-20 h-20 rounded-full bg-primary flex items-center justify-center text-white font-medium text-sm">
            <span className="text-center">
              Machine
              <br />
              Learning
            </span>
          </div>

          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="relative w-48 h-48 md:w-64 md:h-64 rounded-full overflow-hidden border-4 border-background shadow-xl">
              <Image
                src="/placeholder.svg?height=256&width=256"
                alt="Anshuman Biswas"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 bg-muted/30">
        <div className="container mx-auto">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold mb-8">About Me</h2>

            <div className="prose prose-lg max-w-none">
              <p>
                Anshuman is an Engineering Manager at{" "}
                <Link href="https://ibm.com" className="text-primary hover:underline">
                  IBM
                </Link>
                . Having worked in Cloud Computing technologies for over a decade, he relishes the challenges that come
                with designing distributed systems. He defended his{" "}
                <Link href="#" className="text-primary hover:underline">
                  Ph.D. degree
                </Link>{" "}
                in 2019 from{" "}
                <Link href="https://carleton.ca" className="text-primary hover:underline">
                  Carleton University
                </Link>
                , Ottawa in the area of cloud middleware performance aided with machine learning.
              </p>
              <p>
                His interests lie in designing applications across any combination of public and private clouds with the
                ability to optimally consume cloud resources based on cost, capacity and capability.
              </p>
            </div>

            <div className="mt-12 grid grid-cols-2 md:grid-cols-5 gap-6 justify-center">
              <div className="flex flex-col items-center text-center">
                <div className="w-24 h-24 rounded-full bg-primary flex items-center justify-center text-white mb-4">
                  <span className="font-medium">
                    Software
                    <br />
                    Architecture
                  </span>
                </div>
                <span className="text-sm text-muted-foreground">Expert</span>
              </div>

              <div className="flex flex-col items-center text-center">
                <div className="w-24 h-24 rounded-full bg-primary flex items-center justify-center text-white mb-4">
                  <span className="font-medium">
                    Cloud
                    <br />
                    Computing
                  </span>
                </div>
                <span className="text-sm text-muted-foreground">Expert</span>
              </div>

              <div className="flex flex-col items-center text-center">
                <div className="w-24 h-24 rounded-full bg-primary flex items-center justify-center text-white mb-4">
                  <span className="font-medium">
                    Machine
                    <br />
                    Learning
                  </span>
                </div>
                <span className="text-sm text-muted-foreground">Advanced</span>
              </div>

              <div className="flex flex-col items-center text-center">
                <div className="w-24 h-24 rounded-full bg-primary flex items-center justify-center text-white mb-4">
                  <span className="font-medium">
                    Tech
                    <br />
                    Blogging
                  </span>
                </div>
                <span className="text-sm text-muted-foreground">Intermediate</span>
              </div>

              <div className="flex flex-col items-center text-center">
                <div className="w-24 h-24 rounded-full bg-primary flex items-center justify-center text-white mb-4">
                  <span className="font-medium">Music</span>
                </div>
                <span className="text-sm text-muted-foreground">Amateur</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Work Section */}
      <section id="work" className="py-24">
        <div className="container mx-auto">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold mb-8">Recent Work</h2>

            <div className="grid gap-12">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="order-2 md:order-1">
                  <h3 className="text-2xl font-bold mb-4">Cloud Optimization Platform</h3>
                  <p className="text-muted-foreground mb-6">
                    A platform for optimizing cloud resource allocation across multiple providers using machine learning
                    algorithms.
                  </p>
                  <Button variant="outline" size="sm" className="group">
                    View Project{" "}
                    <ExternalLink className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
                <div className="relative h-64 rounded-lg overflow-hidden order-1 md:order-2">
                  <Image
                    src="/placeholder.svg?height=400&width=600"
                    alt="Project screenshot"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="relative h-64 rounded-lg overflow-hidden">
                  <Image
                    src="/placeholder.svg?height=400&width=600"
                    alt="Project screenshot"
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-4">Distributed Systems Framework</h3>
                  <p className="text-muted-foreground mb-6">
                    An open-source framework for building resilient and scalable distributed applications.
                  </p>
                  <Button variant="outline" size="sm" className="group">
                    View Project{" "}
                    <ExternalLink className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Blog Section */}
      <section id="blog" className="py-24 bg-muted/30">
        <div className="container mx-auto">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-4xl font-bold mb-8">Featured Articles</h2>
            <BlogCarousel />
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24">
        <div className="container mx-auto">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold mb-8">Get In Touch</h2>

            <div className="grid md:grid-cols-2 gap-12">
              <div>
                <p className="text-lg mb-6">
                  Interested in collaborating or have a question? Feel free to reach out using the contact form or
                  connect with me on social media.
                </p>

                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Github className="h-5 w-5 text-primary" />
                    </div>
                    <Link href="https://github.com" className="text-foreground hover:text-primary transition-colors">
                      github.com/anshumanbiswas
                    </Link>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Linkedin className="h-5 w-5 text-primary" />
                    </div>
                    <Link href="https://linkedin.com" className="text-foreground hover:text-primary transition-colors">
                      linkedin.com/in/anshumanbiswas
                    </Link>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Twitter className="h-5 w-5 text-primary" />
                    </div>
                    <Link href="https://twitter.com" className="text-foreground hover:text-primary transition-colors">
                      twitter.com/anshumanbiswas
                    </Link>
                  </div>
                </div>
              </div>

              <div>
                <form id="message-form" onSubmit={handleSubmit}>
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label htmlFor="name" className="text-sm font-medium">Name</label>
                      <Input 
                        type="text" 
                        name="name" 
                        id="name" 
                        placeholder="Your name" 
                        required 
                        onChange={handleChange} 
                        value={formData.name}
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-medium">Email</label>
                      <Input 
                        type="email" 
                        name="email" 
                        id="email" 
                        placeholder="your.email@example.com" 
                        required 
                        onChange={handleChange} 
                        value={formData.email}
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="message" className="text-sm font-medium">Message</label>
                      <Textarea 
                        name="message" 
                        id="message" 
                        placeholder="Your message" 
                        rows={4} 
                        required 
                        onChange={handleChange} 
                        value={formData.message}
                      />
                    </div>

                    <Button 
                      className="g-recaptcha w-full" 
                      data-sitekey={RECAPTCHA_SITE_KEY} 
                      data-callback="onSubmit" 
                      data-action="submit"
                      type="submit" 
                      id="messageSend"
                    >
                      Send Message
                    </Button>
                    
                    {status && (
                      <p className={`text-sm ${status.includes("success") ? "text-green-600" : "text-red-600"}`}>
                        {status}
                      </p>
                    )}
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted/30 py-12 border-t">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div>
              <Link href="/" className="text-xl font-bold">
                Anshuman Biswas
              </Link>
              <p className="text-sm text-muted-foreground mt-1">Engineering Manager & Software Architect</p>
            </div>

            <div className="flex items-center gap-6">
              <Link href="#about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                About
              </Link>
              <Link href="#work" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Work
              </Link>
              <Link href="#blog" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Blog
              </Link>
              <Link href="#contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Contact
              </Link>
            </div>

            <div className="flex items-center gap-4">
              <Link href="https://github.com" className="text-muted-foreground hover:text-foreground transition-colors">
                <Github className="h-5 w-5" />
                <span className="sr-only">GitHub</span>
              </Link>
              <Link
                href="https://linkedin.com"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Linkedin className="h-5 w-5" />
                <span className="sr-only">LinkedIn</span>
              </Link>
              <Link
                href="https://facebook.com"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link
                href="https://twitter.com"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Link>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t text-center">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Anshuman Biswas. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}

// Add the minimal global type definition needed
declare global {
  interface Window {
    onSubmit: (token: string) => void;
  }
}

