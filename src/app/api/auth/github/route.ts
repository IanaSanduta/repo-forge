import { NextRequest, NextResponse } from 'next/server';
import { getUserData } from '@/utils/supabase';

// For static export, we need to use error dynamic to indicate this can't be statically generated
export const dynamic = "error";
export const dynamicParams = true;
// This route cannot be prerendered as it requires runtime request data

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json();
    
    if (!token) {
      return NextResponse.json({ error: 'Token is required' }, { status: 400 });
    }

    // Validate the token by making a request to GitHub API
    const response = await fetch('https://api.github.com/user', {
      headers: {
        'Authorization': `Bearer ${token}`,
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
    
    // Check token scopes to ensure it has the necessary permissions
    const scopesResponse = await fetch('https://api.github.com/rate_limit', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'RepoForge'
      }
    });
    
    // GitHub returns the scopes in the X-OAuth-Scopes header
    const scopes = scopesResponse.headers.get('X-OAuth-Scopes') || '';
    const scopeArray = scopes.split(',').map(scope => scope.trim());
    
    // Check if the token has the necessary scopes for deployment
    const hasRepoScope = scopeArray.includes('repo') || scopeArray.includes('public_repo');
    
    if (!hasRepoScope) {
      return NextResponse.json(
        { 
          error: 'Insufficient token permissions', 
          message: 'Your token needs the "repo" or "public_repo" scope for GitHub Pages deployment.'
        }, 
        { status: 403 }
      );
    }
    
    // Check if user already exists in Supabase
    const existingUser = await getUserData(userData.login);
    
    // Return user data with additional info about persistence and scopes
    return NextResponse.json({
      authenticated: true,
      user: userData,
      persistedUser: existingUser !== null,
      scopes: scopeArray
    });
  } catch (error) {
    console.error('GitHub authentication error:', error);
    return NextResponse.json(
      { error: 'Failed to authenticate with GitHub' }, 
      { status: 500 }
    );
  }
}
