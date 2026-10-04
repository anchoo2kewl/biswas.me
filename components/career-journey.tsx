"use client";

import { useEffect, useRef, useState } from "react";
import { career } from "@/lib/career";
import { PortfolioDialog } from "@/components/portfolio-dialog";

export function CareerJourney() {
  const [selected, setSelected] = useState<number | null>(null);
  const [active, setActive] = useState(career[0].id);
  const listRef = useRef<HTMLOListElement>(null);
  const chapter = selected === null ? null : career[selected];

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const rows = Array.from(list.querySelectorAll<HTMLElement>(".t-row"));
    let frame = 0;
    const measure = () => {
      frame = 0;
      const rect = list.getBoundingClientRect();
      const middle = window.innerHeight * 0.52;
      const progress = Math.max(0, Math.min(1, (middle - rect.top) / Math.max(rect.height, 1)));
      list.style.setProperty("--journey-progress", String(progress));
      let distance = Infinity;
      let closest = career[0].id;
      for (const row of rows) {
        const r = row.getBoundingClientRect();
        const nextDistance = Math.abs(r.top + r.height / 2 - middle);
        if (nextDistance < distance) { distance = nextDistance; closest = row.dataset.chapter || closest; }
      }
      setActive(closest);
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(measure); };
    const observer: IntersectionObserver | null = typeof IntersectionObserver !== "undefined" ? new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) { entry.target.classList.add("t-arrived"); observer?.unobserve(entry.target); }
      });
    }, { threshold: 0.12 }) : null;
    rows.forEach((row) => observer?.observe(row));
    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => { cancelAnimationFrame(frame); observer?.disconnect(); window.removeEventListener("scroll", schedule); window.removeEventListener("resize", schedule); };
  }, []);

  return (
    <div className="p-journey">
      <div className="t-toolbar"><p><span aria-hidden="true">↳</span> Every chapter shaped the next.</p><nav aria-label="Career milestones">{career.map((item) => <a key={item.id} href={`#chapter-${item.id}`} aria-current={active === item.id ? "step" : undefined} title={item.company}>{item.year}</a>)}</nav></div>
      <ol className="t-list" ref={listRef}>
        {career.map((item, index) => <li key={item.id} id={`chapter-${item.id}`} data-chapter={item.id} className={`t-row${index % 2 ? " t-left" : " t-right"}${active === item.id ? " t-active" : ""}`}>
          <span className="t-dot" aria-hidden="true"><span /></span>
          <div className="t-year" aria-hidden="true"><span>{item.year}</span><small>{item.chapter}</small></div>
          <article className="t-card">
            <div className="t-card-top"><p className="p-eyebrow">{item.chapter}</p>{item.current && <span className="t-now"><i aria-hidden="true" />Now</span>}</div>
            <p className="t-period">{item.period}</p>
            <h3>{item.company}</h3><p className="t-role">{item.title}</p>
            <p className="t-description">{item.description}</p>
            <ul className="t-tags" aria-label={`${item.company} focus`}>{item.tags.map((tag) => <li key={tag}>{tag}</li>)}</ul>
            <button className="t-open" type="button" onClick={() => setSelected(index)} aria-label={`Explore ${item.company}`} aria-haspopup="dialog"><span>Explore this chapter</span><span className="t-arrow" aria-hidden="true">↗</span></button>
          </article>
        </li>)}
      </ol>
      <div className="t-end"><span aria-hidden="true">✳</span><p>The thread through it all?<br /><strong>Stay curious. Keep building.</strong></p><a href="#products">See what I’m building now <span aria-hidden="true">↓</span></a></div>
      <PortfolioDialog open={chapter !== null} onClose={() => setSelected(null)} title={chapter?.company || ""} eyebrow={chapter ? `${chapter.year} / ${chapter.chapter}` : undefined}>
        {chapter && <>
          <p className="t-detail-role">{chapter.title}<span>{chapter.period}</span></p>
          {/* Existing portfolio artwork, not newly invented company imagery. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={chapter.image} alt={`${chapter.company} work illustration`} className="t-detail-image" />
          <p className="p-dialog-lead">{chapter.description}</p>
          <h3 className="p-detail-label">Inside the work</h3><ul className="p-detail-highlights">{chapter.highlights.map((text) => <li key={text}>{text}</li>)}</ul>
          {chapter.note && <p className="t-progression">{chapter.note}</p>}
          {chapter.link && <a className="p-text-link" href={chapter.link} target="_blank" rel="noopener noreferrer">Visit {chapter.company} ↗</a>}
          <div className="t-dialog-nav" aria-label="Explore adjacent career chapters"><button type="button" className="p-button" disabled={selected === 0} onClick={() => setSelected((value) => Math.max(0, (value ?? 0) - 1))}>← Newer chapter</button><button type="button" className="p-button" disabled={selected === career.length - 1} onClick={() => setSelected((value) => Math.min(career.length - 1, (value ?? 0) + 1))}>Earlier chapter →</button></div>
        </>}
      </PortfolioDialog>
    </div>
  );
}
