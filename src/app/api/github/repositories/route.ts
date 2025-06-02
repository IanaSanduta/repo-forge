import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Get the token from the Authorization header
    const authHeader = request.headers.get('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Authorization token is required' }, { status: 401 });
    }
    
    const token = authHeader.split(' ')[1];
    
    // Fetch repositories from GitHub API
    const response = await fetch('https://api.github.com/user/repos?sort=updated&per_page=100', {
      headers: {
        'Authorization': `token ${token}`,
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'RepoForge'
      }
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch repositories' }, 
        { status: response.status }
      );
    }

    const repositories = await response.json();
    
    // Define the GitHub repository type
    interface GitHubRepository {
      id: number;
      name: string;
      full_name: string;
      description: string | null;
      html_url: string;
      private: boolean;
      fork: boolean;
      created_at: string;
      updated_at: string;
      pushed_at: string;
      language: string | null;
      default_branch: string;
      stargazers_count: number;
      forks_count: number;
      open_issues_count: number;
    }
    
    // Return simplified repository data
    return NextResponse.json({
      repositories: repositories.map((repo: GitHubRepository) => ({
        id: repo.id,
        name: repo.name,
        full_name: repo.full_name,
        description: repo.description,
        html_url: repo.html_url,
        private: repo.private,
        fork: repo.fork,
        created_at: repo.created_at,
        updated_at: repo.updated_at,
        pushed_at: repo.pushed_at,
        language: repo.language,
        default_branch: repo.default_branch,
        stargazers_count: repo.stargazers_count,
        forks_count: repo.forks_count,
        open_issues_count: repo.open_issues_count
      }))
    });
  } catch (error) {
    console.error('Error fetching repositories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch repositories' }, 
      { status: 500 }
    );
  }
}
