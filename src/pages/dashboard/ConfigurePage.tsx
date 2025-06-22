import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, useFieldArray } from 'react-hook-form';
import { Zap, Plus, Trash2, InfoIcon } from 'lucide-react';
import Card from '../../components/ui/Card';
import { runTest, TestConfig } from '../../services/api';

interface FormValues {
  targetUrl: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  headers: { key: string; value: string }[];
  body: string;
  rps: number;
  duration: string;
}

const ConfigurePage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      targetUrl: 'https://api.example.com',
      method: 'GET',
      headers: [{ key: 'Content-Type', value: 'application/json' }],
      body: '',
      rps: 10,
      duration: '10s',
    },
  });
  
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'headers',
  });
  
  const method = watch('method');
  
  const onSubmit = async (data: FormValues) => {
    setError(null);
    setIsLoading(true);

    try {
      const headers: Record<string, string> = {};
      data.headers.forEach(h => {
        if (h.key.trim() && h.value.trim()) {
          headers[h.key.trim()] = h.value.trim();
        }
      });

      const testConfig: TestConfig = {
        targetUrl: data.targetUrl,
        method: data.method,
        headers,
        rps: data.rps,
        duration: data.duration,
        body: data.body,
      };

      console.log('Test config being sent:', testConfig); // Debugging

      const testId = await runTest(testConfig);
      navigate(`/results/${testId}`);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('An unexpected error occurred');
      }
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold neon-text-cyan">Configure Test</h1>
        <p className="mt-1 text-gray-400">Create a new load test by configuring the parameters below</p>
      </div>
      
      <Card>
        {error && (
          <div className="mb-6 p-3 bg-error-900/50 border border-error-700 rounded-md text-error-400">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left column */}
            <div>
              {/* Target URL */}
              <div className="mb-6">
                <label htmlFor="targetUrl" className="block text-sm font-medium text-gray-300 mb-1">
                  Target URL *
                </label>
                <input
                  id="targetUrl"
                  type="url"
                  className={`input-field ${errors.targetUrl ? 'border-error-500' : ''}`}
                  placeholder="https://api.example.com"
                  {...register('targetUrl', {
                    required: 'Target URL is required',
                    pattern: {
                      value: /^https?:\/\/.+/,
                      message: 'Please enter a valid URL starting with http:// or https://',
                    },
                  })}
                />
                {errors.targetUrl && (
                  <p className="mt-1 text-sm text-error-500">{errors.targetUrl.message}</p>
                )}
              </div>
              
              {/* Method */}
              <div className="mb-6">
                <label htmlFor="method" className="block text-sm font-medium text-gray-300 mb-1">
                  Request Method *
                </label>
                <select
                  id="method"
                  className={`input-field ${errors.method ? 'border-error-500' : ''}`}
                  {...register('method', { required: 'Method is required' })}
                >
                  <option value="GET">GET</option>
                  <option value="POST">POST</option>
                  <option value="PUT">PUT</option>
                  <option value="DELETE">DELETE</option>
                </select>
                {errors.method && (
                  <p className="mt-1 text-sm text-error-500">{errors.method.message}</p>
                )}
              </div>
              
              {/* Headers */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-sm font-medium text-gray-300">
                    Headers
                  </label>
                  <button
                    type="button"
                    onClick={() => append({ key: '', value: '' })}
                    className="text-secondary-500 hover:text-secondary-400 text-sm flex items-center"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Header
                  </button>
                </div>
                
                {fields.map((field, index) => (
                  <div key={field.id} className="flex mb-2 space-x-2">
                    <input
                      placeholder="Key"
                      className="input-field"
                      {...register(`headers.${index}.key` as const)}
                    />
                    <input
                      placeholder="Value"
                      className="input-field"
                      {...register(`headers.${index}.value` as const)}
                    />
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="p-2 bg-gray-800 text-gray-400 hover:text-error-500 rounded-md"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                ))}
              </div>
              
              {/* Request Body (for POST/PUT) */}
              {(method === 'POST' || method === 'PUT') && (
                <div className="mb-6">
                  <label htmlFor="body" className="block text-sm font-medium text-gray-300 mb-1">
                    Request Body (JSON)
                  </label>
                  <textarea
                    id="body"
                    rows={6}
                    className={`input-field font-mono ${errors.body ? 'border-error-500' : ''}`}
                    placeholder={`{\n  "key": "value"\n}`}
                    {...register('body')}
                  />
                  {errors.body && (
                    <p className="mt-1 text-sm text-error-500">{errors.body.message}</p>
                  )}
                </div>
              )}
            </div>
            
            {/* Right column */}
            <div>
              {/* Load Test Parameters */}
              <h3 className="text-lg font-bold mb-4 text-white">Load Test Parameters</h3>
              
              {/* Requests per second */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-1">
                  <label htmlFor="rps" className="block text-sm font-medium text-gray-300">
                    Requests Per Second *
                  </label>
                  <div className="text-gray-500 flex items-center">
                    <InfoIcon className="h-4 w-4 mr-1" />
                    <span className="text-xs">Higher values create more load</span>
                  </div>
                </div>
                <input
                  id="rps"
                  type="number"
                  min="1"
                  max="1000"
                  className={`input-field ${errors.rps ? 'border-error-500' : ''}`}
                  {...register('rps', {
                    required: 'RPS is required',
                    min: {
                      value: 1,
                      message: 'RPS must be at least 1',
                    },
                    max: {
                      value: 1000,
                      message: 'RPS cannot exceed 1000',
                    },
                  })}
                />
                {errors.rps && (
                  <p className="mt-1 text-sm text-error-500">{errors.rps.message}</p>
                )}
              </div>
              
              {/* Duration */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-1">
                  <label htmlFor="duration" className="block text-sm font-medium text-gray-300">
                    Test Duration *
                  </label>
                </div>
                <select
                  id="duration"
                  className={`input-field ${errors.duration ? 'border-error-500' : ''}`}
                  {...register('duration', { required: 'Duration is required' })}
                >
                  <option value="5s">5 seconds</option>
                  <option value="10s">10 seconds</option>
                  <option value="30s">30 seconds</option>
                  <option value="1m">1 minute</option>
                  <option value="2m">2 minutes</option>
                  <option value="5m">5 minutes</option>
                </select>
                {errors.duration && (
                  <p className="mt-1 text-sm text-error-500">{errors.duration.message}</p>
                )}
              </div>
              
              {/* Info Card */}
              <div className="p-4 bg-primary-900/20 border border-primary-800/50 rounded-lg mb-6">
                <h4 className="text-primary-400 font-medium mb-2 flex items-center">
                  <InfoIcon className="h-5 w-5 mr-2" />
                  Test Information
                </h4>
                <p className="text-sm text-gray-300 mb-2">
                  This test will send a total of approximately{' '}
                  <span className="font-medium text-white">
                    {watch('rps') * parseInt(watch('duration') || '0') || 'N/A'}
                  </span>{' '}
                  requests to your target URL.
                </p>
                <p className="text-sm text-gray-400">
                  For production systems, start with lower values and gradually increase to avoid
                  overwhelming your services.
                </p>
              </div>
              
              {/* Submit */}
              <div className="mt-10">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="cyber-button w-full flex justify-center py-3 px-4"
                >
                  {isLoading ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Running Test...
                    </span>
                  ) : (
                    <span className="flex items-center">
                      <Zap className="mr-2 h-5 w-5" />
                      Run Load Test
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default ConfigurePage;