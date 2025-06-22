import mongoose from 'mongoose';

const timeSeriesPointSchema = new mongoose.Schema({
  timestamp: {
    type: Date,
    required: true
  },
  value: {
    type: Number,
    required: true,
    min: 0
  }
}, { _id: false });

const testSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  testConfig: {
    targetUrl: String,
    method: String,
    headers: Object,
    body: String,
    rps: Number,
    duration: String
  },
  summary: {
    totalRequests: { type: Number, default: 0 },
    failedRequests: { type: Number, default: 0 },
    avgLatency: { type: Number, default: 0 },
    p95Latency: { type: Number, default: 0 },
    p99Latency: { type: Number, default: 0 },
    errorRate: { type: Number, default: 0 },
    rps: { type: Number, default: 0 },
    startTime: Date,
    endTime: Date,
    status: {
      type: String,
      enum: ['running', 'completed', 'failed'],
      default: 'running'
    }
  },
  timeSeries: {
    latency: [timeSeriesPointSchema],
    rps: [timeSeriesPointSchema],
    errorRate: [timeSeriesPointSchema]
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Test', testSchema);
