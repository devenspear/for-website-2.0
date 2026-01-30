import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
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
  title: "Character Insights",
  description: "A tool for self-reflection based on 12 character themes to support personal growth.",
};

// Check if Clerk keys are properly configured
const hasValidClerkKey = () => {
  const key = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  return key && (key.startsWith('pk_live_') || key.startsWith('pk_test_')) && key.length > 20;
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const content = (
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

  // Only wrap with ClerkProvider if keys are valid
  if (hasValidClerkKey()) {
    return <ClerkProvider>{content}</ClerkProvider>;
  }

  return content;
}
