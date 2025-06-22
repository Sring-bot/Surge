import express from 'express';
import Test from '../models/Test.js';
import auth from '../middleware/authMiddleware.js';
import { runK6 } from '../utils/runK6.js';

const router = express.Router();

// Run a new test
router.post('/run', auth, async (req, res) => {
  try {
    console.log('Received test config:', req.body);

    const test = await Test.create({
      userId: req.user.id,
      testConfig: req.body,
      summary: {
        status: 'running',
        startTime: new Date(),
      },
      createdAt: new Date()
    });

    // Execute test asynchronously
    runK6(req.body)
      .then(async (results) => {
        console.log('Test completed, updating results:', results);
        await Test.findByIdAndUpdate(test._id, {
          summary: {
            ...results.summary,
            status: 'completed'
          },
          timeSeries: results.timeSeries
        });
      })
      .catch(async (error) => {
        console.error('Test failed:', error);
        await Test.findByIdAndUpdate(test._id, {
          summary: {
            status: 'failed',
            error: error.message,
            endTime: new Date()
          }
        });
      });

    res.json({ id: test._id });
  } catch (error) {
    console.error('Error running test:', error);
    res.status(500).json({ error: 'Failed to run test' });
  }
});

// Create a new test
router.post('/create', async (req, res) => {
  try {
    const test = await Test.create(req.body);
    res.status(201).json(test);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create test' });
  }
});

// Fetch all tests
router.get('/', auth, async (req, res) => {
  try {
    console.log('Fetching tests for user:', req.user.id);
    const tests = await Test.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .lean(); // Add lean() for better performance

    const formattedTests = tests.map(test => ({
      id: test._id.toString(),
      targetUrl: test.testConfig?.targetUrl || '',
      method: test.testConfig?.method || 'GET',
      rps: test.testConfig?.rps || 0,
      duration: test.testConfig?.duration || '',
      createdAt: test.createdAt,
      status: test.summary?.status || 'completed'
    }));

    res.json(formattedTests);
  } catch (error) {
    console.error('Error fetching tests:', error);
    res.status(500).json({ error: 'Failed to fetch tests' });
  }
});

// Fetch test results by ID
router.get('/:id', auth, async (req, res) => {
  try {
    console.log('Fetching test result for ID:', req.params.id);
    console.log('Authenticated user:', req.user.id);
    
    const test = await Test.findById(req.params.id);
    
    if (!test) {
      return res.status(404).json({ error: 'Test not found' });
    }

    // Format the response
    const formattedResult = {
      testId: test._id,
      testConfig: {
        targetUrl: test.testConfig?.targetUrl || '',
        method: test.testConfig?.method || 'GET',
        headers: test.testConfig?.headers || {},
        body: test.testConfig?.body || '',
        rps: test.testConfig?.rps || 0,
        duration: test.testConfig?.duration || '',
      },
      summary: {
        totalRequests: test.summary?.totalRequests || 0,
        failedRequests: test.summary?.failedRequests || 0,
        avgLatency: test.summary?.avgLatency || 0,
        p95Latency: test.summary?.p95Latency || 0,
        p99Latency: test.summary?.p99Latency || 0,
        startTime: test.summary?.startTime || new Date(),
        endTime: test.summary?.endTime || new Date(),
        status: test.summary?.status || 'completed',
        errorRate: test.summary?.errorRate || 0
      },
      timeSeries: {
        latency: test.timeSeries?.latency || [],
        rps: test.timeSeries?.rps || [],
        errorRate: test.timeSeries?.errorRate || []
      }
    };

    console.log('Sending formatted result');
    res.json(formattedResult);
  } catch (error) {
    console.error('Error fetching test results:', error);
    res.status(500).json({ error: 'Failed to fetch test results' });
  }
});

// Add this route to handle test deletion
router.delete('/:id', auth, async (req, res) => {
  try {
    const testId = req.params.id;
    const userId = req.user.id;

    // Find and delete the test
    const test = await Test.findOneAndDelete({
      _id: testId,
      userId: userId
    });

    if (!test) {
      return res.status(404).json({ error: 'Test not found or unauthorized' });
    }

    // Send a proper JSON response
    res.status(200).json({ 
      success: true,
      message: 'Test deleted successfully',
      testId: testId 
    });
  } catch (error) {
    console.error('Error deleting test:', error);
    res.status(500).json({ error: 'Failed to delete test' });
  }
});

export default router;
