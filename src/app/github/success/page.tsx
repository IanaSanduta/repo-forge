'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

export default function SuccessPage() {
  const [portfolioDetails, setPortfolioDetails] = useState<{name: string; description: string} | null>(null);
  const [deploymentUrl, setDeploymentUrl] = useState('https://your-portfolio.netlify.app');
  const [user, setUser] = useState<{avatar_url?: string; name?: string; login?: string} | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Get portfolio details from localStorage
    const storedDetails = localStorage.getItem('portfolioDetails');
    const userData = localStorage.getItem('githubUser');
    
    if (storedDetails) {
      try {
        setPortfolioDetails(JSON.parse(storedDetails));
      } catch (e) {
        console.error('Failed to parse portfolio details:', e);
      }
    }
    
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (e) {
        console.error('Failed to parse user data:', e);
      }
    }
    
    // Generate a random deployment URL for demo purposes
    const randomId = Math.random().toString(36).substring(2, 8);
    setDeploymentUrl(`https://${randomId}-portfolio.netlify.app`);
  }, []);

  const handleCreateNew = () => {
    // Clear selected repos and color scheme
    localStorage.removeItem('selectedRepos');
    localStorage.removeItem('colorScheme');
    localStorage.removeItem('portfolioDetails');
    
    // Navigate back to repositories page
    router.push('/github/repositories');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-16 text-center">
      <div className="mb-8">
        {user && user.avatar_url && (
          <div className="mb-4 flex justify-center">
            <Image 
              src={user.avatar_url} 
              alt="User avatar"
              width={64}
              height={64}
              className="rounded-full border-4 border-green-100 dark:border-green-900"
            />
          </div>
        )}
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 dark:bg-green-900 mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600 dark:text-green-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold mb-2">Portfolio Successfully Generated!</h1>
        <p className="text-gray-600 dark:text-gray-300 text-lg">
          Your portfolio website has been created and deployed.
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 mb-8">
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Deployment Details</h2>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-4">
            <div className="flex-1 w-full sm:w-auto">
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md text-left">
                <p className="mt-4 text-gray-600 dark:text-gray-300">{portfolioDetails?.description}</p>
                <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Portfolio URL</div>
                <div className="flex items-center">
                  <Link 
                    href={deploymentUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 dark:text-blue-400 hover:underline truncate"
                  >
                    {deploymentUrl}
                  </Link>
                  <button 
                    onClick={() => navigator.clipboard.writeText(deploymentUrl)}
                    className="ml-2 p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                    title="Copy URL"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
            <div>
              <Link 
                href={deploymentUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-6 py-3 bg-black dark:bg-white dark:text-black text-white rounded-md hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
              >
                <span>Visit Your Portfolio</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
          <h2 className="text-xl font-semibold mb-4">What's Next?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
            <div className="p-4 rounded-md bg-gray-50 dark:bg-gray-700">
              <div className="flex items-center mb-2">
                <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mr-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-3">Do you offer discounts for students?</h3>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Download the source code to make additional customizations to your portfolio.
              </p>
            </div>
            <div className="p-4 rounded-md bg-gray-50 dark:bg-gray-700">
              <div className="flex items-center mb-2">
                <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center mr-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="font-medium">Add Content</h3>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Add more projects, skills, and personal information to make your portfolio stand out.
              </p>
            </div>
            <div className="p-4 rounded-md bg-gray-50 dark:bg-gray-700">
              <div className="flex items-center mb-2">
                <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mr-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                </div>
                <h3 className="font-medium">Share</h3>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Share your portfolio with potential employers, clients, and your network.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-center gap-4">
        <button
          onClick={handleCreateNew}
          className="px-6 py-3 border border-gray-300 dark:border-gray-700 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          Create Another Portfolio
        </button>
        <Link
          href="/"
          className="px-6 py-3 bg-black dark:bg-white dark:text-black text-white rounded-md hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
        >
          Back to Home
        </Link>
      </div>
      <p className="text-gray-600 dark:text-gray-300">
        &copy; {new Date().getFullYear()} {portfolioDetails?.name} &bull; Created with RepoForge
      </p>
    </div>
  );
}
