import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, Trash2, Loader } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import Card from '../../components/ui/Card';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { getTestHistory, deleteTest, TestConfig } from '../../services/api';

const HistoryPage = () => {
  const [tests, setTests] = useState<TestConfig[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [deletingIds, setDeletingIds] = useState<Set<string>>(new Set());
  const [testToDelete, setTestToDelete] = useState<string | null>(null);

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleString();
  };

  const formatDuration = (duration: string) => {
    if (!duration) return '';
    return duration.replace('s', ' seconds').replace('m', ' minutes');
  };

  const handleDelete = async (testId: string) => {
    if (!testId) return;
    
    try {
      setDeletingIds(prev => new Set(prev).add(testId));
      await deleteTest(testId);
      setTests(prevTests => prevTests.filter(test => test.id !== testId));
      toast.success('Test deleted successfully');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete test';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setDeletingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(testId);
        return newSet;
      });
      setTestToDelete(null);
    }
  };

  const confirmDelete = (testId: string) => {
    if (!testId) return;
    setTestToDelete(testId);
  };

  const handleDeleteConfirmed = async () => {
    if (testToDelete) {
      await handleDelete(testToDelete);
    }
  };

  useEffect(() => {
    const fetchTestHistory = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const history = await getTestHistory();
        setTests(history);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to fetch test history';
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTestHistory();
  }, []);

  const filteredTests = tests.filter(test => {
    const searchLower = searchTerm.toLowerCase();
    return (
      test.targetUrl?.toLowerCase().includes(searchLower) ||
      test.method?.toLowerCase().includes(searchLower) ||
      test.duration?.toLowerCase().includes(searchLower)
    );
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" message="Loading test history..." />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold neon-text mb-2">Test History</h1>
      <p className="text-gray-400 mb-8">View and analyze your previous load tests</p>

      {error ? (
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
      ) : (
        <>
          {/* Search Bar */}
          <div className="mb-6">
            <input
              type="text"
              placeholder="Search by URL, method, or duration..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field"
            />
          </div>

          <Card>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-800">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Target URL
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
                  {filteredTests.length > 0 ? (
                    filteredTests.map((test) => (
                      <tr key={test.id} className="hover:bg-gray-800/50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-200">
                          {test.targetUrl}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
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
                          {test.rps || 0} RPS
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                          {formatDuration(test.duration || '')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                          {formatDate(test.createdAt || '')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end space-x-3">
                            <Link
                              to={`/results/${test.id}`}
                              className="text-primary-500 hover:text-primary-400"
                            >
                              View Details
                            </Link>
                            <button 
                              onClick={() => confirmDelete(test.id || '')}
                              disabled={deletingIds.has(test.id || '')}
                              className={`text-error-500 hover:text-error-400 transition-colors duration-200 
                                ${deletingIds.has(test.id || '') ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                              {deletingIds.has(test.id || '') ? (
                                <Loader className="h-4 w-4 animate-spin" />
                              ) : (
                                <Trash2 className="h-4 w-4" />
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="px-6 py-4 text-center text-gray-400">
                        {searchTerm ? 'No tests match your search criteria' : 'No tests have been run yet'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </>
      )}

      {/* Delete Confirmation Modal */}
      {testToDelete && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-gray-900 border border-gray-800 rounded-lg p-6 max-w-md w-full mx-4"
          >
            <h3 className="text-xl font-bold mb-4">Confirm Delete</h3>
            <p className="text-gray-400 mb-6">
              Are you sure you want to delete this test? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setTestToDelete(null)}
                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-md text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirmed}
                className="px-4 py-2 bg-error-600 hover:bg-error-700 rounded-md text-white"
              >
                Delete
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default HistoryPage;