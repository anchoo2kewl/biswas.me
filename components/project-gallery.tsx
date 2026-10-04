"use client";

import { useState } from "react";
import { PortfolioDialog } from "@/components/portfolio-dialog";
import { ProjectArtwork, getArtwork } from "@/components/project-artwork";

type Project = { name: string; url: string; category: string; description: string; stack: string[]; repo?: string; featured?: boolean };
const external = (url: string) => url.startsWith("https:") ? { target: "_blank", rel: "noopener noreferrer" } : {};

export function ProjectGallery({ id, title, description, items }: {
  id: string; title: string; description: string; items: Project[];
}) {
  const [selected, setSelected] = useState<Project | null>(null);
  return (
    <section id={id} className={`p-section p-wrap p-gallery p-gallery-${id}`} aria-labelledby={`${id}-title`}>
      <div className="p-section-heading"><p className="p-eyebrow">{id === "products" ? "The builder’s workshop" : id}</p><h2 id={`${id}-title`}>{title}</h2><p>{description}</p></div>
      <div className="p-project-grid">{items.map((item) => <article key={item.name} className={`p-project${item.featured ? " p-featured" : ""}`}>
        <button className="p-project-art" type="button" onClick={() => setSelected(item)} aria-label={`Preview ${item.name}`} aria-haspopup="dialog"><ProjectArtwork item={getArtwork(item.name, item.url, item.category)} /><span className="p-art-action" aria-hidden="true">Explore project ↗</span></button>
        <div className="p-project-content"><p className="p-eyebrow">{item.category}</p><h3><a href={item.url} {...external(item.url)}>{item.name}<span aria-hidden="true"> ↗</span></a></h3><p>{item.description}</p><ul className="p-tags" aria-label={`${item.name} technologies`}>{item.stack.map((tag) => <li key={tag}>{tag}</li>)}</ul><div className="p-project-links"><a href={item.url} {...external(item.url)}>Visit {item.name}<span aria-hidden="true"> ↗</span></a>{item.repo ? <a href={item.repo} target="_blank" rel="noopener noreferrer">Source</a> : <button type="button" onClick={() => setSelected(item)} aria-haspopup="dialog">Details</button>}</div></div>
      </article>)}</div>
      <PortfolioDialog open={selected !== null} onClose={() => setSelected(null)} title={selected?.name || ""} eyebrow={selected?.category}>
        {selected && <><div className="p-project-modal-art"><ProjectArtwork item={getArtwork(selected.name, selected.url, selected.category)} /></div><p className="p-dialog-lead">{selected.description}</p><ul className="p-tags">{selected.stack.map((tag) => <li key={tag}>{tag}</li>)}</ul><div className="p-actions"><a className="p-button p-primary" href={selected.url} {...external(selected.url)}>Visit {selected.name} ↗</a>{selected.repo && <a className="p-button" href={selected.repo} target="_blank" rel="noopener noreferrer">Explore source ↗</a>}</div></>}
      </PortfolioDialog>
    </section>
  );
}
