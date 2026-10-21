import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Photos of Anshuman Biswas",
  description: "Current and earlier portraits of Anshuman Biswas, engineer and creator of biswas.me and anshumanbiswas.com.",
  alternates: { canonical: "/photos" },
};

const photos = [["/anshuman-biswas-autumn-portrait.jpg", "Anshuman Biswas on an autumn woodland path"], ["/me_new.jpg", "Anshuman Biswas — earlier portrait"], ["/profile-cutout.png", "Anshuman Biswas — earlier profile photo"], ["/me.jpg", "Anshuman Biswas — illustrated portrait"]];

export default function PhotosPage() {
  return <main className="mx-auto max-w-5xl px-6 py-16">
    <Link href="/" className="underline">Back to Anshuman Biswas’s website</Link>
    <h1 className="mt-8 text-4xl font-semibold">Photos of Anshuman Biswas</h1>
    <p className="mt-4">My current portrait and earlier profile pictures from this website and my blog.</p>
    <div className="mt-10 grid gap-8 sm:grid-cols-2">
      {photos.map(([src, caption]) => <figure key={src}>
        <a href={src}><img src={src} alt={caption} width={800} height={800} className="aspect-square w-full rounded-xl object-cover" /></a>
        <figcaption className="mt-3">{caption}</figcaption>
      </figure>)}
    </div>
    <p className="mt-10"><a href="https://anshumanbiswas.com/about" className="underline">About Anshuman Biswas’s blog</a></p>
  </main>;
}
