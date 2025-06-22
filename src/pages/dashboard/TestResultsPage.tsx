import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Zap,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  BarChart3,
  DownloadCloud,
  RefreshCw,
} from 'lucide-react';
import Card from '../../components/ui/Card';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { getTestResult, DetailedTestResults } from '../../services/api';
import ResultsCharts from '../../components/charts/ResultsCharts';
import { useAuth } from '../../hooks/useAuth';

const TestResultsPage = () => {
  const { testId } = useParams<{ testId: string }>();
  const [results, setResults] = useState<DetailedTestResults | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchResults = async () => {
      if (!testId) {
        console.log('No testId found');
        setError('Test ID is missing');
        setIsLoading(false);
        return;
      }

      if (!user) {
        console.log('No user found');
        navigate('/login');
        return;
      }
      
      try {
        setIsLoading(true);
        setError(null);
        console.log('Fetching results for test:', testId);
        
        const data = await getTestResult(testId);
        console.log('Received test results:', data);
        
        if (!data) {
          throw new Error('No data received from API');
        }

        // Validate required data
        if (!data.summary || !data.timeSeries) {
          throw new Error('Invalid test results format');
        }
        
        setResults(data);
      } catch (error) {
        console.error('Error fetching test results:', error);
        const errorMessage = error instanceof Error ? error.message : 'Failed to fetch test results';
        setError(errorMessage);
        
        if (errorMessage.includes('authentication')) {
          navigate('/login');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchResults();
  }, [testId, user, navigate]);

  useEffect(() => {
    const pollResults = async () => {
      if (!testId || !user) return;
      
      try {
        const data = await getTestResult(testId);
        setResults(data);
        
        // Continue polling if test is still running
        if (data.summary.status === 'running') {
          const pollTimeout = setTimeout(pollResults, 1000);
          return () => clearTimeout(pollTimeout);
        }
      } catch (error) {
        console.error('Error polling test results:', error);
      }
    };

    pollResults();

    // Cleanup function
    return () => {
      // Any cleanup needed
    };
  }, [testId, user]);

  // Early return for loading state
  if (isLoading) {
    console.log('Rendering loading state'); // Debug log
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" message="Loading test results..." />
      </div>
    );
  }

  // Early return for error state
  if (error) {
    console.log('Rendering error state:', error); // Debug log
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="p-6 bg-error-900/30 border border-error-800 rounded-lg text-center">
          <AlertTriangle className="h-10 w-10 text-error-500 mx-auto" />
          <h3 className="mt-2 text-xl font-medium text-white">Error</h3>
          <p className="mt-1 text-gray-400">{error}</p>
          <div className="mt-4 flex justify-center space-x-4">
            <button 
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-md text-white flex items-center"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Retry
            </button>
            <Link
              to="/dashboard"
              className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-md text-white"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Early return for missing results
  if (!results) {
    console.log('Rendering no results state'); // Debug log
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="p-6 bg-gray-800/50 rounded-lg text-center">
          <h3 className="text-xl font-medium text-white">No Results Found</h3>
          <p className="mt-1 text-gray-400">The test results could not be found.</p>
          <Link
            to="/dashboard"
            className="mt-4 inline-block px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-md text-white"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const formatDuration = (start: string, end: string) => {
    const startTime = new Date(start).getTime();
    const endTime = new Date(end).getTime();
    const durationMs = endTime - startTime;
    
    if (durationMs < 1000) {
      return `${durationMs}ms`;
    }
    
    const seconds = Math.floor(durationMs / 1000);
    if (seconds < 60) {
      return `${seconds}s`;
    }
    
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold neon-text-purple">Test Results</h1>
            <p className="mt-1 text-gray-400">
              Detailed analytics and metrics from your load test
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex space-x-4">
            <Link
              to="/configure"
              className="cyber-button flex items-center"
            >
              <Zap className="mr-2 h-4 w-4" />
              New Test
            </Link>
          </div>
        </div>

        {/* Test Overview */}
        <Card className="mb-8">
          <div className="mb-6 border-b border-gray-800 pb-6">
            <h2 className="text-xl font-bold mb-4">Test Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-gray-400 mb-1">Target URL</p>
                <p className="font-mono text-white break-all">
                  {results.testConfig.targetUrl}
                </p>
              </div>
              <div>
                <p className="text-gray-400 mb-1">Method</p>
                <p className="font-medium">
                  <span className={`
                    inline-flex px-2 py-1 text-xs rounded
                    ${results.testConfig.method === 'GET' ? 'bg-primary-900/50 text-primary-400' : ''}
                    ${results.testConfig.method === 'POST' ? 'bg-secondary-900/50 text-secondary-400' : ''}
                    ${results.testConfig.method === 'PUT' ? 'bg-accent-900/50 text-accent-400' : ''}
                    ${results.testConfig.method === 'DELETE' ? 'bg-error-900/50 text-error-400' : ''}
                  `}>
                    {results.testConfig.method}
                  </span>
                </p>
              </div>
              <div>
                <p className="text-gray-400 mb-1">Test Duration</p>
                <p className="font-medium">
                  {formatDuration(results.summary.startTime, results.summary.endTime)}
                </p>
              </div>
              <div>
                <p className="text-gray-400 mb-1">Test completed at</p>
                <p className="font-medium">
                  {formatDate(results.summary.endTime)}
                </p>
              </div>
              <div>
                <p className="text-gray-400 mb-1">Config</p>
                <p className="font-medium">
                  {results.testConfig.rps} RPS for {results.testConfig.duration}
                </p>
              </div>
              <div>
                <p className="text-gray-400 mb-1">Status</p>
                <p className={`font-medium ${
                  results.summary.status === 'completed' ? 'text-success-500' : 
                  results.summary.status === 'failed' ? 'text-error-500' : 'text-warning-500'
                } flex items-center`}>
                  {results.summary.status === 'completed' ? (
                    <><CheckCircle className="h-4 w-4 mr-1" /> Completed</>
                  ) : results.summary.status === 'failed' ? (
                    <><XCircle className="h-4 w-4 mr-1" /> Failed</>
                  ) : (
                    <><Clock className="h-4 w-4 mr-1" /> Running</>
                  )}
                </p>
              </div>
            </div>
          </div>

          <h2 className="text-xl font-bold mb-4">Summary Metrics</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-gray-800/50 rounded-lg p-4">
              <p className="text-gray-400 text-sm mb-1">Total Requests</p>
              <p className="text-2xl font-bold text-white">
                {results.summary.totalRequests.toLocaleString()}
              </p>
            </div>
            
            <div className="bg-gray-800/50 rounded-lg p-4">
              <p className="text-gray-400 text-sm mb-1">Failed Requests</p>
              <p className={`text-2xl font-bold ${
                results.summary.failedRequests > 0 ? 'text-error-500' : 'text-success-500'
              }`}>
                {results.summary.failedRequests.toLocaleString()} 
                <span className="text-sm ml-1">
                  ({(results.summary.errorRate).toFixed(2)}%)
                </span>
              </p>
            </div>
            
            <div className="bg-gray-800/50 rounded-lg p-4">
              <p className="text-gray-400 text-sm mb-1">Avg. Latency</p>
              <p className="text-2xl font-bold text-white">
                {results.summary.avgLatency.toFixed(2)} ms
              </p>
            </div>
            
            <div className="bg-gray-800/50 rounded-lg p-4">
              <p className="text-gray-400 text-sm mb-1">P95 Latency</p>
              <p className="text-2xl font-bold text-white">
                {results.summary.p95Latency.toFixed(2)} ms
              </p>
            </div>
            
            <div className="bg-gray-800/50 rounded-lg p-4">
              <p className="text-gray-400 text-sm mb-1">P99 Latency</p>
              <p className="text-2xl font-bold text-white">
                {results.summary.p99Latency.toFixed(2)} ms
              </p>
            </div>
            
            <div className="bg-gray-800/50 rounded-lg p-4">
              <p className="text-gray-400 text-sm mb-1">Success Rate</p>
              <p className={`text-2xl font-bold ${
                results.summary.errorRate < 1 ? 'text-success-500' : 
                results.summary.errorRate < 5 ? 'text-warning-500' : 'text-error-500'
              }`}>
                {(100 - results.summary.errorRate).toFixed(2)}%
              </p>
            </div>
          </div>
        </Card>

        {/* Charts Section */}
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4 flex items-center">
            <BarChart3 className="mr-2 h-5 w-5 text-secondary-500" />
            Performance Metrics
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card>
              <ResultsCharts data={results} />
            </Card>
          </div>
        </div>
        
        {/* Export Results */}
        <div className="flex justify-end mb-8">
          <button className="flex items-center text-secondary-500 hover:text-secondary-400 px-4 py-2 border border-secondary-800 rounded-md">
            <DownloadCloud className="mr-2 h-5 w-5" />
            Export Results
          </button>
        </div>
      </>
    </div>
  );
};

export default TestResultsPage;