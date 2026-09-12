import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  applicationName: "ActiveAid",
  title: {
    default: "ActiveAid | Wellness while you work",
    template: "%s | ActiveAid",
  },
  description:
    "Gentle movement reminders, desk-friendly relief sessions, and daily check-ins for modern desk workers. Local-first and private by default.",
  icons: {
    icon: [{ url: "/activeaid-mark.svg", type: "image/svg+xml" }],
  },
  openGraph: {
    type: "website",
    siteName: "ActiveAid",
    title: "ActiveAid | Wellness while you work",
    description:
      "Gentle movement reminders, desk-friendly relief sessions, and daily check-ins for modern desk workers.",
  },
  twitter: {
    card: "summary",
    title: "ActiveAid | Wellness while you work",
    description:
      "Gentle movement reminders, desk-friendly relief sessions, and daily check-ins for modern desk workers.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
