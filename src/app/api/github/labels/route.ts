import { NextResponse } from 'next/server';
import GitHubApiClient from '@/lib/github-api';

export async function GET() {
  try {
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
    const labels = await client.getLabels();

    return NextResponse.json(labels);
  } catch (error) {
    console.error('GitHub API Labels Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch labels' },
      { status: 500 }
    );
  }
}