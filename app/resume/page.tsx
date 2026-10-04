import type { Metadata } from "next";
import { readFileSync } from "node:fs";
import { join } from "node:path";

export const metadata: Metadata = {
  title: "Anshuman Biswas | Engineering Leadership Resume",
  description: "Hands-on VP of Engineering and former CTO/co-founder. AI, cloud, cybersecurity, multi-team leadership, and patent-pending database security.",
  alternates: { canonical: "/resume" },
};

// Both this page and the standalone HTML use the generated, escaped document.
// Regenerate the HTML and PDF together after editing lib/profile.json.
export default function Resume() {
  const html = readFileSync(join(process.cwd(), "public", "resume.html"), "utf8");
  const css = html.match(/<style>([\s\S]*?)<\/style>/)?.[1];
  const body = html.match(/<body[^>]*>([\s\S]*?)<\/body>/)?.[1];
  if (!css || !body) throw new Error("Invalid generated resume. Run node scripts/generate-resume.js.");
  return <div dangerouslySetInnerHTML={{ __html: `<style>${css}</style>${body}` }} />;
}
