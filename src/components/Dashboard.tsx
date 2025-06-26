'use client';

import { useState, useMemo } from 'react';
import { useGitHubIssues, useGitHubLabels } from '@/hooks/useGitHubIssues';
import { GitHubIssue } from '@/lib/github-api';
import MetricCard from './MetricCard';
import AnalyticsChart from './AnalyticsChart';
type TimePeriod = '今日' | '今週' | '今月' | '先月' | '先々月';

export default function Dashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>('今週');
  const [selectedLabels, setSelectedLabels] = useState<string[]>([]);

  // Fetch all issues for general analysis
  const { issues: allIssues, loading: allIssuesLoading, error: allIssuesError } = useGitHubIssues({
    enabled: true
  });

  // Fetch labels
  const { labels, loading: labelsLoading, error: labelsError } = useGitHubLabels({
    enabled: true
  });


  const analytics = useMemo(() => {
    // Use real current date
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    // Calculate week boundaries (Monday start)
    const currentWeekDay = now.getDay() === 0 ? 7 : now.getDay(); // Convert Sunday (0) to 7
    const thisWeekStart = new Date(now);
    thisWeekStart.setDate(now.getDate() - currentWeekDay + 1);
    thisWeekStart.setHours(0, 0, 0, 0);
    
    const lastWeekStart = new Date(thisWeekStart);
    lastWeekStart.setDate(thisWeekStart.getDate() - 7);
    const lastWeekEnd = new Date(thisWeekStart);
    lastWeekEnd.setTime(thisWeekStart.getTime() - 1);
    
    // Calculate month boundaries
    const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);
    
    // Last last month (先々月)
    const lastLastMonthStart = new Date(now.getFullYear(), now.getMonth() - 2, 1);
    const lastLastMonthEnd = new Date(now.getFullYear(), now.getMonth() - 1, 0, 23, 59, 59, 999);

    // Use real GitHub data
    const issues = allIssues || [];

    // Label filtering helper
    const hasLabel = (issue: GitHubIssue, labelName: string) => {
      return issue.labels.some((label) => 
        label.name.toLowerCase() === labelName.toLowerCase()
      );
    };

    // Apply label filter to issues
    const applyLabelFilter = (issues: GitHubIssue[]) => {
      if (selectedLabels.length === 0) return issues;
      return issues.filter(issue => 
        selectedLabels.some(labelName => hasLabel(issue, labelName))
      );
    };

    // Current metrics
    const totalIssues = issues.length;
    const openIssues = applyLabelFilter(issues.filter(issue => issue.state === 'open')).length;
    const closedIssues = applyLabelFilter(issues.filter(issue => issue.state === 'closed')).length;

    // Time-based filtering functions
    const isInPeriod = (date: string, start: Date, end?: Date) => {
      const issueDate = new Date(date);
      return end ? issueDate >= start && issueDate <= end : issueDate >= start;
    };




    // Today - オープンは作成日基準、クローズはその期間でオープンされたイシューのみ
    const todayOpenFiltered = applyLabelFilter(issues.filter(issue => 
      isInPeriod(issue.created_at, todayStart)
    ));
    const todayClosedFiltered = applyLabelFilter(issues.filter(issue => 
      issue.state === 'closed' && issue.closed_at && 
      isInPeriod(issue.created_at, todayStart) && 
      isInPeriod(issue.closed_at, todayStart)
    ));

    // This week
    const thisWeekOpenFiltered = applyLabelFilter(issues.filter(issue => 
      isInPeriod(issue.created_at, thisWeekStart)
    ));
    const thisWeekClosedFiltered = applyLabelFilter(issues.filter(issue => 
      issue.state === 'closed' && issue.closed_at && 
      isInPeriod(issue.created_at, thisWeekStart) && 
      isInPeriod(issue.closed_at, thisWeekStart)
    ));

    // Last week
    const lastWeekOpenFiltered = applyLabelFilter(issues.filter(issue => 
      isInPeriod(issue.created_at, lastWeekStart, lastWeekEnd)
    ));
    const lastWeekClosedFiltered = applyLabelFilter(issues.filter(issue => 
      issue.state === 'closed' && issue.closed_at && 
      isInPeriod(issue.created_at, lastWeekStart, lastWeekEnd) && 
      isInPeriod(issue.closed_at, lastWeekStart, lastWeekEnd)
    ));

    // This month
    const thisMonthOpenFiltered = applyLabelFilter(issues.filter(issue => 
      isInPeriod(issue.created_at, thisMonthStart)
    ));
    const thisMonthClosedFiltered = applyLabelFilter(issues.filter(issue => 
      issue.state === 'closed' && issue.closed_at && 
      isInPeriod(issue.created_at, thisMonthStart) && 
      isInPeriod(issue.closed_at, thisMonthStart)
    ));

    // Last month
    const lastMonthOpenFiltered = applyLabelFilter(issues.filter(issue => 
      isInPeriod(issue.created_at, lastMonthStart, lastMonthEnd)
    ));
    const lastMonthClosedFiltered = applyLabelFilter(issues.filter(issue => 
      issue.state === 'closed' && issue.closed_at && 
      isInPeriod(issue.created_at, lastMonthStart, lastMonthEnd) && 
      isInPeriod(issue.closed_at, lastMonthStart, lastMonthEnd)
    ));

    // Last last month (先々月)
    const lastLastMonthOpenFiltered = applyLabelFilter(issues.filter(issue => 
      isInPeriod(issue.created_at, lastLastMonthStart, lastLastMonthEnd)
    ));
    const lastLastMonthClosedFiltered = applyLabelFilter(issues.filter(issue => 
      issue.state === 'closed' && issue.closed_at && 
      isInPeriod(issue.created_at, lastLastMonthStart, lastLastMonthEnd) && 
      isInPeriod(issue.closed_at, lastLastMonthStart, lastLastMonthEnd)
    ));

    // Get counts
    const todayOpen = todayOpenFiltered.length;
    const todayClosed = todayClosedFiltered.length;
    const thisWeekOpen = thisWeekOpenFiltered.length;
    const thisWeekClosed = thisWeekClosedFiltered.length;
    const lastWeekOpen = lastWeekOpenFiltered.length;
    const lastWeekClosed = lastWeekClosedFiltered.length;
    const thisMonthOpen = thisMonthOpenFiltered.length;
    const thisMonthClosed = thisMonthClosedFiltered.length;
    const lastMonthOpen = lastMonthOpenFiltered.length;
    const lastMonthClosed = lastMonthClosedFiltered.length;
    const lastLastMonthOpen = lastLastMonthOpenFiltered.length;
    const lastLastMonthClosed = lastLastMonthClosedFiltered.length;

    // Chart data for weekly comparison
    const weeklyComparison = [
      { label: '今週', value: thisWeekOpen },
      { label: '先週', value: lastWeekOpen }
    ];

    const weeklyClosedComparison = [
      { label: '今週', value: thisWeekClosed },
      { label: '先週', value: lastWeekClosed }
    ];

    // Chart data for monthly comparison
    const monthlyComparison = [
      { label: '今月', value: thisMonthOpen },
      { label: '先月', value: lastMonthOpen }
    ];

    const monthlyClosedComparison = [
      { label: '今月', value: thisMonthClosed },
      { label: '先月', value: lastMonthClosed }
    ];



    // Calculate change percentages
    const weeklyOpenChange = lastWeekOpen > 0 ? ((thisWeekOpen - lastWeekOpen) / lastWeekOpen) * 100 : 0;
    const weeklyClosedChange = lastWeekClosed > 0 ? ((thisWeekClosed - lastWeekClosed) / lastWeekClosed) * 100 : 0;
    const monthlyOpenChange = lastMonthOpen > 0 ? ((thisMonthOpen - lastMonthOpen) / lastMonthOpen) * 100 : 0;
    const monthlyClosedChange = lastMonthClosed > 0 ? ((thisMonthClosed - lastMonthClosed) / lastMonthClosed) * 100 : 0;

    // Label-based analysis for current period - その期間でオープンされたイシューのみ
    const getCurrentPeriodIssues = () => {
      switch (selectedPeriod) {
        case '今日':
          return issues.filter(issue => 
            isInPeriod(issue.created_at, todayStart)
          );
        case '今週':
          return issues.filter(issue => 
            isInPeriod(issue.created_at, thisWeekStart)
          );
        case '今月':
          return issues.filter(issue => 
            isInPeriod(issue.created_at, thisMonthStart)
          );
        case '先月':
          return issues.filter(issue => 
            isInPeriod(issue.created_at, lastMonthStart, lastMonthEnd)
          );
        case '先々月':
          return issues.filter(issue => 
            isInPeriod(issue.created_at, lastLastMonthStart, lastLastMonthEnd)
          );
        default:
          return issues.filter(issue => 
            isInPeriod(issue.created_at, thisWeekStart)
          );
      }
    };
    
    // Calculate label statistics for current period
    const calculateLabelStats = () => {
      const labelStats = new Map();
      
      // Get issues for current period based on selection (その期間でオープンされたもののみ)
      const periodIssues = getCurrentPeriodIssues();
      
      // Count issues for each label
      periodIssues.forEach(issue => {
        issue.labels.forEach(label => {
          if (!labelStats.has(label.name)) {
            labelStats.set(label.name, {
              label,
              openCount: 0,
              closedCount: 0,
              totalCount: 0
            });
          }
          
          const stat = labelStats.get(label.name);
          if (issue.state === 'open') {
            stat.openCount++;
          } else {
            stat.closedCount++;
          }
          stat.totalCount++;
        });
      });
      
      // Sort by total count and get top 5
      return Array.from(labelStats.values())
        .sort((a, b) => b.totalCount - a.totalCount)
        .slice(0, 5);
    };

    // Get data based on selected period
    const getPeriodData = () => {
      switch (selectedPeriod) {
        case '今日':
          return {
            currentOpen: todayOpen,
            currentClosed: todayClosed,
            previousOpen: 0, // 昨日のデータはモックにないので0
            previousClosed: 0,
            comparisonLabel: '昨日'
          };
        case '今週':
          return {
            currentOpen: thisWeekOpen,
            currentClosed: thisWeekClosed,
            previousOpen: lastWeekOpen,
            previousClosed: lastWeekClosed,
            comparisonLabel: '先週'
          };
        case '今月':
          return {
            currentOpen: thisMonthOpen,
            currentClosed: thisMonthClosed,
            previousOpen: lastMonthOpen,
            previousClosed: lastMonthClosed,
            comparisonLabel: '先月'
          };
        case '先月':
          return {
            currentOpen: lastMonthOpen,
            currentClosed: lastMonthClosed,
            previousOpen: lastLastMonthOpen,
            previousClosed: lastLastMonthClosed,
            comparisonLabel: '先々月'
          };
        case '先々月':
          return {
            currentOpen: lastLastMonthOpen,
            currentClosed: lastLastMonthClosed,
            previousOpen: 0, // 3ヶ月前のデータは比較なし
            previousClosed: 0,
            comparisonLabel: '比較なし'
          };
        default:
          return {
            currentOpen: thisWeekOpen,
            currentClosed: thisWeekClosed,
            previousOpen: lastWeekOpen,
            previousClosed: lastWeekClosed,
            comparisonLabel: '先週'
          };
      }
    };

    const periodData = getPeriodData();
    const openChange = periodData.previousOpen > 0 ? 
      ((periodData.currentOpen - periodData.previousOpen) / periodData.previousOpen) * 100 : 0;
    const closedChange = periodData.previousClosed > 0 ? 
      ((periodData.currentClosed - periodData.previousClosed) / periodData.previousClosed) * 100 : 0;

    // Chart data based on selected period
    const getChartData = () => {
      return [
        { label: selectedPeriod, value: periodData.currentOpen },
        { label: periodData.comparisonLabel, value: periodData.previousOpen }
      ];
    };

    const getClosedChartData = () => {
      return [
        { label: selectedPeriod, value: periodData.currentClosed },
        { label: periodData.comparisonLabel, value: periodData.previousClosed }
      ];
    };

    return {
      totalIssues,
      openIssues,
      closedIssues,
      periodData,
      openChange: Math.round(openChange * 10) / 10,
      closedChange: Math.round(closedChange * 10) / 10,
      chartData: getChartData(),
      closedChartData: getClosedChartData(),
      resolutionRate: Math.round((closedIssues / totalIssues) * 100),
      labelMetrics: {
        topLabels: calculateLabelStats()
      }
    };
  }, [selectedPeriod, selectedLabels, allIssues]);

  // Show loading state
  if (allIssuesLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">イシューを読み込み中...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (allIssuesError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 mb-4">
            <svg className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.96-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">エラーが発生しました</h3>
          <p className="text-gray-600 mb-4">{allIssuesError}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            再読み込み
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">GitHubイシュー分析</h1>
              <p className="text-gray-600">イシューの作成と解決の時系列メトリクス分析</p>
            </div>
            <div className="mt-4 sm:mt-0">
              <div className="flex flex-col space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                  <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
                    {(['今日', '今週', '今月', '先月', '先々月'] as TimePeriod[]).map((period) => (
                      <button
                        key={period}
                        onClick={() => setSelectedPeriod(period)}
                        className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                          selectedPeriod === period
                            ? 'bg-white text-blue-600 shadow-sm'
                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                        }`}
                      >
                        {period}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="mt-4">
                  <div className="flex flex-col space-y-3">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-700">ラベルで絞り込み:</span>
                      <button
                        onClick={() => setSelectedLabels([])}
                        className={`px-3 py-1 text-xs rounded-full transition-colors ${
                          selectedLabels.length === 0
                            ? 'bg-gray-800 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                      >
                        すべて
                      </button>
                    </div>
                    <div className="max-h-32 overflow-y-auto">
                      <div className="flex flex-wrap gap-2">
                        {labels.map((label) => (
                          <button
                            key={label.id}
                            onClick={() => {
                              const isSelected = selectedLabels.includes(label.name);
                              if (isSelected) {
                                setSelectedLabels(selectedLabels.filter(name => name !== label.name));
                              } else {
                                setSelectedLabels([...selectedLabels, label.name]);
                              }
                            }}
                            className={`px-2 py-1 text-xs rounded-full transition-colors flex-shrink-0 ${
                              selectedLabels.includes(label.name)
                                ? 'text-white shadow-sm'
                                : 'hover:opacity-80'
                            }`}
                            style={{
                              backgroundColor: selectedLabels.includes(label.name) 
                                ? `#${label.color}` 
                                : `#${label.color}20`,
                              color: selectedLabels.includes(label.name) 
                                ? 'white' 
                                : `#${label.color}`,
                              border: `1px solid #${label.color}40`
                            }}
                            title={label.description || label.name}
                          >
                            {label.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>


        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <MetricCard
            title={`${selectedPeriod}オープン`}
            value={analytics.periodData.currentOpen}
            change={analytics.openChange}
            changeType={analytics.openChange >= 0 ? "increase" : "decrease"}
            description={`対${analytics.periodData.comparisonLabel}比`}
          />
          <MetricCard
            title={`${selectedPeriod}クローズ`}
            value={analytics.periodData.currentClosed}
            change={analytics.closedChange}
            changeType={analytics.closedChange >= 0 ? "increase" : "decrease"}
            description={`対${analytics.periodData.comparisonLabel}比`}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <AnalyticsChart
            title={`オープンイシュー比較`}
            data={analytics.chartData}
            type="bar"
            color="blue"
          />
          <AnalyticsChart
            title={`クローズイシュー比較`}
            data={analytics.closedChartData}
            type="bar"
            color="green"
          />
        </div>


        <div className="mb-8">
          <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">ラベル別イシュー数トップ5</h3>
            <div className="space-y-3">
              {analytics.labelMetrics.topLabels.map((labelStat, index) => (
                <div key={labelStat.label.name} className="flex items-center justify-between p-3 rounded-lg border" 
                     style={{ backgroundColor: `#${labelStat.label.color}15`, borderColor: `#${labelStat.label.color}30` }}>
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg font-bold text-gray-600">#{index + 1}</span>
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: `#${labelStat.label.color}` }}></div>
                      <span className="text-sm font-medium text-gray-900">{labelStat.label.name}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className="text-xs text-gray-500">オープン</div>
                      <div className="text-sm font-bold text-blue-600">{labelStat.openCount}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-gray-500">クローズ</div>
                      <div className="text-sm font-bold text-green-600">{labelStat.closedCount}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-gray-500">合計</div>
                      <div className="text-lg font-bold" style={{ color: `#${labelStat.label.color}` }}>{labelStat.totalCount}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}