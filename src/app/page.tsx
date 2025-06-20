import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-[calc(100vh-73px)] flex flex-col">
      {/* Hero Section */}
      <section className="flex flex-col md:flex-row items-center justify-between px-6 py-16 md:py-24 max-w-7xl mx-auto w-full gap-8">
        <div className="flex flex-col max-w-xl space-y-6">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            Create and manage GitHub repositories with ease
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            RepoForge helps you create, manage, and collaborate on GitHub repositories without the complexity.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <a
              href="/github/connect"
              className="rounded-md bg-black dark:bg-white dark:text-black text-white px-6 py-3 font-medium text-base flex items-center justify-center gap-2 hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
              Connect to GitHub
            </a>
            <a
              href="#features"
              className="rounded-md border border-gray-300 dark:border-gray-700 px-6 py-3 font-medium text-base flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
            >
              Learn more
            </a>
          </div>
        </div>
        <div className="relative w-full max-w-md">
          <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center mb-4 space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <div className="ml-2 text-sm font-mono text-gray-600 dark:text-gray-400">repoforge</div>
            </div>
            <div className="space-y-3 font-mono text-sm">
              <p className="text-gray-800 dark:text-gray-200">$ repoforge init my-awesome-project</p>
              <p className="text-green-600 dark:text-green-400">✓ Created repository my-awesome-project</p>
              <p className="text-gray-800 dark:text-gray-200">$ repoforge add-collaborator john-doe</p>
              <p className="text-green-600 dark:text-green-400">✓ Added collaborator john-doe</p>
              <p className="text-gray-800 dark:text-gray-200">$ repoforge deploy</p>
              <p className="text-green-600 dark:text-green-400">✓ Deployed to GitHub Pages</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-gray-50 dark:bg-gray-900 py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600 dark:text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Create Repositories</h3>
              <p className="text-gray-600 dark:text-gray-300">Quickly create new repositories with templates and best practices built-in.</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600 dark:text-purple-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Manage Collaborators</h3>
              <p className="text-gray-600 dark:text-gray-300">Easily add, remove, and manage permissions for repository collaborators.</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600 dark:text-green-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">One-Click Deployment</h3>
              <p className="text-gray-600 dark:text-gray-300">Deploy your projects to GitHub Pages or other platforms with a single click.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto py-8 px-6 border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <Image 
              src="/assets/blackLogo.svg" 
              alt="RepoForge Logo" 
              width={24} 
              height={24} 
              className="dark:hidden"
            />
            <Image 
              src="/assets/whiteLogo.svg" 
              alt="RepoForge Logo" 
              width={24} 
              height={24} 
              className="hidden dark:block"
            />
            <span className="ml-2 text-sm">© 2025 RepoForge. All rights reserved.</span>
          </div>
          <div className="flex space-x-6">
            <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100">Terms</a>
            <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100">Privacy</a>
            <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
