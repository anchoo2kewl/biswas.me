import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Writing & Insights | Anshuman Biswas",
  description:
    "Essays on enterprise software, cloud systems, AI, security, and practical engineering execution.",
  alternates: {
    canonical: "/blog",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-video-preview": -1,
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    url: "https://biswas.me/blog",
    title: "Writing & Insights | Anshuman Biswas",
    description:
      "Essays on enterprise software, cloud systems, AI, security, and practical engineering execution.",
    siteName: "biswas.me",
    images: [
      {
        url: "/anshuman-biswas-autumn-portrait.jpg",
        width: 1536,
        height: 1024,
        alt: "Anshuman Biswas",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Writing & Insights | Anshuman Biswas",
    description:
      "Essays on enterprise software, cloud systems, AI, security, and practical engineering execution.",
    images: ["/anshuman-biswas-autumn-portrait.jpg"],
  },
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return children;
}

