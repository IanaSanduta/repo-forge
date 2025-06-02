import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
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
          <Link href="/" className="flex items-center hover:opacity-80 transition-opacity">
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
          </Link>
          
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors">Home</Link>
            <Link href="/templates" className="text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors">Templates</Link>
            <Link href="/pricing" className="text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors">Pricing</Link>
            <Link 
              href="/github/connect" 
              className="px-4 py-2 bg-black dark:bg-white dark:text-black text-white rounded-md hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
            >
              Get Started
            </Link>
          </div>
          
          <div className="md:hidden">
            <button className="text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </nav>
        {children}
      </body>
    </html>
  );
}
