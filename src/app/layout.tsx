import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import packageJson from "../../package.json";
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
  title: "Friends of Recovery",
  description: "Supporting long-term recovery through community. Structure, accountability, and lasting support for individuals rebuilding their lives after treatment.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <main className="flex-1">{children}</main>
        <footer className="text-center text-xs text-neutral-400 py-4">
          Copyright 2026 Jeremy and Deven &mdash; Proof of Concept Only &mdash; ver.{packageJson.version}
        </footer>
      </body>
    </html>
  );
}
