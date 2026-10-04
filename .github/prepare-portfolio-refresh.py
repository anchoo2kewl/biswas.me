#!/usr/bin/env python3
"""Temporary, branch-scoped preparation; removed before the production merge."""
from pathlib import Path
import json
import re
import subprocess

root = Path.cwd()
p = root / 'app/page.tsx'
text = p.read_text()
if 'import { BuilderPortrait }' not in text:
    text = text.replace('import Image from "next/image";\n', '')
    text = text.replace('import "./portfolio.css";', 'import { BuilderPortrait } from "@/components/builder-portrait";\nimport { CareerJourney } from "@/components/career-journey";\nimport { ProjectGallery as ProjectSection } from "@/components/project-gallery";\nimport "./portfolio.css";')
    text = text[:text.index('type Project = {')] + text[text.index('const navigation = ['):]
    text = text[:text.index('function ProjectSection(')] + text[text.index('export default function Home()'):]
    text, count = re.subn(r'<aside className="p-leadership".*?</aside>', '<BuilderPortrait />', text, flags=re.S)
    assert count == 1, 'Unexpected hero structure; refusing a blind replacement'
    text, count = re.subn(r'<div className="p-career">.*?<p className="p-small p-earlier">\{profile\.earlier\}</p>', '<CareerJourney />', text, flags=re.S)
    assert count == 1, 'Unexpected career structure'
    text = text.replace('Technical depth.<br />Organizational scale.', 'Technical depth.<br />A builder’s mindset.')
    text = text.replace('<a key={id} href={`#${id}`}>{label}</a>', '<a key={id} href={`#${id}`} onClick={(event) => event.currentTarget.closest("details")?.removeAttribute("open")}>{label}</a>')
    p.write_text(text)
assert 'p-leadership' not in text and '<CareerJourney />' in text

# Reuse the original authored illustrations instead of replacing them with flat cards.
original = subprocess.check_output(['git', 'show', 'f7d95213d7b4e98e811fbf5221d2221cda2cad55:app/page.tsx'], text=True)
source = original[:original.index('const motivationPoints')]
pattern = r'id:\s*"([^"]+)",\s*name:\s*"([^"]+)",\s*label:\s*"([^"]+)",\s*domain:\s*"([^"]+)".*?palette:\s*\{(.*?)\n    \}'
catalog = {}
for match in re.finditer(pattern, source, re.S):
    ident, name, label, domain, colors = match.groups()
    palette = dict(re.findall(r'(base|accent|glow|stroke):\s*"([^"]+)"', colors))
    assert len(palette) == 4
    catalog[name] = dict(id='me' if ident == 'me-framework' else ident, name=name, label=label, domain=domain, palette=palette)
assert len(catalog) >= 20, f'Only {len(catalog)} original illustrations recovered'
art = original[original.index('function ProjectArtwork('):original.index('function ShowcaseModal(')]
art = art.replace('function ProjectArtwork(', 'export function ProjectArtwork(', 1).replace('item: ShowcaseItem', 'item: ArtworkItem')
art = art.replace('const gradientId = `gradient-${item.id}`;', 'const gradientId = `art-${useId().replace(/:/g, "")}`;')
art = art.replace('aria-label={`${item.name} preview`}', 'aria-label={`${item.name} interface illustration`}')
# Names, links, and domains are legible HTML outside the illustration, not overlapping SVG text.
start = art.index('      <rect x="58" y="284" width="524" height="24"')
end = art.rindex('    </svg>')
art = art[:start] + art[end:]
header = '''"use client";

import { useId } from "react";

// Original portfolio artwork restored from f7d9521. Reused, not generated product screenshots.
export type ArtworkItem = { id: string; name: string; label: string; domain: string; palette: { base: string; accent: string; glow: string; stroke: string } };
'''
helper = '''
export function getArtwork(name: string, url: string, category: string): ArtworkItem {
  return artworkCatalog[name] || { id: name.toLowerCase().replace(/[^a-z0-9]+/g, "-"), name, domain: url.replace(/^https?:\\/\\//, ""), label: category, palette: { base: "#0c2824", accent: "#8db897", glow: "#2d5946", stroke: "#c8dbc0" } };
}
'''
(root / 'components/project-artwork.tsx').write_text(header + '\nconst artworkCatalog: Record<string, ArtworkItem> = ' + json.dumps(catalog, ensure_ascii=False, indent=2) + ';\n' + helper + '\n' + art)

path = root / 'lib/profile.json'
profile = json.loads(path.read_text())
profile['skills'][0]['text'] = 'Building teams from scratch, hiring, manager development, multi-team leadership, strategy, roadmaps, delivery'
profile['experience'][0]['bullets'][0] = 'Lead ~40 engineers through multiple engineering managers; hire and develop teams building cloud-native ransomware detection and data protection.'
profile['experience'][0]['bullets'][2] = 'Architect malware-scanning engines and AI-powered anomaly detection across enterprise backup and recovery workflows.'
profile['experience'][1]['bullets'] = [
    'Built a ~15-engineer organization from scratch, hiring and developing engineers and managers.',
    'Owned the full product lifecycle and delivery of contact-center capabilities in Veeva CRM for global enterprise deployments.'
]
path.write_text(json.dumps(profile, ensure_ascii=False, indent=2) + '\n')

path = root / 'components/career-journey.tsx'
path.write_text(path.read_text().replace('const observer = typeof IntersectionObserver', 'const observer: IntersectionObserver | null = typeof IntersectionObserver'))

path = root / '__tests__/app/page.test.tsx'
tests = path.read_text()
start_marker = '  it("shows approximate organization sizes, management scope, and patent work"'
if start_marker in tests:
    start = tests.index(start_marker)
    end = tests.index('  it("keeps the product, financial', start)
    tests = tests[:start] + '''  it("restores the builder portrait and interactive career without team-size advertising", async () => {
    const { container } = await renderHome();
    expect(screen.getByRole("complementary", { name: "Now shipping" })).toBeInTheDocument();
    expect(container.querySelector(".p-leadership")).not.toBeInTheDocument();
    expect(container.textContent).not.toMatch(/~(?:40|15|70)/);
    expect(screen.getByText("Patent-pending database security")).toBeInTheDocument();
    expect(screen.getByText(/Built the engineering team from scratch/)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Explore Veeva Systems" })).toBeInTheDocument();
    expect(container.querySelectorAll(".t-card")).toHaveLength(7);
  });
''' + tests[end:]
path.write_text(tests)
subprocess.run(['python3', 'scripts/generate-resume.py'], check=True)
print('Prepared homepage, original illustrations, Veeva/Elastio hiring content, and matching resume artifacts.')
