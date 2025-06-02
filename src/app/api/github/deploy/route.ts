import { NextRequest, NextResponse } from 'next/server';
import { deployToGitHubPages, generateStaticFiles } from '@/utils/deployment/githubPages';

export async function POST(request: NextRequest) {
  try {
    const { token, username, repositories, colorScheme, portfolioDetails, user } = await request.json();

    if (!token || !username || !repositories || !colorScheme || !portfolioDetails) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    // Generate static files
    const staticFiles = generateStaticFiles(
      repositories,
      colorScheme,
      user,
      portfolioDetails
    );

    // Deploy to GitHub Pages
    const deploymentResult = await deployToGitHubPages({
      token,
      username,
      repositoryName: 'portfolio',
      htmlContent: staticFiles.html,
      cssContent: staticFiles.css,
      jsContent: staticFiles.js,
      assets: staticFiles.assets
    });

    if (!deploymentResult.success) {
      return NextResponse.json(
        { error: deploymentResult.error || 'Deployment failed' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      url: deploymentResult.url
    });
  } catch (error) {
    console.error('Error in deployment API:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
