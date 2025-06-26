import { NextRequest, NextResponse } from 'next/server';
import GitHubApiClient from '@/lib/github-api';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const startDate = searchParams.get('startDate');
  const endDate = searchParams.get('endDate');
  const state = searchParams.get('state') || 'open';

  console.log('Date range API received params:', { startDate, endDate, state });

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

    if (!startDate || !endDate) {
      return NextResponse.json(
        { error: 'Missing required parameters: startDate, endDate' },
        { status: 400 }
      );
    }

    const client = new GitHubApiClient({ token, owner, repo });
    
    const start = new Date(startDate);
    const end = new Date(endDate);

    console.log('Date range API request:', { startDate, endDate, state, start, end });

    let issues;
    if (state === 'closed') {
      issues = await client.getIssuesClosedInDateRange(start, end);
    } else if (state === 'open') {
      // For open issues, get all issues created in the date range that are still open
      issues = await client.getIssuesInDateRange(start, end, {
        state: 'open'
      });
    } else {
      // For 'all' state
      issues = await client.getIssuesInDateRange(start, end, {
        state
      });
    }

    console.log('Date range API response:', { 
      state, 
      issuesCount: issues.length, 
      sample: issues.slice(0, 2).map(i => ({ id: i.id, title: i.title, state: i.state, created_at: i.created_at }))
    });

    return NextResponse.json(issues);
  } catch (error) {
    console.error('GitHub API Date Range Error:', error);
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    console.error('Request params:', { startDate, endDate, state });
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Failed to fetch date range issues',
        details: error instanceof Error ? error.stack : 'Unknown error'
      },
      { status: 500 }
    );
  }
}