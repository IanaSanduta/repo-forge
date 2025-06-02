'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { savePortfolioData, getUserData, getPortfolioData, Repository, ColorScheme } from '@/utils/supabase';

// Using interfaces from supabase.ts

export default function SuccessPage() {
  const [portfolioDetails, setPortfolioDetails] = useState<{name: string; description: string} | null>(null);
  const [deploymentUrl, setDeploymentUrl] = useState('https://your-portfolio.netlify.app');
  const [githubPagesUrl, setGithubPagesUrl] = useState('');
  const [user, setUser] = useState<{avatar_url?: string; name?: string; login: string} | null>(null);
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [colorScheme, setColorScheme] = useState<ColorScheme | null>(null);
  const [isDeploying, setIsDeploying] = useState(false);
  const [deploymentError, setDeploymentError] = useState('');
  const router = useRouter();

  useEffect(() => {
    // Get data from localStorage
    const storedDetails = localStorage.getItem('portfolioDetails');
    const userData = localStorage.getItem('githubUser');
    const reposData = localStorage.getItem('selectedRepositories');
    const colorData = localStorage.getItem('colorScheme');
    
    let parsedUser: {avatar_url?: string; name?: string; login: string} | null = null;
    let parsedPortfolioDetails: {name: string; description: string} | null = null;
    let parsedRepos: Repository[] = [];
    let parsedColorScheme: ColorScheme | null = null;
    
    if (storedDetails) {
      try {
        parsedPortfolioDetails = JSON.parse(storedDetails);
        setPortfolioDetails(parsedPortfolioDetails);
      } catch (e) {
        console.error('Failed to parse portfolio details:', e);
      }
    }
    
    if (userData) {
      try {
        parsedUser = JSON.parse(userData);
        setUser(parsedUser);
      } catch (e) {
        console.error('Failed to parse user data:', e);
      }
    }
    
    if (reposData) {
      try {
        parsedRepos = JSON.parse(reposData);
        setRepositories(parsedRepos);
      } catch (e) {
        console.error('Failed to parse repositories data:', e);
      }
    }
    
    if (colorData) {
      try {
        parsedColorScheme = JSON.parse(colorData);
        setColorScheme(parsedColorScheme);
      } catch (e) {
        console.error('Failed to parse color scheme data:', e);
      }
    }
    
    // Generate a random deployment URL for demo purposes
    const randomId = Math.random().toString(36).substring(2, 8);
    const generatedUrl = `https://${randomId}-portfolio.netlify.app`;
    setDeploymentUrl(generatedUrl);
    
    // Save portfolio data to Supabase if we have all the required data
    const saveToSupabase = async () => {
      if (parsedUser?.login && parsedPortfolioDetails && parsedRepos.length > 0 && parsedColorScheme) {
        try {
          // First check if user exists in Supabase
          const userData = await getUserData(parsedUser.login);
          
          if (userData) {
            // Check if portfolio already exists
            const existingPortfolio = await getPortfolioData(userData.id);
            
            // Save portfolio data to Supabase with deployment URL
            await savePortfolioData({
              user_id: userData.id,
              name: parsedPortfolioDetails.name,
              description: parsedPortfolioDetails.description,
              repositories: parsedRepos,
              color_scheme: parsedColorScheme,
              template_id: existingPortfolio?.template_id || 'default',
              deployment_url: generatedUrl, // Save the generated URL
              github_pages_url: existingPortfolio?.github_pages_url // Preserve GitHub Pages URL if it exists
            });
            
            // If there's an existing GitHub Pages URL, set it in the state
            if (existingPortfolio?.github_pages_url) {
              setGithubPagesUrl(existingPortfolio.github_pages_url);
            }
            
            console.log('Portfolio data saved to Supabase with deployment URL');
          }
        } catch (error) {
          console.error('Error saving portfolio data to Supabase:', error);
        }
      }
    };
    
    saveToSupabase();
  }, []);

  const handleCreateNew = () => {
    // Clear selected repos and color scheme from localStorage
    localStorage.removeItem('selectedRepositories');
    localStorage.removeItem('colorScheme');
    localStorage.removeItem('portfolioDetails');
    
    // Navigate back to repositories page
    router.push('/github/repositories');
  };

  // Function removed: handleBackToHome was unused
  
  const deployToGitHubPages = async () => {
    if (!user || !repositories || !colorScheme || !portfolioDetails) {
      setDeploymentError('Missing required data for deployment');
      return;
    }
    
    setIsDeploying(true);
    setDeploymentError('');
    
    try {
      // Get the GitHub token from localStorage
      const token = localStorage.getItem('githubToken');
      
      if (!token) {
        setDeploymentError('GitHub token not found. Please reconnect to GitHub.');
        setIsDeploying(false);
        return;
      }
      
      const response = await fetch('/api/github/deploy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          token,
          username: user.login,
          repositories,
          colorScheme,
          portfolioDetails,
          user
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to deploy to GitHub Pages');
      }
      
      setGithubPagesUrl(data.url);
      
      // Update portfolio data in Supabase with GitHub Pages URL
      try {
        const userData = await getUserData(user.login);
        
        if (userData) {
          // Get existing portfolio data to preserve other fields
          const existingPortfolio = await getPortfolioData(userData.id);
          
          // Update portfolio data with GitHub Pages URL
          await savePortfolioData({
            user_id: userData.id,
            name: portfolioDetails.name,
            description: portfolioDetails.description,
            repositories: repositories,
            color_scheme: colorScheme,
            template_id: existingPortfolio?.template_id || 'default',
            deployment_url: existingPortfolio?.deployment_url || deploymentUrl, // Preserve Netlify URL
            github_pages_url: data.url,
            last_deployed: new Date().toISOString() // Add timestamp for deployment
          });
          console.log('Portfolio data updated with GitHub Pages URL in Supabase');
        }
      } catch (dbError) {
        console.error('Error updating portfolio data in Supabase:', dbError);
        // Don't show this error to the user since the deployment was successful
      }
    } catch (error) {
      console.error('Error deploying to GitHub Pages:', error);
      setDeploymentError(error instanceof Error ? error.message : 'Unknown error occurred');
    } finally {
      setIsDeploying(false);
    }
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            <div className="p-6 rounded-lg bg-white dark:bg-gray-800 shadow-md">
              <div className="text-left">
                <div className="flex items-center mb-4">
                  <div className="p-2 rounded-md bg-blue-100 dark:bg-blue-900 mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600 dark:text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className="font-medium">Deployment URL</h3>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                  Your portfolio is now live at the following URL:
                </p>
                <div className="flex items-center bg-gray-100 dark:bg-gray-700 p-2 rounded">
                  <div className="flex-1 truncate">
                    <Link 
                      href={deploymentUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      {deploymentUrl}
                    </Link>
                  </div>
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
            <div className="p-6 rounded-lg bg-white dark:bg-gray-800 shadow-md">
              <div className="text-left">
                <div className="flex items-center mb-4">
                  <div className="p-2 rounded-md bg-green-100 dark:bg-green-900 mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600 dark:text-green-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="font-medium">GitHub Pages Deployment</h3>
                </div>
                
                {!githubPagesUrl && !isDeploying && (
                  <div className="mb-4">
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                      Deploy your portfolio to GitHub Pages for free hosting at <span className="font-mono">{user?.login || 'username'}.github.io/portfolio</span>
                    </p>
                    {deploymentError && (
                      <div className="text-red-500 text-sm mb-3">
                        Error: {deploymentError}
                      </div>
                    )}
                    <button
                      onClick={deployToGitHubPages}
                      className="w-full py-2 px-4 bg-black dark:bg-white dark:text-black text-white rounded-md hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors flex items-center justify-center"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                      </svg>
                      Deploy to GitHub Pages
                    </button>
                  </div>
                )}
                
                {isDeploying && (
                  <div className="flex flex-col items-center justify-center py-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-black dark:border-white mb-2"></div>
                    <p className="text-sm">Deploying to GitHub Pages...</p>
                  </div>
                )}
                
                {githubPagesUrl && (
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                      Your portfolio is now deployed to GitHub Pages:
                    </p>
                    <div className="flex items-center bg-gray-100 dark:bg-gray-700 p-2 rounded">
                      <div className="flex-1 truncate">
                        <Link 
                          href={githubPagesUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 dark:text-blue-400 hover:underline"
                        >
                          {githubPagesUrl}
                        </Link>
                      </div>
                      <button 
                        onClick={() => navigator.clipboard.writeText(githubPagesUrl)}
                        className="ml-2 p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                        title="Copy URL"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                        </svg>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
          <h2 className="text-xl font-semibold mb-4">What&apos;s Next?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
            <div className="p-4 rounded-md bg-gray-50 dark:bg-gray-700">
              <div className="flex items-center mb-2">
                <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mr-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </div>
                <h3 className="font-medium">Customize Code</h3>
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
