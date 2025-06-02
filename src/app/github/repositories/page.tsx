'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

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

export default function RepositoriesPage() {
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<{
    login: string;
    name?: string;
    avatar_url: string;
  } | null>(null);
  const [selectedRepos, setSelectedRepos] = useState<number[]>([]);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('githubToken');
    const userData = localStorage.getItem('githubUser');
    
    if (!token) {
      router.push('/github/connect');
      return;
    }

    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (e) {
        console.error('Failed to parse user data:', e);
      }
    }

    const fetchRepositories = async () => {
      try {
        const response = await fetch('/api/github/repositories', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          if (response.status === 401) {
            localStorage.removeItem('githubToken');
            localStorage.removeItem('githubUser');
            router.push('/github/connect');
            return;
          }
          throw new Error('Failed to fetch repositories');
        }

        const data = await response.json();
        setRepositories(data.repositories);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchRepositories();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('githubToken');
    localStorage.removeItem('githubUser');
    router.push('/');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const toggleRepoSelection = (repoId: number) => {
    setSelectedRepos(prev => {
      if (prev.includes(repoId)) {
        return prev.filter(id => id !== repoId);
      } else {
        return [...prev, repoId];
      }
    });
  };

  const handleContinue = () => {
    if (selectedRepos.length === 0) {
      alert('Please select at least one repository');
      return;
    }
    
    // Store selected repositories in localStorage
    localStorage.setItem('selectedRepos', JSON.stringify(
      repositories.filter(repo => selectedRepos.includes(repo.id))
    ));
    
    // Navigate to the color selection page
    router.push('/github/customize');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-73px)]">
        <div className="text-center">
          <svg className="animate-spin h-10 w-10 text-gray-400 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-gray-600 dark:text-gray-300">Loading your repositories...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-md p-6 text-center">
          <h2 className="text-xl font-semibold text-red-700 dark:text-red-300 mb-2">Error Loading Repositories</h2>
          <p className="text-red-600 dark:text-red-300">{error}</p>
          <button
            onClick={() => router.push('/github/connect')}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            Reconnect to GitHub
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {user && (
        <div className="mb-8 flex flex-col sm:flex-row items-center sm:items-start justify-between">
          <div className="flex items-center mb-4 sm:mb-0">
            <Image 
              src={user.avatar_url} 
              alt={`${user.login}&apos;s avatar`}
              width={48}
              height={48}
              className="rounded-full mr-4"
            />
            <div>
              <h2 className="text-xl font-semibold">{user.name || user.login}</h2>
              <p className="text-gray-600 dark:text-gray-300">{user.login}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            Disconnect
          </button>
        </div>
      )}

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Select Repositories for Your Portfolio</h1>
        <button
          onClick={handleContinue}
          disabled={selectedRepos.length === 0}
          className={`px-6 py-2 rounded-md transition-colors ${selectedRepos.length === 0 
            ? 'bg-gray-300 dark:bg-gray-700 cursor-not-allowed text-gray-500 dark:text-gray-400' 
            : 'bg-black dark:bg-white dark:text-black text-white hover:bg-gray-800 dark:hover:bg-gray-200'}`}
        >
          Continue ({selectedRepos.length} selected)
        </button>
      </div>
      
      <p className="text-gray-600 dark:text-gray-300 mb-6">
        Choose the repositories you want to showcase in your portfolio website.
      </p>

      {repositories.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center">
          <h2 className="text-xl font-semibold mb-2">No repositories found</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            You don&apos;t have any repositories yet or your token doesn&apos;t have access to them.
          </p>
          <a
            href="https://github.com/new"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-4 py-2 bg-black dark:bg-white dark:text-black text-white rounded-md hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Create a new repository
          </a>
        </div>
      ) : (
        <div className="grid gap-4">
          {repositories.map((repo) => (
            <div 
            key={repo.id} 
            className={`bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border ${selectedRepos.includes(repo.id) 
              ? 'border-blue-500 dark:border-blue-400 ring-2 ring-blue-500 dark:ring-blue-400' 
              : 'border-gray-100 dark:border-gray-700'} 
              cursor-pointer transition-all hover:border-blue-300 dark:hover:border-blue-600`}
            onClick={() => toggleRepoSelection(repo.id)}
          >
            <div className="absolute top-4 right-4">
              <div className={`w-6 h-6 rounded-full border ${selectedRepos.includes(repo.id) 
                ? 'bg-blue-500 border-blue-500 dark:bg-blue-400 dark:border-blue-400' 
                : 'border-gray-300 dark:border-gray-600'} flex items-center justify-center`}>
                {selectedRepos.includes(repo.id) && (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
            </div>
              <div className="flex flex-col md:flex-row md:items-center justify-between">
                <div className="mb-4 md:mb-0">
                  <div className="flex items-center mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                    </svg>
                    <a 
                      href={repo.html_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-xl font-semibold hover:underline"
                    >
                      {repo.name}
                    </a>
                    {repo.private && (
                      <span className="ml-2 px-2 py-0.5 text-xs font-medium bg-gray-100 dark:bg-gray-700 rounded-full">
                        Private
                      </span>
                    )}
                  </div>
                  {repo.description && (
                    <p className="text-gray-600 dark:text-gray-300 mb-2">{repo.description}</p>
                  )}
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                    {repo.language && (
                      <div className="flex items-center mr-4">
                        <span className="w-3 h-3 rounded-full mr-1 bg-blue-500"></span>
                        <span>{repo.language}</span>
                      </div>
                    )}
                    <div className="flex items-center mr-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                      </svg>
                      <span>{repo.stargazers_count}</span>
                    </div>
                    <div className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                      </svg>
                      <span>{repo.forks_count}</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <a
                    href={`${repo.html_url}/settings`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-center"
                  >
                    Settings
                  </a>
                  <a
                    href={repo.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-black dark:bg-white dark:text-black text-white rounded-md hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors text-center"
                  >
                    View Repository
                  </a>
                </div>
              </div>
              <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                Updated on {formatDate(repo.updated_at)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
