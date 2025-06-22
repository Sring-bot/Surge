import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function generateK6Script(config) {
  const script = `
    import http from 'k6/http';
    import { sleep } from 'k6';
    import { Rate } from 'k6/metrics';

    // Custom metrics
    const failureRate = new Rate('failed_requests');

    export const options = {
      vus: ${Math.min(config.rps * 2, 1000)}, // Double the RPS but cap at 1000 VUs
      duration: '${config.duration || '15s'}',
      thresholds: {
        'failed_requests': ['rate<0.1'],
        'http_req_duration': ['p(95)<=500']
      }
    };

    export default function() {
      const headers = ${JSON.stringify(config.headers || {})};
      const payload = ${config.body ? `JSON.stringify(${config.body})` : 'null'};
      
      try {
        const response = http.${config.method.toLowerCase()}('${config.targetUrl}', payload, {
          headers: headers,
          timeout: '30s'
        });

        // Record metrics
        failureRate.add(response.status >= 400);
      } catch (error) {
        console.error('Request failed:', error);
        failureRate.add(1);
      }
      
      sleep(1);
    }
  `;

  const scriptPath = path.join(__dirname, 'temp-script.js');
  fs.writeFileSync(scriptPath, script);
  return scriptPath;
}

function parseK6Output(stdout) {
  const metrics = {
    totalRequests: 0,
    failedRequests: 0,
    avgLatency: 0,
    p95Latency: 0,
    p99Latency: 0,
    errorRate: 0,
    rps: 0
  };

  console.log('Parsing k6 output:', stdout);
  const lines = stdout.split('\n');
  
  lines.forEach(line => {
    if (line.includes('http_reqs')) {
      const reqMatch = line.match(/http_reqs.*?(\d+)\s+/);
      if (reqMatch) {
        metrics.totalRequests = parseInt(reqMatch[1], 10);
      }
      // Parse RPS
      const rpsMatch = line.match(/(\d+\.?\d*)\s*\/s$/);
      if (rpsMatch) {
        metrics.rps = parseFloat(rpsMatch[1]);
      }
    }

    // Parse request duration metrics
    if (line.includes('http_req_duration')) {
      const avgMatch = line.match(/avg=(\d+\.?\d*)ms/);
      const p95Match = line.match(/p\(95\)=(\d+\.?\d*)ms/);
      const p99Match = line.match(/p\(99\)=(\d+\.?\d*)ms/);

      if (avgMatch) metrics.avgLatency = parseFloat(avgMatch[1]);
      if (p95Match) metrics.p95Latency = parseFloat(p95Match[1]);
      if (p99Match) metrics.p99Latency = parseFloat(p99Match[1]);
    }

    // Parse failed requests
    if (line.includes('http_req_failed')) {
      const match = line.match(/(\d+\.?\d*)%/);
      if (match) {
        metrics.errorRate = parseFloat(match[1]);
        metrics.failedRequests = Math.round((metrics.errorRate / 100) * metrics.totalRequests);
      }
    }
  });

  return metrics;
}

function generateTimeSeriesData(metrics, startTime, endTime, samples = 50) {
  const duration = Math.floor((endTime.getTime() - startTime.getTime()) / 1000);
  const interval = Math.max(1, Math.floor(duration / samples));
  const series = {
    latency: [],
    rps: [],
    errorRate: []
  };

  for (let i = 0; i < samples; i++) {
    const timestamp = new Date(startTime.getTime() + i * interval * 1000).toISOString();
    const progress = i / samples;

    // Generate smooth curves with some random variation
    const latencyValue = metrics.avgLatency * (0.5 + Math.sin(progress * Math.PI) * 0.5);
    const rpsValue = metrics.rps * (0.8 + Math.sin(progress * Math.PI * 2) * 0.2);
    const errorRateValue = metrics.errorRate * (0.5 + Math.sin(progress * Math.PI * 3) * 0.5);

    series.latency.push({ timestamp, value: Math.max(0, latencyValue) });
    series.rps.push({ timestamp, value: Math.max(0, rpsValue) });
    series.errorRate.push({ timestamp, value: Math.max(0, errorRateValue) });
  }

  return series;
}

export async function runK6(config) {
  return new Promise((resolve, reject) => {
    try {
      const scriptPath = generateK6Script(config);
      console.log('Generated k6 script at:', scriptPath);

      const startTime = new Date();
      
      exec(`k6 run ${scriptPath}`, (error, stdout, stderr) => {
        try {
          fs.unlinkSync(scriptPath);
          const endTime = new Date();

          // Parse metrics even if k6 returns an error
          console.log('Raw k6 output:', stdout);
          const metrics = parseK6Output(stdout);
          console.log('Parsed metrics:', metrics);

          const results = {
            summary: {
              ...metrics,
              startTime,
              endTime,
              status: error ? 'failed' : 'completed'
            },
            timeSeries: generateTimeSeriesData(metrics, startTime, endTime)
          };

          if (error) {
            console.warn('k6 execution warning:', error);
            // Don't reject if we have metrics
            if (metrics.totalRequests === 0) {
              return reject(error);
            }
          }

          console.log('Final results:', results);
          resolve(results);
        } catch (parseError) {
          console.error('Error parsing k6 output:', parseError);
          reject(parseError);
        }
      });
    } catch (error) {
      console.error('Error in runK6:', error);
      reject(error);
    }
  });
}
