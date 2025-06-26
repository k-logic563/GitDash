'use client';

import { useState, useEffect } from 'react';
import { GitHubIssue, Label } from '@/lib/github-api';

interface UseGitHubIssuesOptions {
  enabled?: boolean;
}

interface UseGitHubIssuesReturn {
  issues: GitHubIssue[];
  loading: boolean;
  error: string | null;
  refresh: () => void;
}

export function useGitHubIssues(options: UseGitHubIssuesOptions): UseGitHubIssuesReturn {
  const [issues, setIssues] = useState<GitHubIssue[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchIssues = async () => {
    if (!options.enabled) return;

    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        state: 'all',
        per_page: '100'
      });

      const response = await fetch(`/api/github/issues?${params}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch issues');
      }

      const data = await response.json();
      setIssues(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch issues');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIssues();
  }, [options.enabled]);

  return {
    issues,
    loading,
    error,
    refresh: fetchIssues
  };
}

interface UseDateRangeIssuesOptions {
  enabled?: boolean;
  startDate: Date | null;
  endDate: Date | null;
}

export function useDateRangeIssues(options: UseDateRangeIssuesOptions) {
  const [openIssues, setOpenIssues] = useState<GitHubIssue[]>([]);
  const [closedIssues, setClosedIssues] = useState<GitHubIssue[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDateRangeIssues = async () => {
    if (!options.enabled || !options.startDate || !options.endDate) {
      setOpenIssues([]);
      setClosedIssues([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const baseParams = {
        startDate: options.startDate.toISOString(),
        endDate: options.endDate.toISOString()
      };

      const [openResponse, closedResponse] = await Promise.all([
        fetch(`/api/github/issues/date-range?${new URLSearchParams({
          ...baseParams,
          state: 'open'
        })}`),
        fetch(`/api/github/issues/date-range?${new URLSearchParams({
          ...baseParams,
          state: 'closed'
        })}`)
      ]);

      console.log('Date range API requests:', {
        openUrl: `/api/github/issues/date-range?${new URLSearchParams({...baseParams, state: 'open'})}`,
        closedUrl: `/api/github/issues/date-range?${new URLSearchParams({...baseParams, state: 'closed'})}`,
        baseParams
      });

      if (!openResponse.ok) {
        const errorData = await openResponse.json();
        throw new Error(errorData.error || 'Failed to fetch open issues');
      }

      if (!closedResponse.ok) {
        const errorData = await closedResponse.json();
        throw new Error(errorData.error || 'Failed to fetch closed issues');
      }

      const [openData, closedData] = await Promise.all([
        openResponse.json(),
        closedResponse.json()
      ]);

      setOpenIssues(openData);
      setClosedIssues(closedData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch date range issues');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDateRangeIssues();
  }, [options.enabled, options.startDate, options.endDate]);

  return {
    openIssues,
    closedIssues,
    loading,
    error,
    refresh: fetchDateRangeIssues
  };
}

interface UseGitHubLabelsOptions {
  enabled?: boolean;
}

interface UseGitHubLabelsReturn {
  labels: Label[];
  loading: boolean;
  error: string | null;
  refresh: () => void;
}

export function useGitHubLabels(options: UseGitHubLabelsOptions): UseGitHubLabelsReturn {
  const [labels, setLabels] = useState<Label[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLabels = async () => {
    if (!options.enabled) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/github/labels');
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch labels');
      }

      const data = await response.json();
      setLabels(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch labels');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLabels();
  }, [options.enabled]);

  return {
    labels,
    loading,
    error,
    refresh: fetchLabels
  };
}