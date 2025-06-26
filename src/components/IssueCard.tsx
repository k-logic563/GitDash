import { GitHubIssue } from '@/lib/mock-data';

interface IssueCardProps {
  issue: GitHubIssue;
}

export default function IssueCard({ issue }: IssueCardProps) {
  const priorityColors = {
    low: 'bg-gray-100 text-gray-800',
    medium: 'bg-yellow-100 text-yellow-800',
    high: 'bg-orange-100 text-orange-800',
    critical: 'bg-red-100 text-red-800'
  };

  const stateColors = {
    open: 'bg-green-100 text-green-800',
    closed: 'bg-purple-100 text-purple-800'
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-2">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${stateColors[issue.state]}`}>
            {issue.state}
          </span>
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${priorityColors[issue.priority]}`}>
            {issue.priority}
          </span>
        </div>
        <span className="text-sm text-gray-500">#{issue.id}</span>
      </div>

      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        {issue.title}
      </h3>

      <p className="text-gray-600 text-sm mb-4 line-clamp-3">
        {issue.body}
      </p>

      <div className="flex flex-wrap gap-2 mb-4">
        {issue.labels.map((label) => (
          <span
            key={label.id}
            className="inline-flex items-center px-2 py-1 rounded text-xs font-medium"
            style={{
              backgroundColor: `#${label.color}20`,
              color: `#${label.color}`
            }}
          >
            {label.name}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between text-sm text-gray-500">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1">
            <img
              src={issue.author.avatar_url}
              alt={issue.author.login}
              className="w-5 h-5 rounded-full"
            />
            <span>{issue.author.login}</span>
          </div>
          <span>{issue.comments} comments</span>
        </div>
        <div className="flex items-center space-x-2">
          <span>{issue.repository.name}</span>
          <span>•</span>
          <span>{new Date(issue.created_at).toLocaleDateString()}</span>
        </div>
      </div>

      {issue.assignees.length > 0 && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">Assigned to:</span>
            <div className="flex -space-x-1">
              {issue.assignees.map((assignee) => (
                <img
                  key={assignee.id}
                  src={assignee.avatar_url}
                  alt={assignee.login}
                  className="w-6 h-6 rounded-full border-2 border-white"
                  title={assignee.login}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}