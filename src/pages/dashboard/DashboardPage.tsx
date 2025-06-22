import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Clock, Activity, AlertTriangle, Zap, PlusCircle } from 'lucide-react';
import Card from '../../components/ui/Card';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { getTestHistory, TestConfig } from '../../services/api';
import { useAuth } from '../../hooks/useAuth';

const DashboardPage = () => {
  const [tests, setTests] = useState<TestConfig[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const fetchTestHistory = async () => {
      if (!user) {
        navigate('/login');
        return;
      }
      
      try {
        setIsLoading(true);
        setError(null);
        const history = await getTestHistory();
        setTests(history);
      } catch (error) {
        console.error('Error fetching test history:', error);
        const errorMessage = error instanceof Error ? error.message : 'Failed to fetch test history';
        setError(errorMessage);
        if (errorMessage.includes('authentication')) {
          navigate('/login');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchTestHistory();
  }, [navigate, user]);

  // Early return for loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" message="Loading dashboard..." />
      </div>
    );
  }

  // Return error state if there's an error
  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="p-6 bg-error-900/30 border border-error-800 rounded-lg text-center">
          <AlertTriangle className="h-10 w-10 text-error-500 mx-auto" />
          <h3 className="mt-2 text-xl font-medium text-white">Error</h3>
          <p className="mt-1 text-gray-400">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-md text-white"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDuration = (duration: string) => {
    if (duration.endsWith('s')) {
      return `${duration} seconds`;
    }
    if (duration.endsWith('m')) {
      return `${duration} minutes`;
    }
    return duration;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold neon-text">Dashboard</h1>
          <p className="mt-1 text-gray-400">Monitor your load test results</p>
        </div>
        <div className="mt-4 md:mt-0">
          <Link to="/configure" className="cyber-button flex items-center">
            <PlusCircle className="mr-2 h-4 w-4" />
            New Test
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-gradient-to-br from-gray-900 to-gray-950">
          <div className="flex items-center">
            <div className="rounded-full p-3 bg-primary-900/50">
              <Activity className="h-6 w-6 text-primary-500" />
            </div>
            <div className="ml-4">
              <p className="text-gray-400 text-sm">Total Tests</p>
              <h3 className="text-2xl font-bold text-white">{tests.length}</h3>
            </div>
          </div>
        </Card>
        
        <Card className="bg-gradient-to-br from-gray-900 to-gray-950">
          <div className="flex items-center">
            <div className="rounded-full p-3 bg-secondary-900/50">
              <Clock className="h-6 w-6 text-secondary-500" />
            </div>
            <div className="ml-4">
              <p className="text-gray-400 text-sm">Recent Tests</p>
              <h3 className="text-2xl font-bold text-white">
                {tests.filter(t => new Date(t.createdAt || 0) > new Date(Date.now() - 24 * 60 * 60 * 1000)).length}
              </h3>
            </div>
          </div>
        </Card>
        
        <Card className="bg-gradient-to-br from-gray-900 to-gray-950">
          <div className="flex items-center">
            <div className="rounded-full p-3 bg-accent-900/50">
              <Zap className="h-6 w-6 text-accent-500" />
            </div>
            <div className="ml-4">
              <p className="text-gray-400 text-sm">Highest RPS Test</p>
              <h3 className="text-2xl font-bold text-white">
                {tests.length > 0 ? Math.max(...tests.map(t => t.rps)) : 0} RPS
              </h3>
            </div>
          </div>
        </Card>
      </div>

      {/* Recent Tests */}
      <h2 className="text-xl font-bold mb-4 text-white">Recent Tests</h2>
      <Card>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-800">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Test
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Method
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  RPS
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Duration
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {tests.slice(0, 5).map((test) => (
                <tr key={test.id} className="hover:bg-gray-800/50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-200">
                    {new URL(test.targetUrl).hostname}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    <span className={`
                      inline-flex px-2 py-1 text-xs rounded
                      ${test.method === 'GET' ? 'bg-primary-900/50 text-primary-400' : ''}
                      ${test.method === 'POST' ? 'bg-secondary-900/50 text-secondary-400' : ''}
                      ${test.method === 'PUT' ? 'bg-accent-900/50 text-accent-400' : ''}
                      ${test.method === 'DELETE' ? 'bg-error-900/50 text-error-400' : ''}
                    `}>
                      {test.method}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {test.rps} RPS
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {formatDuration(test.duration)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {formatDate(test.createdAt || '')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link
                      to={`/results/${test.id}`}
                      className="text-primary-500 hover:text-primary-400"
                    >
                      View Details
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {tests.length > 5 && (
          <div className="px-6 py-4 border-t border-gray-800">
            <Link
              to="/history"
              className="text-primary-500 hover:text-primary-400 font-medium"
            >
              View All Tests
            </Link>
          </div>
        )}

        {tests.length === 0 && (
          <div className="px-6 py-12 text-center">
            <p className="text-gray-400">No tests found. Start by creating a new test.</p>
            <Link
              to="/configure"
              className="cyber-button mt-4 inline-flex items-center"
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              New Test
            </Link>
          </div>
        )}
      </Card>
    </div>
  );
};

export default DashboardPage;