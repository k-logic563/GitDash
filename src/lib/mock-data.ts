export interface GitHubIssue {
  id: number;
  title: string;
  body: string;
  state: 'open' | 'closed';
  labels: Label[];
  assignees: User[];
  author: User;
  created_at: string;
  updated_at: string;
  closed_at?: string;
  comments: number;
  repository: Repository;
  milestone?: Milestone;
  priority: 'low' | 'medium' | 'high' | 'critical';
}

export interface Label {
  id: number;
  name: string;
  color: string;
  description?: string;
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
  description?: string;
}

export interface Milestone {
  id: number;
  title: string;
  description?: string;
  state: 'open' | 'closed';
  due_on?: string;
}

export const mockIssues: GitHubIssue[] = [
  // Current week issues
  {
    id: 1,
    title: "Add dark mode support",
    body: "Users have requested dark mode functionality.",
    state: "open",
    labels: [
      { id: 1, name: "enhancement", color: "0052cc", description: "New feature or request" },
      { id: 2, name: "ui/ux", color: "5319e7", description: "User interface and experience" }
    ],
    assignees: [
      { id: 1, login: "developer1", avatar_url: "https://github.com/identicons/developer1.png", html_url: "https://github.com/developer1" }
    ],
    author: { id: 2, login: "user123", avatar_url: "https://github.com/identicons/user123.png", html_url: "https://github.com/user123" },
    created_at: "2025-06-23T10:30:00Z",
    updated_at: "2025-06-24T14:20:00Z",
    comments: 5,
    repository: {
      id: 1,
      name: "awesome-app",
      full_name: "company/awesome-app",
      html_url: "https://github.com/company/awesome-app",
      description: "An awesome web application"
    },
    milestone: {
      id: 1,
      title: "v2.0.0",
      description: "Major release with new features",
      state: "open",
      due_on: "2025-08-01T00:00:00Z"
    },
    priority: "high"
  },
  {
    id: 2,
    title: "Fix memory leak in data processing",
    body: "There's a memory leak when processing large datasets.",
    state: "open",
    labels: [
      { id: 3, name: "bug", color: "d73a49", description: "Something isn't working" },
      { id: 4, name: "critical", color: "b60205", description: "Critical issue that needs immediate attention" }
    ],
    assignees: [
      { id: 3, login: "senior-dev", avatar_url: "https://github.com/identicons/senior-dev.png", html_url: "https://github.com/senior-dev" }
    ],
    author: { id: 4, login: "tester", avatar_url: "https://github.com/identicons/tester.png", html_url: "https://github.com/tester" },
    created_at: "2025-06-22T08:15:00Z",
    updated_at: "2025-06-24T16:45:00Z",
    comments: 12,
    repository: {
      id: 1,
      name: "awesome-app",
      full_name: "company/awesome-app",
      html_url: "https://github.com/company/awesome-app",
      description: "An awesome web application"
    },
    priority: "critical"
  },
  {
    id: 3,
    title: "Mobile app crashes on startup",
    body: "Users report app crashes immediately after launch on iOS 17.",
    state: "closed",
    labels: [
      { id: 3, name: "bug", color: "d73a49", description: "Something isn't working" },
      { id: 10, name: "mobile", color: "c2e0c6", description: "Mobile specific" }
    ],
    assignees: [
      { id: 6, login: "frontend-dev", avatar_url: "https://github.com/identicons/frontend-dev.png", html_url: "https://github.com/frontend-dev" }
    ],
    author: { id: 5, login: "tech-writer", avatar_url: "https://github.com/identicons/tech-writer.png", html_url: "https://github.com/tech-writer" },
    created_at: "2025-06-21T14:00:00Z",
    updated_at: "2025-06-24T12:30:00Z",
    closed_at: "2025-06-24T12:30:00Z",
    comments: 8,
    repository: {
      id: 2,
      name: "mobile-app",
      full_name: "company/mobile-app",
      html_url: "https://github.com/company/mobile-app",
      description: "Mobile application"
    },
    priority: "critical"
  },
  // Last week issues
  {
    id: 4,
    title: "Update documentation for API endpoints",
    body: "The API documentation is outdated and missing information.",
    state: "open",
    labels: [
      { id: 5, name: "documentation", color: "0075ca", description: "Improvements or additions to documentation" },
      { id: 6, name: "api", color: "1d76db", description: "API related" }
    ],
    assignees: [],
    author: { id: 5, login: "tech-writer", avatar_url: "https://github.com/identicons/tech-writer.png", html_url: "https://github.com/tech-writer" },
    created_at: "2025-06-18T14:00:00Z",
    updated_at: "2025-06-19T14:00:00Z",
    comments: 2,
    repository: {
      id: 2,
      name: "api-service",
      full_name: "company/api-service",
      html_url: "https://github.com/company/api-service",
      description: "REST API service"
    },
    priority: "medium"
  },
  {
    id: 5,
    title: "Database migration script fails",
    body: "Migration script v2.1 fails on production database.",
    state: "closed",
    labels: [
      { id: 3, name: "bug", color: "d73a49", description: "Something isn't working" },
      { id: 11, name: "database", color: "0e8a16", description: "Database related" }
    ],
    assignees: [
      { id: 3, login: "senior-dev", avatar_url: "https://github.com/identicons/senior-dev.png", html_url: "https://github.com/senior-dev" }
    ],
    author: { id: 8, login: "qa-engineer", avatar_url: "https://github.com/identicons/qa-engineer.png", html_url: "https://github.com/qa-engineer" },
    created_at: "2025-06-17T08:15:00Z",
    updated_at: "2025-06-19T11:20:00Z",
    closed_at: "2025-06-19T11:20:00Z",
    comments: 15,
    repository: {
      id: 2,
      name: "api-service",
      full_name: "company/api-service",
      html_url: "https://github.com/company/api-service",
      description: "REST API service"
    },
    priority: "high"
  },
  {
    id: 6,
    title: "Add user authentication endpoints",
    body: "Need to implement OAuth2 authentication for new users.",
    state: "open",
    labels: [
      { id: 1, name: "enhancement", color: "0052cc", description: "New feature or request" },
      { id: 6, name: "api", color: "1d76db", description: "API related" }
    ],
    assignees: [
      { id: 1, login: "developer1", avatar_url: "https://github.com/identicons/developer1.png", html_url: "https://github.com/developer1" }
    ],
    author: { id: 7, login: "product-manager", avatar_url: "https://github.com/identicons/product-manager.png", html_url: "https://github.com/product-manager" },
    created_at: "2025-06-16T10:30:00Z",
    updated_at: "2025-06-20T09:15:00Z",
    comments: 6,
    repository: {
      id: 2,
      name: "api-service",
      full_name: "company/api-service",
      html_url: "https://github.com/company/api-service",
      description: "REST API service"
    },
    priority: "high"
  },
  // This month (earlier) issues
  {
    id: 7,
    title: "Implement user profile page",
    body: "Create a user profile page where users can view and edit their information.",
    state: "closed",
    labels: [
      { id: 1, name: "enhancement", color: "0052cc", description: "New feature or request" },
      { id: 2, name: "ui/ux", color: "5319e7", description: "User interface and experience" }
    ],
    assignees: [
      { id: 6, login: "frontend-dev", avatar_url: "https://github.com/identicons/frontend-dev.png", html_url: "https://github.com/frontend-dev" }
    ],
    author: { id: 7, login: "product-manager", avatar_url: "https://github.com/identicons/product-manager.png", html_url: "https://github.com/product-manager" },
    created_at: "2025-06-05T09:30:00Z",
    updated_at: "2025-06-12T11:20:00Z",
    closed_at: "2025-06-12T11:20:00Z",
    comments: 8,
    repository: {
      id: 1,
      name: "awesome-app",
      full_name: "company/awesome-app",
      html_url: "https://github.com/company/awesome-app",
      description: "An awesome web application"
    },
    milestone: {
      id: 2,
      title: "v1.5.0",
      description: "User experience improvements",
      state: "closed",
      due_on: "2025-06-15T00:00:00Z"
    },
    priority: "medium"
  },
  {
    id: 8,
    title: "Add unit tests for authentication module",
    body: "The authentication module lacks proper unit test coverage.",
    state: "open",
    labels: [
      { id: 7, name: "testing", color: "f9c513", description: "Testing related" },
      { id: 8, name: "tech-debt", color: "d4c5f9", description: "Technical debt" }
    ],
    assignees: [
      { id: 8, login: "qa-engineer", avatar_url: "https://github.com/identicons/qa-engineer.png", html_url: "https://github.com/qa-engineer" }
    ],
    author: { id: 9, login: "team-lead", avatar_url: "https://github.com/identicons/team-lead.png", html_url: "https://github.com/team-lead" },
    created_at: "2025-06-08T13:45:00Z",
    updated_at: "2025-06-14T10:30:00Z",
    comments: 3,
    repository: {
      id: 2,
      name: "api-service",
      full_name: "company/api-service",
      html_url: "https://github.com/company/api-service",
      description: "REST API service"
    },
    priority: "low"
  },
  {
    id: 9,
    title: "Performance optimization for mobile devices",
    body: "The application is slow on mobile devices.",
    state: "open",
    labels: [
      { id: 9, name: "performance", color: "fbca04", description: "Performance improvements" },
      { id: 10, name: "mobile", color: "c2e0c6", description: "Mobile specific" }
    ],
    assignees: [
      { id: 1, login: "developer1", avatar_url: "https://github.com/identicons/developer1.png", html_url: "https://github.com/developer1" },
      { id: 6, login: "frontend-dev", avatar_url: "https://github.com/identicons/frontend-dev.png", html_url: "https://github.com/frontend-dev" }
    ],
    author: { id: 10, login: "mobile-tester", avatar_url: "https://github.com/identicons/mobile-tester.png", html_url: "https://github.com/mobile-tester" },
    created_at: "2025-06-03T16:20:00Z",
    updated_at: "2025-06-18T09:15:00Z",
    comments: 7,
    repository: {
      id: 1,
      name: "awesome-app",
      full_name: "company/awesome-app",
      html_url: "https://github.com/company/awesome-app",
      description: "An awesome web application"
    },
    milestone: {
      id: 1,
      title: "v2.0.0",
      description: "Major release with new features",
      state: "open",
      due_on: "2025-08-01T00:00:00Z"
    },
    priority: "high"
  },
  // Last month issues
  {
    id: 10,
    title: "Security vulnerability in user authentication",
    body: "Found potential security issue in JWT token validation.",
    state: "closed",
    labels: [
      { id: 3, name: "bug", color: "d73a49", description: "Something isn't working" },
      { id: 12, name: "security", color: "ee0701", description: "Security related" }
    ],
    assignees: [
      { id: 3, login: "senior-dev", avatar_url: "https://github.com/identicons/senior-dev.png", html_url: "https://github.com/senior-dev" }
    ],
    author: { id: 11, login: "security-expert", avatar_url: "https://github.com/identicons/security-expert.png", html_url: "https://github.com/security-expert" },
    created_at: "2025-05-15T09:00:00Z",
    updated_at: "2025-05-18T14:30:00Z",
    closed_at: "2025-05-18T14:30:00Z",
    comments: 10,
    repository: {
      id: 2,
      name: "api-service",
      full_name: "company/api-service",
      html_url: "https://github.com/company/api-service",
      description: "REST API service"
    },
    priority: "critical"
  },
  {
    id: 11,
    title: "Add loading spinners to all forms",
    body: "Forms should show loading state during submission.",
    state: "closed",
    labels: [
      { id: 1, name: "enhancement", color: "0052cc", description: "New feature or request" },
      { id: 2, name: "ui/ux", color: "5319e7", description: "User interface and experience" }
    ],
    assignees: [
      { id: 6, login: "frontend-dev", avatar_url: "https://github.com/identicons/frontend-dev.png", html_url: "https://github.com/frontend-dev" }
    ],
    author: { id: 2, login: "user123", avatar_url: "https://github.com/identicons/user123.png", html_url: "https://github.com/user123" },
    created_at: "2025-05-12T11:15:00Z",
    updated_at: "2025-05-20T16:45:00Z",
    closed_at: "2025-05-20T16:45:00Z",
    comments: 4,
    repository: {
      id: 1,
      name: "awesome-app",
      full_name: "company/awesome-app",
      html_url: "https://github.com/company/awesome-app",
      description: "An awesome web application"
    },
    priority: "low"
  },
  {
    id: 12,
    title: "Database connection timeout issues",
    body: "Random database timeouts occurring during peak usage.",
    state: "open",
    labels: [
      { id: 3, name: "bug", color: "d73a49", description: "Something isn't working" },
      { id: 11, name: "database", color: "0e8a16", description: "Database related" }
    ],
    assignees: [
      { id: 12, login: "devops-engineer", avatar_url: "https://github.com/identicons/devops-engineer.png", html_url: "https://github.com/devops-engineer" }
    ],
    author: { id: 8, login: "qa-engineer", avatar_url: "https://github.com/identicons/qa-engineer.png", html_url: "https://github.com/qa-engineer" },
    created_at: "2025-05-08T14:20:00Z",
    updated_at: "2025-05-25T10:15:00Z",
    comments: 18,
    repository: {
      id: 2,
      name: "api-service",
      full_name: "company/api-service",
      html_url: "https://github.com/company/api-service",
      description: "REST API service"
    },
    priority: "high"
  }
];

export const mockRepositories: Repository[] = [
  {
    id: 1,
    name: "awesome-app",
    full_name: "company/awesome-app",
    html_url: "https://github.com/company/awesome-app",
    description: "An awesome web application"
  },
  {
    id: 2,
    name: "api-service",
    full_name: "company/api-service",
    html_url: "https://github.com/company/api-service",
    description: "REST API service"
  }
];