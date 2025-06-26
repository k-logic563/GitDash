import { NextRequest, NextResponse } from 'next/server';
import GitHubApiClient from '@/lib/github-api';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const state = searchParams.get('state') || 'all';
    const per_page = parseInt(searchParams.get('per_page') || '100');

    const token = process.env.GITHUB_TOKEN;
    const owner = process.env.GITHUB_OWNER;
    const repo = process.env.GITHUB_REPO;

    if (!token || !owner || !repo) {
      return NextResponse.json(
        { error: 'Missing GitHub configuration. Please set GITHUB_TOKEN, GITHUB_OWNER, and GITHUB_REPO environment variables.' },
        { status: 500 }
      );
    }

    const client = new GitHubApiClient({ token, owner, repo });
    const issues = await client.getIssues({ state, per_page });

    return NextResponse.json(issues);
  } catch (error) {
    console.error('GitHub API Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch issues' },
      { status: 500 }
    );
  }
}