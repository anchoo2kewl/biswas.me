"use client";

import { useState } from "react";
import Image from "next/image";

const principles = [
  { title: "Speed", text: "Small systems. Fast feedback. Useful software, shipped.", number: "01" },
  { title: "Clarity", text: "Clear ownership, thoughtful interfaces, and teams that know why.", number: "02" },
  { title: "Security", text: "Resilience and security belong in the architecture, not the afterthoughts.", number: "03" },
  { title: "AI first", text: "AI-native workflows, grounded in engineering judgment and guardrails.", number: "04" },
];

export function BuilderPortrait() {
  const [active, setActive] = useState(0);
  return (
    <aside className="p-builder" aria-label="Now shipping">
      <div className="p-builder-top"><span><i aria-hidden="true" />Now shipping</span><span>Toronto / Remote</span></div>
      <div className="p-builder-intro">
        <div className="p-portrait"><div className="p-portrait-halo" aria-hidden="true" /><Image src="/anshuman-biswas-portrait.jpg" alt="Anshuman Biswas" width={600} height={600} priority sizes="(max-width: 700px) 145px, 200px" /><span className="p-portrait-caption" aria-hidden="true">Anshuman Biswas</span></div>
        <div><p className="p-eyebrow">Engineering leader</p><h2>Engineering leadership.<br /><em>Close to the code.</em></h2><p>I lead teams building data-security products at Elastio, and build tools for developers, AI agents, and learning.</p></div>
      </div>
      <div className="p-shipping-links" aria-label="Current work">
        {[["Elastio", "https://elastio.com"], ["AI Agent Lens", "https://aiagentlens.com"], ["TaskAI", "https://taskai.cc"], ["FlagTGL", "https://flagtgl.com"]].map(([name, href]) => <a href={href} key={name} target="_blank" rel="noopener noreferrer">{name}<span aria-hidden="true">↗</span></a>)}
      </div>
      <div className="p-design-bias"><p className="p-eyebrow">How I like to build</p><div className="p-principle-buttons" aria-label="Design principles">{principles.map((p, index) => <button type="button" aria-pressed={active === index} key={p.title} onClick={() => setActive(index)}>{p.title}</button>)}</div><div className="p-principle-copy" aria-live="polite"><span aria-hidden="true">{principles[active].number}</span><p key={active}>{principles[active].text}</p></div></div>
    </aside>
  );
}
