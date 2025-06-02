import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json();
    
    if (!token) {
      return NextResponse.json({ error: 'Token is required' }, { status: 400 });
    }

    // Validate the token by making a request to GitHub API
    const response = await fetch('https://api.github.com/user', {
      headers: {
        'Authorization': `token ${token}`,
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'RepoForge'
      }
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Invalid GitHub token' }, 
        { status: 401 }
      );
    }

    const userData = await response.json();
    
    // In a real app, you would store this token in a secure session/cookie
    // For this demo, we'll just return the user data
    return NextResponse.json({
      authenticated: true,
      user: userData
    });
  } catch (error) {
    console.error('GitHub authentication error:', error);
    return NextResponse.json(
      { error: 'Failed to authenticate with GitHub' }, 
      { status: 500 }
    );
  }
}
