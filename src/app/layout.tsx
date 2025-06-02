import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Image from "next/image";
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
  title: "RepoForge",
  description: "Create and manage GitHub repositories with ease",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <nav className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center">
            <Image 
              src="/assets/blackLogo.svg" 
              alt="RepoForge Logo" 
              width={40} 
              height={40} 
              className="dark:hidden"
            />
            <Image 
              src="/assets/whiteLogo.svg" 
              alt="RepoForge Logo" 
              width={40} 
              height={40} 
              className="hidden dark:block"
            />
            <span className="ml-3 text-xl font-semibold">RepoForge</span>
          </div>
        </nav>
        {children}
      </body>
    </html>
  );
}
