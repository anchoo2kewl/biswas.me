"use client";

import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import Script from "next/script";
import { fetchBlogPosts, type BlogPost } from "@/lib/blog-api";
import config from "@/config";
import profile from "@/lib/profile.json";
import portfolio from "@/lib/portfolio.json";
import "./portfolio.css";

declare global { interface Window { onSubmit: (token: string) => void; } }

const PDFViewer = dynamic(
  () => import("@/components/simple-pdf-viewer").then((mod) => mod.SimplePDFViewer),
  { ssr: false }
);

type Project = {
  name: string; url: string; category: string; description: string;
  stack: string[]; repo?: string; featured?: boolean;
};

const navigation = [
  ["About", "description"], ["Work", "work"], ["Products", "products"],
  ["Financial", "financial"], ["Lifestyle", "lifestyle"],
  ["Libraries", "libraries"], ["Writing", "writing"], ["Contact", "contact"],
];

function ProjectSection({ id, title, description, items }: {
  id: string; title: string; description: string; items: Project[];
}) {
  return (
    <section id={id} className="p-section p-wrap" aria-labelledby={`${id}-title`}>
      <div className="p-section-heading">
        <p className="p-eyebrow">{id}</p>
        <h2 id={`${id}-title`}>{title}</h2>
        <p>{description}</p>
      </div>
      <div className="p-project-grid">
        {items.map((item) => (
          <article key={item.name} className={`p-project${item.featured ? " p-featured" : ""}`}>
            <p className="p-eyebrow">{item.category}</p>
            <h3><a href={item.url} {...(item.url.startsWith("https:") ? { target: "_blank", rel: "noopener noreferrer" } : {})}>{item.name}<span aria-hidden="true"> ↗</span></a></h3>
            <p>{item.description}</p>
            <ul className="p-tags" aria-label={`${item.name} technologies`}>
              {item.stack.map((tag) => <li key={tag}>{tag}</li>)}
            </ul>
            <div className="p-project-links">
              <a href={item.url} {...(item.url.startsWith("https:") ? { target: "_blank", rel: "noopener noreferrer" } : {})}>Visit {item.name}<span aria-hidden="true"> ↗</span></a>
              {item.repo && <a href={item.repo} target="_blank" rel="noopener noreferrer">Source</a>}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

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
            <Link href="/" className="p-brand"><span className="p-monogram" aria-hidden="true">AB</span><span>Anshuman Biswas<small>Engineering leadership. Still building.</small></span></Link>
            <div className="p-desktop-nav">{navigation.map(([label, id]) => <a key={id} href={`#${id}`}>{label}</a>)}</div>
            <details className="p-mobile-nav"><summary>Menu</summary><div>{navigation.map(([label, id]) => <a key={id} href={`#${id}`}>{label}</a>)}</div></details>
          </div>
        </nav>

        <section className="p-hero" id="main-content">
          <div className="p-wrap p-hero-grid">
            <div>
              <p className="p-eyebrow">VP of Engineering · PhD · Toronto</p>
              <h1>I lead engineering.<br /><em>I never stop building.</em></h1>
              <p className="p-lead">Hands-on leadership at the intersection of <strong>AI, cloud, and cybersecurity</strong>. I build enterprise B2B products, grow engineering leaders, and stay close to the architecture and code.</p>
              <p className="p-hero-note">Currently VP of Engineering at Elastio. Previously IBM Turbonomic, Veeva, and CTO/co-founder at Nearest.</p>
              <div className="p-actions">
                <button className="p-button p-primary" onClick={() => setShowPDF(true)}>View PDF resume</button>
                <Link className="p-button" href="/resume">Open HTML resume</Link>
                <a className="p-text-link" href="/AnshumanBiswas.pdf" download="Anshuman_Biswas_Resume.pdf">Download PDF ↓</a>
              </div>
              <div className="p-social"><a href={profile.github} target="_blank" rel="noopener noreferrer">GitHub ↗</a><a href={profile.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn ↗</a><a href={`mailto:${profile.email}`}>{profile.email}</a></div>
            </div>
            <aside className="p-leadership" aria-label="Leadership scope">
              <div className="p-profile-line"><Image src="/profile-cutout.png" alt="Anshuman Biswas" width={64} height={64} /><div><strong>Engineer. Leader. Builder.</strong><span>Toronto, Canada</span></div></div>
              <p className="p-eyebrow">Engineering organizations led</p>
              <dl>{profile.experience.slice(0, 3).map((job) => <div key={job.company}><dt>{job.company}</dt><dd>{job.scope?.replace(" engineers", "")}<span>engineers</span></dd></div>)}</dl>
              <p className="p-small">Approximate organization sizes across different roles, not direct-report counts.</p>
              <div className="p-leadership-note">Multiple teams.<br />Multiple engineering managers.<br /><strong>Hands-on by design.</strong></div>
            </aside>
          </div>
        </section>

        <section id="description" className="p-section p-wrap p-about" aria-labelledby="about-title">
          <div className="p-section-heading"><p className="p-eyebrow">About</p><h2 id="about-title">Technical depth.<br />Organizational scale.</h2></div>
          <div><p className="p-lead">{profile.about}</p><p>{profile.ai} My PhD research focused on machine learning for cloud middleware performance optimization.</p><p>I care about security, clear ownership, and useful software. That means coaching managers and setting direction, while still designing systems and building products myself.</p><div className="p-principles"><span>Enterprise B2B</span><span>AI-native development</span><span>Security & resilience</span><span>Startup execution</span></div></div>
        </section>

        <section id="work" className="p-section p-wrap" aria-labelledby="work-title">
          <div className="p-section-heading"><p className="p-eyebrow">Work</p><h2 id="work-title">Career journey</h2><p>Building enterprise software since 2007. Leading through managers without losing touch with the engineering.</p></div>
          <div className="p-career">{profile.experience.map((job, index) => <article key={job.company} className="p-job"><div className="p-job-meta"><span>{job.period}</span><h3>{job.company}</h3><p>{job.title}</p>{job.scope && <strong className="p-scope">{job.scope}</strong>}</div><div><p>{job.bullets[0]}</p>{index === 0 && <p className="p-patent"><strong>Patent-pending database security</strong><br />{job.bullets[1]}</p>}{(job.bullets.length > 1 || job.note) && <details><summary>Engineering highlights</summary><ul>{job.bullets.slice(index === 0 ? 2 : 1).map((bullet) => <li key={bullet}>{bullet}</li>)}</ul>{job.note && <p className="p-small">{job.note}</p>}</details>}</div></article>)}</div>
          <p className="p-small p-earlier">{profile.earlier}</p>
        </section>

        <ProjectSection id="products" title="Products I keep building" description="Hands-on work across enterprise security, AI-native applications, feature management, and developer infrastructure. FlagTGL serves multiple paying customers." items={portfolio.products} />
        <ProjectSection id="financial" title="Financial systems, built carefully" description="Personal engineering projects for investing and financial operations, with an emphasis on verification, visibility, and risk controls." items={portfolio.financial} />
        <ProjectSection id="lifestyle" title="Software for the rest of my life" description="Personal projects for fitness, habits, learning, and home maintenance. LifeAI is the latest addition to the personal-fitness side of my portfolio." items={portfolio.lifestyle} />
        <ProjectSection id="libraries" title="Libraries and tools I reuse" description="Small, reusable building blocks behind the products: model integration, authentication, publishing, backups, and operational tooling." items={portfolio.libraries} />

        <section id="writing" className="p-section p-wrap" aria-labelledby="writing-title">
          <div className="p-section-heading"><p className="p-eyebrow">Writing</p><h2 id="writing-title">Notes from the work</h2><p>Systems, AI workflows, cloud engineering, and lessons from building software.</p><Link className="p-text-link" href="/blog">View all posts ↗</Link></div>
          {loading ? <p role="status">Loading recent writing...</p> : posts.length ? <div className="p-project-grid">{posts.map((post) => <article className="p-project" key={post.link}><p className="p-eyebrow">{post.date} · {post.read_time}</p><h3><a href={post.link} target="_blank" rel="noopener noreferrer">{post.title} ↗</a></h3>{post.excerpt && <p>{post.excerpt}</p>}</article>)}</div> : <p>No blog posts available at the moment.</p>}
        </section>

        <section id="contact" className="p-contact" aria-labelledby="contact-title">
          <div className="p-wrap p-contact-grid"><div><p className="p-eyebrow">Contact</p><h2 id="contact-title">Let’s build<br />something useful.</h2><p>For conversations about engineering leadership, enterprise AI, security, cloud platforms, or a project here, send a note.</p><a className="p-email" href={`mailto:${profile.email}`}>{profile.email}</a><div className="p-contact-links"><a href={profile.github} target="_blank" rel="noopener noreferrer">github.com/anchoo2kewl</a><a href={profile.linkedin} target="_blank" rel="noopener noreferrer">linkedin.com/in/anshuman-biswas-phd</a></div></div>
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
        <footer className="p-wrap p-footer"><p>Anshuman Biswas · AI, cloud & cybersecurity</p><a href="#top">Back to top ↑</a></footer>
      </main>
      <PDFViewer isOpen={showPDF} onClose={() => setShowPDF(false)} pdfUrl="/AnshumanBiswas.pdf" />
    </>
  );
}
