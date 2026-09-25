import type { Metadata } from "next";
import { Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Karanvir Singh | MERN Stack Developer",
  description:
    "MERN Stack Developer with 4+ years of experience building scalable web applications using React, Next.js, Node.js, TypeScript and MongoDB.",
  keywords: [
    "Karanvir Singh",
    "MERN Stack Developer",
    "Full-Stack Engineer",
    "React",
    "Next.js",
    "Node.js",
    "TypeScript",
    "MongoDB",
  ],
  authors: [{ name: "Karanvir Singh" }],
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/icon", type: "image/png" },
    ],
    apple: [{ url: "/apple-icon", type: "image/png" }],
  },
  openGraph: {
    title: "Karanvir Singh | MERN Stack Developer",
    description:
      "MERN Stack Developer with 4+ years of experience building scalable web applications using React, Next.js, Node.js, TypeScript and MongoDB.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Karanvir Singh | MERN Stack Developer",
    description:
      "MERN Stack Developer with 4+ years of experience building scalable web applications using React, Next.js, Node.js, TypeScript and MongoDB.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Karanvir Singh",
  jobTitle: "Full-Stack Engineer",
  description:
    "MERN Stack Developer with 4+ years of experience building scalable web applications using React, Next.js, Node.js, TypeScript and MongoDB.",
  email: "karanvir011998@gmail.com",
  telephone: "+918437333427",
  knowsAbout: [
    "React",
    "Next.js",
    "Node.js",
    "TypeScript",
    "MongoDB",
    "Express",
    "Full-Stack Development",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${jetbrainsMono.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="antialiased font-sans bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
