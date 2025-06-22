import { useRef } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartData,
  ChartOptions
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { DetailedTestResults } from '../../services/api';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface ResultsChartsProps {
  data: DetailedTestResults;
}

const ResultsCharts = ({ data }: ResultsChartsProps) => {
  const chartRef = useRef<ChartJS<"line">>(null);

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString();
  };

  const chartData: ChartData<'line'> = {
    labels: data.timeSeries.latency.map(point => formatTimestamp(point.timestamp)),
    datasets: [
      {
        label: 'Latency (ms)',
        data: data.timeSeries.latency.map(point => point.value),
        borderColor: 'rgb(59, 91, 255)',
        backgroundColor: 'rgba(59, 91, 255, 0.1)',
        fill: true,
        tension: 0.4,
        yAxisID: 'y-latency',
      },
      {
        label: 'Requests per Second',
        data: data.timeSeries.rps.map(point => point.value),
        borderColor: 'rgb(30, 188, 255)',
        backgroundColor: 'rgba(30, 188, 255, 0.1)',
        fill: true,
        tension: 0.4,
        yAxisID: 'y-rps',
      },
      {
        label: 'Error Rate (%)',
        data: data.timeSeries.errorRate.map(point => point.value),
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.1)',
        fill: true,
        tension: 0.4,
        yAxisID: 'y-error',
      },
    ],
  };

  const chartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 0
    },
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#e5e7eb',
          font: {
            family: "'Inter', sans-serif"
          }
        }
      },
      tooltip: {
        mode: 'index',
        intersect: false,
      }
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(75, 85, 99, 0.2)',
        },
        ticks: {
          color: '#9ca3af',
          maxRotation: 45,
          minRotation: 45,
        }
      },
      'y-latency': {
        type: 'linear',
        display: true,
        position: 'left',
        title: {
          display: true,
          text: 'Latency (ms)',
          color: '#e5e7eb'
        },
        grid: {
          color: 'rgba(75, 85, 99, 0.2)',
        },
        ticks: {
          color: '#9ca3af',
        }
      },
      'y-rps': {
        type: 'linear',
        display: true,
        position: 'right',
        title: {
          display: true,
          text: 'Requests per Second',
          color: '#e5e7eb'
        },
        grid: {
          drawOnChartArea: false,
        },
        ticks: {
          color: '#9ca3af',
        }
      },
      'y-error': {
        type: 'linear',
        display: true,
        position: 'right',
        title: {
          display: true,
          text: 'Error Rate (%)',
          color: '#e5e7eb'
        },
        grid: {
          drawOnChartArea: false,
        },
        ticks: {
          color: '#9ca3af',
        }
      },
    }
  };

  return (
    <div className="h-[400px]">
      <Line 
        ref={chartRef}
        data={chartData} 
        options={chartOptions}
      />
    </div>
  );
};

export default ResultsCharts;