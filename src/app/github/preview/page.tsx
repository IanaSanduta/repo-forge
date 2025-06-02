'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { getUserData, savePortfolioData, getPortfolioData } from '@/utils/supabase';

interface Repository {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  private: boolean;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  updated_at: string;
}

interface GithubUser {
  login: string;
  name?: string;
  avatar_url?: string;
  html_url?: string;
  bio?: string;
  email?: string;
}

interface ColorScheme {
  id: string;
  name: string;
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
  darkMode: boolean;
}

export default function PreviewPage() {
  const [selectedRepos, setSelectedRepos] = useState<Repository[]>([]);
  const [colorScheme, setColorScheme] = useState<ColorScheme | null>(null);
  const [portfolioName, setPortfolioName] = useState('My Developer Portfolio');
  const [portfolioDescription, setPortfolioDescription] = useState('A showcase of my projects and skills');
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<GithubUser | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Get selected repositories from localStorage
    const storedRepos = localStorage.getItem('selectedRepositories');
    const storedColorScheme = localStorage.getItem('colorScheme');
    const userData = localStorage.getItem('githubUser');
    
    if (!storedRepos || !storedColorScheme) {
      router.push('/github/repositories');
      return;
    }

    try {
      setSelectedRepos(JSON.parse(storedRepos));
      setColorScheme(JSON.parse(storedColorScheme));
      
      if (userData) {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        
        // Set default portfolio name based on user's GitHub name
        if (parsedUser.name) {
          setPortfolioName(`${parsedUser.name}'s Portfolio`);
        } else if (parsedUser.login) {
          setPortfolioName(`${parsedUser.login}'s Portfolio`);
        }
        
        // Try to load portfolio details from Supabase
        const loadFromSupabase = async () => {
          try {
            const userDbData = await getUserData(parsedUser.login);
            if (userDbData) {
              const portfolioData = await getPortfolioData(userDbData.id);
              if (portfolioData) {
                // Update portfolio name and description from Supabase if available
                setPortfolioName(portfolioData.name);
                setPortfolioDescription(portfolioData.description);
              }
            }
          } catch (error) {
            console.error('Error loading portfolio data from Supabase:', error);
          }
        };
        
        loadFromSupabase();
      }
    } catch (e) {
      console.error('Failed to parse stored data:', e);
      router.push('/github/repositories');
    }
  }, [router]);

  const handleGenerate = async () => {
    setLoading(true);
    
    // Store portfolio details in localStorage
    localStorage.setItem('portfolioDetails', JSON.stringify({
      name: portfolioName,
      description: portfolioDescription
    }));
    
    // Also store in Supabase if user exists
    if (user?.login) {
      try {
        const userDbData = await getUserData(user.login);
        if (userDbData) {
          // Get existing portfolio data
          const existingPortfolio = await getPortfolioData(userDbData.id);
          
          // Get repositories and color scheme from localStorage
          const storedRepos = localStorage.getItem('selectedRepositories');
          const storedColorScheme = localStorage.getItem('colorScheme');
          
          let repositories = [];
          let colorScheme = null;
          
          try {
            if (storedRepos) repositories = JSON.parse(storedRepos);
            if (storedColorScheme) colorScheme = JSON.parse(storedColorScheme);
          } catch (e) {
            console.error('Failed to parse stored data:', e);
          }
          
          // Save updated portfolio data
          await savePortfolioData({
            user_id: userDbData.id,
            name: portfolioName,
            description: portfolioDescription,
            repositories: repositories.length > 0 ? repositories : (existingPortfolio?.repositories || []),
            color_scheme: colorScheme || existingPortfolio?.color_scheme,
            template_id: existingPortfolio?.template_id || 'default',
            deployment_url: existingPortfolio?.deployment_url,
            github_pages_url: existingPortfolio?.github_pages_url
          });
          
          console.log('Portfolio details saved to Supabase');
        }
      } catch (error) {
        console.error('Error saving portfolio details to Supabase:', error);
        // Continue anyway since we have the data in localStorage
      }
    }
    
    // Simulate generation process
    setTimeout(() => {
      setLoading(false);
      router.push('/github/success');
    }, 3000);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (!colorScheme) {
    return <div className="flex justify-center items-center min-h-[calc(100vh-73px)]">Loading...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-2">Preview Your Portfolio</h1>
      <p className="text-gray-600 dark:text-gray-300 mb-8">
        Customize your portfolio details and preview how it will look.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1 order-2 md:order-1">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 sticky top-6">
            <h2 className="text-xl font-semibold mb-4">Portfolio Details</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Portfolio Name
                </label>
                <input
                  type="text"
                  value={portfolioName}
                  onChange={(e) => setPortfolioName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700"
                  placeholder="My Developer Portfolio"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Portfolio Description
                </label>
                <textarea
                  value={portfolioDescription}
                  onChange={(e) => setPortfolioDescription(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 h-24"
                  placeholder="A showcase of my projects and skills"
                />
              </div>
              
              <div>
                <h3 className="font-medium text-sm text-gray-700 dark:text-gray-300 mb-2">Selected Color Scheme</h3>
                <div className="flex space-x-2 mb-2">
                  <div className="w-6 h-6 rounded-full" style={{ backgroundColor: colorScheme.primary }}></div>
                  <div className="w-6 h-6 rounded-full" style={{ backgroundColor: colorScheme.secondary }}></div>
                  <div className="w-6 h-6 rounded-full" style={{ backgroundColor: colorScheme.accent }}></div>
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {colorScheme.name}
                </div>
              </div>
              
              <div>
                <h3 className="font-medium text-sm text-gray-700 dark:text-gray-300 mb-2">Selected Repositories</h3>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {selectedRepos.length} repositories selected
                </div>
              </div>
            </div>
            
            <div className="mt-6 space-y-3">
              <button
                onClick={handleGenerate}
                disabled={loading}
                className="w-full px-6 py-2 bg-black dark:bg-white dark:text-black text-white rounded-md hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors flex justify-center items-center"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white dark:text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Generating...
                  </>
                ) : (
                  'Generate Portfolio'
                )}
              </button>
              
              <button
                onClick={() => router.push('/github/customize')}
                disabled={loading}
                className="w-full px-6 py-2 border border-gray-300 dark:border-gray-700 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                Back to Customize
              </button>
            </div>
          </div>
        </div>
        
        <div className="md:col-span-2 order-1 md:order-2">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
            {/* Portfolio Preview */}
            <div 
              className="w-full"
              style={{ 
                backgroundColor: colorScheme.background,
                color: colorScheme.text
              }}
            >
              {/* Header */}
              <header 
                className="p-6"
                style={{ 
                  backgroundColor: colorScheme.primary,
                  color: '#ffffff'
                }}
              >
                <div className="max-w-5xl mx-auto">
                  <div className="flex flex-col md:flex-row justify-between items-center">
                    <h1 className="text-2xl font-bold">{portfolioName}</h1>
                    <nav className="flex space-x-4 mt-4 md:mt-0">
                      <a href="#" className="hover:underline">Home</a>
                      <a href="#" className="hover:underline">Projects</a>
                      <a href="#" className="hover:underline">About</a>
                      <a href="#" className="hover:underline">Contact</a>
                    </nav>
                  </div>
                </div>
              </header>
              
              {/* Hero Section */}
              <section className="py-16 px-6" style={{ backgroundColor: colorScheme.secondary, color: '#ffffff' }}>
                <div className="max-w-5xl mx-auto text-center">
                  <h2 className="text-3xl md:text-4xl font-bold mb-4">Welcome to My Portfolio</h2>
                  <p className="text-lg max-w-2xl mx-auto">
                    {portfolioDescription}
                  </p>
                  {user && (
                    <div className="mt-8 flex justify-center">
                      <div className="flex items-center bg-white/20 rounded-full px-4 py-2">
                        {user.avatar_url && (
                          <Image 
                            src={user.avatar_url} 
                            alt={`${user.login}'s avatar`}
                            width={32}
                            height={32}
                            className="rounded-full mr-2"
                          />
                        )}
                        <span>{user.name || user.login}</span>
                      </div>
                    </div>
                  )}
                </div>
              </section>
              
              {/* Projects Section */}
              <section className="py-16 px-6">
                <div className="max-w-5xl mx-auto">
                  <h2 
                    className="text-2xl font-bold mb-8 pb-2 border-b-2" 
                    style={{ borderColor: colorScheme.accent }}
                  >
                    Featured Projects
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {selectedRepos.map(repo => (
                      <div 
                        key={repo.id} 
                        className="rounded-lg overflow-hidden shadow-md"
                        style={{ 
                          backgroundColor: colorScheme.darkMode ? '#1f2937' : '#f9fafb',
                          border: `1px solid ${colorScheme.darkMode ? '#374151' : '#e5e7eb'}`
                        }}
                      >
                        <div 
                          className="p-4 border-b" 
                          style={{ 
                            borderColor: colorScheme.darkMode ? '#374151' : '#e5e7eb',
                            backgroundColor: colorScheme.darkMode ? '#111827' : '#f3f4f6' 
                          }}
                        >
                          <div className="flex justify-between items-center">
                            <h3 className="font-bold">{repo.name}</h3>
                            {repo.language && (
                              <span 
                                className="px-2 py-1 text-xs rounded-full"
                                style={{ 
                                  backgroundColor: colorScheme.accent,
                                  color: '#ffffff'
                                }}
                              >
                                {repo.language}
                              </span>
                            )}
                          </div>
                        </div>
                        
                        <div className="p-4">
                          {repo.description && (
                            <p className="mb-4 text-sm">{repo.description}</p>
                          )}
                          
                          <div className="flex justify-between text-sm">
                            <div className="flex space-x-4">
                              <span className="flex items-center">
                                <svg className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                                {repo.stargazers_count}
                              </span>
                              <span className="flex items-center">
                                <svg className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                                {repo.forks_count}
                              </span>
                            </div>
                            <span>Updated {formatDate(repo.updated_at)}</span>
                          </div>
                          
                          <a 
                            href={repo.html_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-4 inline-block px-4 py-2 rounded-md text-sm text-center w-full"
                            style={{ 
                              backgroundColor: colorScheme.primary,
                              color: '#ffffff'
                            }}
                          >
                            View Project
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
              
              {/* Footer */}
              <footer 
                className="py-8 px-6 text-center"
                style={{ 
                  backgroundColor: colorScheme.darkMode ? '#111827' : '#f3f4f6',
                  color: colorScheme.text
                }}
              >
                <div className="max-w-5xl mx-auto">
                  <p>
                    &copy; {new Date().getFullYear()} {portfolioName} • Created with RepoForge
                  </p>
                </div>
              </footer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
