import { Octokit } from '@octokit/rest';

interface Repository {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  updated_at: string;
}

interface ColorScheme {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
  darkMode: boolean;
}

interface User {
  login: string;
  name?: string;
  avatar_url?: string;
}

interface DeploymentOptions {
  token: string;
  username: string;
  repositoryName: string;
  htmlContent: string;
  cssContent: string;
  jsContent: string;
  assets: {
    path: string;
    content: string;
  }[];
}

/**
 * Creates or updates a GitHub repository for portfolio deployment
 */
export async function createOrUpdateRepository(
  token: string,
  username: string,
  repositoryName: string
): Promise<boolean> {
  try {
    const octokit = new Octokit({ auth: token });
    
    // Check if repository exists
    try {
      await octokit.repos.get({
        owner: username,
        repo: repositoryName
      });
      console.log(`Repository ${username}/${repositoryName} already exists`);
    } catch (error) {
      // Create repository if it doesn't exist
      console.log(`Repository ${username}/${repositoryName} does not exist, creating it now:`, error);
      await octokit.repos.createForAuthenticatedUser({
        name: repositoryName,
        description: 'My portfolio website generated with RepoForge',
        private: false,
        auto_init: true
      });
      console.log(`Repository ${username}/${repositoryName} created`);
    }
    
    return true;
  } catch (error) {
    console.error('Error creating/updating repository:', error);
    return false;
  }
}

/**
 * Deploys a static website to GitHub Pages
 */
export async function deployToGitHubPages(options: DeploymentOptions): Promise<{
  success: boolean;
  url: string;
  error?: string;
}> {
  try {
    const { token, username, repositoryName, htmlContent, cssContent, jsContent, assets } = options;
    
    // Initialize Octokit with the token
    const octokit = new Octokit({ 
      auth: token,
      request: {
        fetch: async (url: string, options?: RequestInit) => {
          // Log API requests for debugging (only in development)
          if (process.env.NODE_ENV === 'development') {
            console.log(`GitHub API Request: ${options?.method || 'GET'} ${url}`);
          }
          return fetch(url, options);
        }
      }
    });
    
    // Verify token has necessary permissions
    try {
      await octokit.rest.users.getAuthenticated();
    } catch (authError) {
      console.error('GitHub authentication error:', authError);
      return {
        success: false,
        url: '',
        error: 'Invalid GitHub token or insufficient permissions. Make sure your token has the "repo" scope.'
      };
    }
    
    // Create or update repository
    const repoCreated = await createOrUpdateRepository(token, username, repositoryName);
    if (!repoCreated) {
      return {
        success: false,
        url: '',
        error: 'Failed to create or update repository. Check if your token has sufficient permissions.'
      };
    }
    
    // Enable GitHub Pages
    try {
      await octokit.repos.createPagesSite({
        owner: username,
        repo: repositoryName,
        source: {
          branch: 'main',
          path: '/'
        }
      });
      console.log('GitHub Pages enabled');
    } catch (error) {
      // Pages might already be enabled, continue
      console.log('GitHub Pages may already be enabled or there was an error:', error);
    }
    
    // Get the default branch
    const { data: repo } = await octokit.repos.get({
      owner: username,
      repo: repositoryName
    });
    
    const defaultBranch = repo.default_branch;
    
    // Get the latest commit SHA
    const { data: ref } = await octokit.git.getRef({
      owner: username,
      repo: repositoryName,
      ref: `heads/${defaultBranch}`
    });
    
    const latestCommitSha = ref.object.sha;
    
    // Get the tree SHA
    const { data: commit } = await octokit.git.getCommit({
      owner: username,
      repo: repositoryName,
      commit_sha: latestCommitSha
    });
    
    const treeSha = commit.tree.sha;
    
    // Create blobs for each file
    const files = [
      { path: 'index.html', content: htmlContent },
      { path: 'styles.css', content: cssContent },
      { path: 'script.js', content: jsContent },
      ...assets
    ];
    
    const blobs = await Promise.all(
      files.map(async (file) => {
        const { data } = await octokit.git.createBlob({
          owner: username,
          repo: repositoryName,
          content: Buffer.from(file.content).toString('base64'),
          encoding: 'base64'
        });
        
        return {
          path: file.path,
          mode: '100644' as const, // Regular file
          type: 'blob' as const,
          sha: data.sha
        };
      })
    );
    
    // Create a new tree
    const { data: newTree } = await octokit.git.createTree({
      owner: username,
      repo: repositoryName,
      base_tree: treeSha,
      tree: blobs
    });
    
    // Create a new commit
    const { data: newCommit } = await octokit.git.createCommit({
      owner: username,
      repo: repositoryName,
      message: 'Deploy portfolio website',
      tree: newTree.sha,
      parents: [latestCommitSha]
    });
    
    // Update the reference
    await octokit.git.updateRef({
      owner: username,
      repo: repositoryName,
      ref: `heads/${defaultBranch}`,
      sha: newCommit.sha
    });
    
    // Return the GitHub Pages URL
    return {
      success: true,
      url: `https://${username}.github.io/${repositoryName}/`
    };
  } catch (error) {
    console.error('Error deploying to GitHub Pages:', error);
    return {
      success: false,
      url: '',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * Generates static HTML, CSS, and JS files for a portfolio website
 */
export function generateStaticFiles(
  repositories: Repository[],
  colorScheme: ColorScheme,
  user: User,
  portfolioDetails: { name: string; description: string }
): {
  html: string;
  css: string;
  js: string;
  assets: { path: string; content: string }[];
} {
  // Generate HTML
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${portfolioDetails.name}</title>
  <link rel="stylesheet" href="styles.css">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
</head>
<body style="background-color: ${colorScheme.background}; color: ${colorScheme.text};">
  <header style="background-color: ${colorScheme.primary}; color: #ffffff;">
    <div class="container">
      <div class="header-content">
        <h1>${portfolioDetails.name}</h1>
        <nav>
          <ul>
            <li><a href="#home">Home</a></li>
            <li><a href="#projects">Projects</a></li>
            <li><a href="#about">About</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
        </nav>
      </div>
    </div>
  </header>

  <section id="home" class="hero" style="background-color: ${colorScheme.secondary}; color: #ffffff;">
    <div class="container">
      <div class="hero-content">
        ${user.avatar_url ? `<img src="${user.avatar_url}" alt="${user.name || user.login}" class="avatar">` : ''}
        <h2>Welcome to My Portfolio</h2>
        <p>${portfolioDetails.description}</p>
      </div>
    </div>
  </section>

  <section id="projects" class="projects">
    <div class="container">
      <h2 class="section-title" style="border-color: ${colorScheme.accent};">Featured Projects</h2>
      <div class="project-grid">
        ${repositories.map(repo => `
          <div class="project-card" style="background-color: ${colorScheme.darkMode ? '#1f2937' : '#f9fafb'}; border-color: ${colorScheme.darkMode ? '#374151' : '#e5e7eb'};">
            <div class="project-header" style="background-color: ${colorScheme.darkMode ? '#111827' : '#f3f4f6'}; border-color: ${colorScheme.darkMode ? '#374151' : '#e5e7eb'};">
              <h3>${repo.name}</h3>
              ${repo.language ? `<span class="language-tag" style="background-color: ${colorScheme.accent};">${repo.language}</span>` : ''}
            </div>
            <div class="project-body">
              ${repo.description ? `<p>${repo.description}</p>` : ''}
              <div class="project-stats">
                <span><i class="fas fa-star"></i> ${repo.stargazers_count}</span>
                <span><i class="fas fa-code-branch"></i> ${repo.forks_count}</span>
                <span>Updated ${new Date(repo.updated_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
              </div>
              <a href="${repo.html_url}" target="_blank" class="project-link" style="background-color: ${colorScheme.primary};">View Project</a>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  </section>

  <section id="about" class="about" style="background-color: ${colorScheme.darkMode ? '#111827' : '#f3f4f6'};">
    <div class="container">
      <h2 class="section-title" style="border-color: ${colorScheme.accent};">About Me</h2>
      <div class="about-content">
        <p>I&apos;m a passionate developer who loves building web applications and exploring new technologies. This portfolio showcases some of my recent projects hosted on GitHub.</p>
        <div class="skills">
          <h3>Skills</h3>
          <ul class="skill-list">
            <li style="background-color: ${colorScheme.primary};">HTML</li>
            <li style="background-color: ${colorScheme.primary};">CSS</li>
            <li style="background-color: ${colorScheme.primary};">JavaScript</li>
            <li style="background-color: ${colorScheme.primary};">React</li>
            <li style="background-color: ${colorScheme.primary};">Node.js</li>
          </ul>
        </div>
      </div>
    </div>
  </section>

  <section id="contact" class="contact">
    <div class="container">
      <h2 class="section-title" style="border-color: ${colorScheme.accent};">Get In Touch</h2>
      <div class="contact-content">
        <p>Feel free to reach out if you&apos;d like to collaborate on a project or just want to connect!</p>
        <div class="social-links">
          <a href="https://github.com/${user.login}" target="_blank" style="background-color: ${colorScheme.primary};"><i class="fab fa-github"></i> GitHub</a>
          <a href="#" target="_blank" style="background-color: ${colorScheme.primary};"><i class="fab fa-linkedin"></i> LinkedIn</a>
          <a href="mailto:example@email.com" style="background-color: ${colorScheme.primary};"><i class="fas fa-envelope"></i> Email</a>
        </div>
      </div>
    </div>
  </section>

  <footer style="background-color: ${colorScheme.primary}; color: #ffffff;">
    <div class="container">
      <p>&copy; ${new Date().getFullYear()} ${portfolioDetails.name} • Created with RepoForge</p>
    </div>
  </footer>

  <script src="script.js"></script>
</body>
</html>`;

  // Generate CSS
  const css = `/* Base styles */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  line-height: 1.6;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

a {
  text-decoration: none;
  color: inherit;
}

ul {
  list-style: none;
}

/* Header */
header {
  padding: 20px 0;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

header h1 {
  font-size: 1.8rem;
}

nav ul {
  display: flex;
}

nav ul li {
  margin-left: 20px;
}

nav ul li a {
  transition: opacity 0.3s;
}

nav ul li a:hover {
  opacity: 0.8;
}

/* Hero section */
.hero {
  padding: 80px 0;
  text-align: center;
}

.hero-content {
  max-width: 800px;
  margin: 0 auto;
}

.avatar {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  margin-bottom: 20px;
  border: 4px solid rgba(255, 255, 255, 0.3);
}

.hero h2 {
  font-size: 2.5rem;
  margin-bottom: 20px;
}

.hero p {
  font-size: 1.2rem;
  margin-bottom: 30px;
}

/* Section styling */
section {
  padding: 60px 0;
}

.section-title {
  font-size: 2rem;
  margin-bottom: 40px;
  text-align: center;
  padding-bottom: 10px;
  border-bottom: 3px solid;
  display: inline-block;
}

/* Projects section */
.projects .container {
  text-align: center;
}

.project-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 30px;
  margin-top: 40px;
}

.project-card {
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s, box-shadow 0.3s;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.project-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

.project-header {
  padding: 15px;
  border-bottom: 1px solid;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.project-header h3 {
  font-size: 1.2rem;
  margin: 0;
}

.language-tag {
  padding: 3px 8px;
  border-radius: 12px;
  font-size: 0.8rem;
  color: white;
}

.project-body {
  padding: 20px;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.project-body p {
  margin-bottom: 15px;
  font-size: 0.95rem;
  flex-grow: 1;
}

.project-stats {
  display: flex;
  justify-content: space-between;
  font-size: 0.85rem;
  margin-bottom: 15px;
}

.project-link {
  display: block;
  padding: 8px 0;
  border-radius: 4px;
  text-align: center;
  color: white;
  font-weight: 500;
  transition: opacity 0.3s;
}

.project-link:hover {
  opacity: 0.9;
}

/* About section */
.about-content {
  max-width: 800px;
  margin: 0 auto;
}

.skills {
  margin-top: 30px;
}

.skills h3 {
  margin-bottom: 15px;
}

.skill-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.skill-list li {
  padding: 5px 15px;
  border-radius: 20px;
  color: white;
  font-size: 0.9rem;
}

/* Contact section */
.contact-content {
  max-width: 600px;
  margin: 0 auto;
  text-align: center;
}

.social-links {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-top: 30px;
}

.social-links a {
  display: inline-flex;
  align-items: center;
  padding: 10px 20px;
  border-radius: 4px;
  color: white;
  transition: opacity 0.3s;
}

.social-links a i {
  margin-right: 8px;
}

.social-links a:hover {
  opacity: 0.9;
}

/* Footer */
footer {
  padding: 20px 0;
  text-align: center;
}

/* Responsive */
@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
  }
  
  nav ul {
    margin-top: 15px;
  }
  
  nav ul li {
    margin: 0 10px;
  }
  
  .project-grid {
    grid-template-columns: 1fr;
  }
  
  .social-links {
    flex-direction: column;
  }
}`;

  // Generate JS
  const js = `document.addEventListener('DOMContentLoaded', function() {
  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href');
      const targetElement = document.querySelector(targetId);
      
      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 70, // Adjust for header height
          behavior: 'smooth'
        });
      }
    });
  });

  // Mobile menu toggle (if needed in the future)
  const setupMobileMenu = () => {
    const header = document.querySelector('header');
    const nav = document.querySelector('nav');
    
    if (window.innerWidth <= 768) {
      // Add mobile menu functionality here if needed
    }
  };

  // Call initially and on resize
  setupMobileMenu();
  window.addEventListener('resize', setupMobileMenu);
});`;

  return {
    html,
    css,
    js,
    assets: [] // No additional assets for now
  };
}
