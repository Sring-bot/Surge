const API_BASE_URL = 'http://localhost:5000/api';

export interface TestConfig {
  id?: string;
  targetUrl: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  headers?: Record<string, string>;
  body?: string;
  rps: number;
  duration: string;
  createdAt?: string;
  userId?: string;
}

export interface DetailedTestResults {
  testId: string;
  testConfig: TestConfig;
  summary: {
    totalRequests: number;
    failedRequests: number;
    avgLatency: number;
    p95Latency: number;
    p99Latency: number;
    startTime: string;
    endTime: string;
    status: 'running' | 'completed' | 'failed';
    errorRate: number;
  };
  timeSeries: {
    latency: { timestamp: string; value: number }[];
    rps: { timestamp: string; value: number }[];
    errorRate: { timestamp: string; value: number }[];
  };
}

// Run a new test
export const runTest = async (config: TestConfig): Promise<string> => {
  try {
    const response = await fetch(`${API_BASE_URL}/tests/run`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('boltToken')}`,
      },
      body: JSON.stringify({
        targetUrl: config.targetUrl,
        method: config.method,
        headers: config.headers || {},
        rps: parseInt(config.rps.toString()),
        duration: config.duration,
        body: config.body || null,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to run test');
    }

    const data = await response.json();
    return data.id;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// Fetch detailed test results
export const getTestResult = async (testId: string): Promise<DetailedTestResults> => {
  try {
    const token = localStorage.getItem('boltToken');
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(`${API_BASE_URL}/tests/${testId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to fetch test results');
    }

    const data = await response.json();

    if (!data.summary || !data.timeSeries) {
      throw new Error('Invalid test results format');
    }

    return data;
  } catch (error) {
    console.error('Error fetching test results:', error);
    throw error;
  }
};

// Fetch test history
export const getTestHistory = async (): Promise<TestConfig[]> => {
  try {
    const token = localStorage.getItem('boltToken');
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(`${API_BASE_URL}/tests`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (response.status === 401) {
      localStorage.removeItem('boltToken');
      throw new Error('Authentication expired. Please login again.');
    }

    if (!response.ok) {
      throw new Error('Failed to fetch test history');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching test history:', error);
    throw error;
  }
};

// Add this function to handle test deletion
export const deleteTest = async (testId: string): Promise<void> => {
  try {
    const token = localStorage.getItem('boltToken');
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(`${API_BASE_URL}/tests/${testId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to delete test');
    }

    const data = await response.json();
    if (!data.success) {
      throw new Error(data.message || 'Failed to delete test');
    }
  } catch (error) {
    console.error('Error deleting test:', error);
    throw error;
  }
};