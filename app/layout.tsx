import type React from "react"
import type { Metadata } from "next"
import { Fraunces, Manrope } from "next/font/google"
import "../styles/globals.css"
import { ThemeProvider } from "@/components/theme-provider"

const manrope = Manrope({ subsets: ["latin"], variable: "--font-sans" })
const fraunces = Fraunces({ subsets: ["latin"], variable: "--font-display" })
const title = "Anshuman Biswas | Hands-on Engineering Leadership in AI, Cloud & Security"
const description = "VP of Engineering, PhD, and former CTO/co-founder in Toronto. Leading engineering managers and multi-team organizations while building enterprise AI, cloud, and cybersecurity products."

export const metadata: Metadata = {
  metadataBase: new URL("https://biswas.me"),
  title,
  description,
  alternates: { canonical: "/" },
  robots: {
    index: true, follow: true, nocache: false,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-video-preview": -1, "max-snippet": -1 },
  },
  openGraph: {
    type: "website", url: "https://biswas.me", title, description, siteName: "biswas.me",
    images: [{ url: "/profile-cutout.png", width: 500, height: 500, alt: "Anshuman Biswas" }],
  },
  twitter: { card: "summary_large_image", title, description, images: ["/profile-cutout.png"] },
  icons: { icon: [{ url: "/favicon.svg", type: "image/svg+xml" }, { url: "/logo.svg", sizes: "64x64", type: "image/svg+xml" }] },
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${manrope.variable} ${fraunces.variable} font-sans`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
