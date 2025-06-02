'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { saveUserData } from '@/utils/supabase';

export default function GitHubConnectPage() {
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/auth/github', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to authenticate with GitHub');
      }

      // Store token in localStorage for current session use
      localStorage.setItem('githubToken', token);
      localStorage.setItem('githubUser', JSON.stringify(data.user));
      
      // Also store in Supabase for persistence
      await saveUserData({
        github_token: token,
        github_username: data.user.login,
        github_avatar: data.user.avatar_url,
        github_name: data.user.name
      });

      // Redirect to repositories page
      router.push('/github/repositories');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold mb-8 text-center">Connect to GitHub</h1>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 mb-8">
        <h2 className="text-xl font-semibold mb-4">Enter your GitHub Personal Access Token</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          We need a GitHub Personal Access Token to access your repositories and create your portfolio.
          Your token is stored securely and is only used to fetch your repositories and user information.
        </p>
        
        <div className="bg-yellow-50 dark:bg-yellow-900/30 border-l-4 border-yellow-400 p-4 mb-6">
          <h3 className="font-semibold text-yellow-800 dark:text-yellow-200">Required Permissions</h3>
          <p className="text-yellow-700 dark:text-yellow-300 text-sm mt-1">
            Your token must have the following scopes:
          </p>
          <ul className="list-disc list-inside text-yellow-700 dark:text-yellow-300 text-sm mt-1 ml-2">
            <li><strong>repo</strong> - Full control of private repositories</li>
            <li><strong>workflow</strong> - Required for GitHub Pages deployment</li>
          </ul>
          <p className="text-yellow-700 dark:text-yellow-300 text-sm mt-2">
            When creating your token on GitHub, make sure to check these permission scopes.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-md text-red-600 dark:text-red-300">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="token" className="block text-sm font-medium mb-2">
              GitHub Personal Access Token
            </label>
            <input
              id="token"
              type="password"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:ring-offset-gray-900 dark:bg-gray-700"
              placeholder="ghp_xxxxxxxxxxxxxxxx"
              required
            />
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Your token will be used to access your GitHub repositories but won&apos;t be stored on our servers.
            </p>
          </div>

          <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-md">
            <h3 className="font-medium mb-2">How to create a GitHub Personal Access Token:</h3>
            <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600 dark:text-gray-300">
              <li>Click on &quot;Settings&quot; in the left sidebar</li>
              <li>Select &quot;Developer settings&quot; at the bottom of the sidebar</li>
              <li>Click on &quot;Personal access tokens&quot; and then &quot;Tokens (classic)&quot;</li>
              <li>Click &quot;Generate new token&quot; and then &quot;Generate new token (classic)&quot;</li>
              <li>Give your token a name, select the &quot;repo&quot; scope</li>
              <li>Select the following scopes: <code className="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded">repo</code>, <code className="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded">read:user</code></li>
              <li>Click &quot;Generate token&quot; and copy the token value</li>
            </ol>
            <div className="mt-4">
              <a 
                href="https://github.com/settings/tokens/new" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 hover:underline flex items-center"
              >
                <span>Create a token on GitHub</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black dark:bg-white dark:text-black text-white px-6 py-3 rounded-md font-medium flex items-center justify-center gap-2 hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors disabled:opacity-70"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white dark:text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Connecting...</span>
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
                <span>Connect to GitHub</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
