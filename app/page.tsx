"use client";

import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import Script from "next/script";
import { fetchBlogPosts, type BlogPost } from "@/lib/blog-api";
import config from "@/config";
import profile from "@/lib/profile.json";
import portfolio from "@/lib/portfolio.json";
import { ProfilePhoto } from "@/components/profile-photo";
import { CareerJourney } from "@/components/career-journey";
import { ProjectGallery as ProjectSection } from "@/components/project-gallery";
import "./portfolio.css";

declare global { interface Window { onSubmit: (token: string) => void; } }

const PDFViewer = dynamic(
  () => import("@/components/simple-pdf-viewer").then((mod) => mod.SimplePDFViewer),
  { ssr: false }
);

const navigation = [
  ["About", "description"], ["Work", "work"], ["Products", "products"],
  ["Financial", "financial"], ["Lifestyle", "lifestyle"],
  ["Libraries", "libraries"], ["Writing", "writing"], ["Contact", "contact"],
];

export default function Home() {
  const [showPDF, setShowPDF] = useState(false);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("");
  const [sending, setSending] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const sendingRef = useRef(false);
  const { API_URL, RECAPTCHA_SITE_KEY } = config;

  useEffect(() => {
    if (window.location.hash === "#resume") setShowPDF(true);
    let active = true;
    fetchBlogPosts()
      .then((result) => { if (active) setPosts(result.slice(0, 3)); })
      .catch(() => { if (active) setPosts([]); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    // Preserve the existing reCAPTCHA callback and server-side token verification.
    const previous = window.onSubmit;
    let active = true;
    const controller = new AbortController();
    window.onSubmit = async (token: string) => {
      const form = formRef.current;
      if (!form || sendingRef.current) return;
      if (!form.reportValidity()) { setStatus("Please fill in all fields before submitting."); return; }
      if (!token) { setStatus("Please complete the security check, or email me directly."); return; }
      const values = new FormData(form);
      sendingRef.current = true;
      setSending(true);
      setStatus("Sending...");
      try {
        const response = await fetch(API_URL, {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: values.get("name"), email: values.get("email"), message: values.get("message"), "g-recaptcha-response": token }),
          signal: controller.signal,
        });
        if (!response.ok) throw new Error("Message request failed");
        const result = await response.json();
        if (result.status !== "success") throw new Error("Message was not accepted");
        if (active) { form.reset(); setStatus("Message sent successfully."); }
      } catch {
        if (active) setStatus("There was an error sending your message. Please email me directly.");
      } finally {
        sendingRef.current = false;
        if (active) setSending(false);
      }
    };
    return () => { active = false; controller.abort(); window.onSubmit = previous; };
  }, [API_URL]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    // Google invokes window.onSubmit with a token. Never send an unverified fallback.
  }

  return (
    <>
      <Script src="https://www.google.com/recaptcha/api.js" strategy="afterInteractive" />
      <main className="portfolio" id="top">
        <a className="p-skip" href="#main-content">Skip to content</a>
        <nav className="p-nav" aria-label="Main navigation">
          <div className="p-wrap p-nav-inner">
            <Link href="/" className="p-brand"><span className="p-monogram" aria-hidden="true">AB</span><span>Anshuman Biswas</span></Link>
            <div className="p-desktop-nav">{navigation.map(([label, id]) => <a key={id} href={`#${id}`} onClick={(event) => event.currentTarget.closest("details")?.removeAttribute("open")}>{label}</a>)}</div>
            <details className="p-mobile-nav"><summary>Menu</summary><div>{navigation.map(([label, id]) => <a key={id} href={`#${id}`} onClick={(event) => event.currentTarget.closest("details")?.removeAttribute("open")}>{label}</a>)}</div></details>
          </div>
        </nav>

        <section className="p-hero" id="main-content">
          <div className="p-wrap p-hero-grid">
            <div>
              <p className="p-eyebrow">Engineering leader · Toronto, Canada</p>
              <h1>Anshuman Biswas</h1>
              <p className="p-lead">I’m VP of Engineering at <a href="https://elastio.com" target="_blank" rel="noopener noreferrer">Elastio</a>. Our teams build ransomware detection, database security, and data protection software.</p>
              <p className="p-hero-note">My work includes hiring, helping engineers and managers grow, deciding what we build, and working through the architecture and code.</p>
              <div className="p-actions">
                <button className="p-button p-primary" onClick={() => setShowPDF(true)}>View PDF resume</button>
                <Link className="p-button" href="/resume">Open HTML resume</Link>
                <a className="p-text-link" href="/AnshumanBiswas.pdf" download="Anshuman_Biswas_Resume.pdf">Download PDF ↓</a>
              </div>
              <div className="p-social"><a href={profile.github} target="_blank" rel="noopener noreferrer">GitHub ↗</a><a href={profile.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn ↗</a><a href={`mailto:${profile.email}`}>{profile.email}</a></div>
            </div>
            <ProfilePhoto />
          </div>
        </section>

        <section id="description" className="p-section p-wrap p-about" aria-labelledby="about-title">
          <div className="p-section-heading"><p className="p-eyebrow">About</p><h2 id="about-title">A little background</h2></div>
          <div><p className="p-lead">I’ve been building software professionally since 2007. I co-founded a location-search startup, worked on cloud orchestration at IBM Turbonomic, and built an engineering team from scratch at Veeva.</p><p>My PhD at Carleton focused on <a href="https://carleton.scholaris.ca/items/be9fc98a-4d7a-431b-9095-7eccccf8eea3" target="_blank" rel="noopener noreferrer" style={{ textDecoration: "underline", textUnderlineOffset: "3px" }}>machine learning for cloud middleware performance</a>. At IBM, I also worked on Granite model development and training.</p><p>Outside work, I build products I want to use. TaskAI is used by over 100 developers, including developers at Elastio. FlagTGL has paying customers. I’m also working on security for AI agents, reusable tools for coding agents, and audio courses on any topic.</p><p>I compose music and build LEGO with my sons.</p></div>
        </section>

        <section id="work" className="p-section p-wrap" aria-labelledby="work-title">
          <div className="p-section-heading"><p className="p-eyebrow">Work</p><h2 id="work-title">Career journey</h2><p>The teams, products, and technical problems I’ve worked on.</p></div>
          <CareerJourney />
        </section>

        <ProjectSection id="products" title="Products" description="Tools for managing development work, releasing features, and securing AI agents." items={portfolio.products} />
        <ProjectSection id="financial" title="Finance projects" description="Software I build for tracking investments and managing personal finances." items={portfolio.financial} />
        <ProjectSection id="lifestyle" title="Learning and everyday life" description="Adaptive audio courses, fitness, habits, and software for everyday life." items={portfolio.lifestyle} />
        <ProjectSection id="libraries" title="Libraries and tools" description="Code behind these projects: AI integrations, authentication, publishing, and backups." items={portfolio.libraries} />

        <section id="writing" className="p-section p-wrap" aria-labelledby="writing-title">
          <div className="p-section-heading"><p className="p-eyebrow">Writing</p><h2 id="writing-title">Recent writing</h2><p>Systems, AI workflows, cloud engineering, and lessons from building software.</p><Link className="p-text-link" href="/blog">View all posts ↗</Link></div>
          {loading ? <p role="status">Loading recent writing...</p> : posts.length ? <div className="p-project-grid">{posts.map((post) => <article className="p-project" key={post.link}><p className="p-eyebrow">{post.date} · {post.read_time}</p><h3><a href={post.link} target="_blank" rel="noopener noreferrer">{post.title} ↗</a></h3>{post.excerpt && <p>{post.excerpt}</p>}</article>)}</div> : <p>No blog posts available at the moment.</p>}
        </section>

        <section id="contact" className="p-contact" aria-labelledby="contact-title">
          <div className="p-wrap p-contact-grid"><div><p className="p-eyebrow">Contact</p><h2 id="contact-title">Get in touch</h2><p>Have a question about my work or one of these projects? Send me a note.</p><a className="p-email" href={`mailto:${profile.email}`}>{profile.email}</a><div className="p-contact-links"><a href={profile.github} target="_blank" rel="noopener noreferrer">github.com/anchoo2kewl</a><a href={profile.linkedin} target="_blank" rel="noopener noreferrer">linkedin.com/in/anshuman-biswas-phd</a></div></div>
            <form ref={formRef} onSubmit={handleSubmit} className="p-form">
              <label htmlFor="name">Name</label><input id="name" name="name" autoComplete="name" required maxLength={200} />
              <label htmlFor="email">Email</label><input id="email" name="email" type="email" autoComplete="email" required maxLength={254} />
              <label htmlFor="message">Message</label><textarea id="message" name="message" required rows={5} maxLength={5000} />
              <button type="submit" className="g-recaptcha p-button p-primary" data-sitekey={RECAPTCHA_SITE_KEY} data-callback="onSubmit" data-action="submit" disabled={sending}>{sending ? "Sending..." : "Send message"}</button>
              <p role="status" aria-live="polite">{status}</p>
              <p className="p-small">Protected by reCAPTCHA. Google’s <a href="https://policies.google.com/privacy">Privacy Policy</a> and <a href="https://policies.google.com/terms">Terms of Service</a> apply. Email works without the form.</p>
            </form>
          </div>
        </section>
        <footer className="p-wrap p-footer"><p>Anshuman Biswas · AI, cloud & cybersecurity</p><a href="/photos">Photos of Anshuman Biswas</a><a href="#top">Back to top ↑</a></footer>
      </main>
      <PDFViewer isOpen={showPDF} onClose={() => setShowPDF(false)} pdfUrl="/AnshumanBiswas.pdf" />
    </>
  );
}
