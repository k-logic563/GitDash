export interface GitHubIssue {
  id: number;
  number: number;
  title: string;
  body: string | null;
  state: 'open' | 'closed';
  labels: Label[];
  assignees: User[];
  user: User;
  created_at: string;
  updated_at: string;
  closed_at?: string | null;
  comments: number;
  repository_url: string;
  milestone?: Milestone | null;
}

export interface Label {
  id: number;
  name: string;
  color: string;
  description?: string | null;
}

export interface User {
  id: number;
  login: string;
  avatar_url: string;
  html_url: string;
}

export interface Repository {
  id: number;
  name: string;
  full_name: string;
  html_url: string;
  description?: string | null;
}

export interface Milestone {
  id: number;
  title: string;
  description?: string | null;
  state: 'open' | 'closed';
  due_on?: string | null;
}

export interface GitHubApiConfig {
  token: string;
  owner: string;
  repo: string;
}

class GitHubApiClient {
  private config: GitHubApiConfig;
  private baseUrl = 'https://api.github.com';

  constructor(config: GitHubApiConfig) {
    this.config = config;
  }

  private async request<T>(endpoint: string, params?: Record<string, string>): Promise<T> {
    const url = new URL(`${this.baseUrl}${endpoint}`);
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, value);
      });
    }

    const response = await fetch(url.toString(), {
      headers: {
        'Authorization': `Bearer ${this.config.token}`,
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'GitDash-App'
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('GitHub API error details:', {
        status: response.status,
        statusText: response.statusText,
        url: url.toString(),
        response: errorText
      });
      throw new Error(`GitHub API error: ${response.status} ${response.statusText} - ${errorText}`);
    }

    return response.json();
  }

  async getIssues(params: {
    state?: 'open' | 'closed' | 'all';
    labels?: string;
    since?: string;
    sort?: 'created' | 'updated' | 'comments';
    direction?: 'asc' | 'desc';
    per_page?: number;
    page?: number;
  } = {}): Promise<GitHubIssue[]> {
    const defaultParams = {
      state: 'all',
      sort: 'updated',
      direction: 'desc',
      per_page: '100',
      ...params
    };

    // Convert params to string values
    const stringParams = Object.entries(defaultParams).reduce((acc, [key, value]) => {
      acc[key] = String(value);
      return acc;
    }, {} as Record<string, string>);

    return this.request<GitHubIssue[]>(
      `/repos/${this.config.owner}/${this.config.repo}/issues`,
      stringParams
    );
  }

  async getRepository(): Promise<Repository> {
    return this.request<Repository>(`/repos/${this.config.owner}/${this.config.repo}`);
  }

  async getLabels(): Promise<Label[]> {
    return this.request<Label[]>(`/repos/${this.config.owner}/${this.config.repo}/labels`);
  }

  async searchIssues(query: string, params: {
    sort?: 'created' | 'updated' | 'comments';
    order?: 'asc' | 'desc';
    per_page?: number;
    page?: number;
  } = {}): Promise<{ items: GitHubIssue[]; total_count: number }> {
    const fullQuery = `${query} repo:${this.config.owner}/${this.config.repo}`;
    console.log('GitHub search full query:', fullQuery);
    
    const defaultParams = {
      q: fullQuery,
      sort: 'updated',
      order: 'desc',
      per_page: '100',
      ...params
    };

    const stringParams = Object.entries(defaultParams).reduce((acc, [key, value]) => {
      acc[key] = String(value);
      return acc;
    }, {} as Record<string, string>);

    return this.request<{ items: GitHubIssue[]; total_count: number }>(
      '/search/issues',
      stringParams
    );
  }

  // Get issues within a date range
  async getIssuesInDateRange(
    startDate: Date,
    endDate: Date,
    options: {
      state?: 'open' | 'closed' | 'all';
    } = {}
  ): Promise<GitHubIssue[]> {
    const formatDate = (date: Date) => date.toISOString().split('T')[0];
    
    // Build search query parts
    const queryParts = [];
    queryParts.push(`created:${formatDate(startDate)}..${formatDate(endDate)}`);
    queryParts.push('is:issue');
    
    if (options.state && options.state !== 'all') {
      queryParts.push(`state:${options.state}`);
    }
    
    const query = queryParts.join(' ');

    console.log('GitHub search query (created date range):', query);
    const result = await this.searchIssues(query);
    console.log('GitHub search result (created date range):', { query, totalCount: result.total_count, itemsCount: result.items.length });
    return result.items;
  }

  // Get issues closed within a date range
  async getIssuesClosedInDateRange(
    startDate: Date,
    endDate: Date
  ): Promise<GitHubIssue[]> {
    const formatDate = (date: Date) => date.toISOString().split('T')[0];
    
    // Build search query parts
    const queryParts = [];
    queryParts.push(`closed:${formatDate(startDate)}..${formatDate(endDate)}`);
    queryParts.push('is:issue');
    
    const query = queryParts.join(' ');

    console.log('GitHub search query (closed date range):', query);
    const result = await this.searchIssues(query);
    console.log('GitHub search result (closed date range):', { query, totalCount: result.total_count, itemsCount: result.items.length });
    return result.items;
  }
}

export default GitHubApiClient;