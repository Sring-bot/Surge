import { Link } from 'react-router-dom';
import { Server, Zap, LineChart, Lock, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const HomePage = () => {
  const { isAuthenticated } = useAuth();

  const renderAuthButtons = () => {
    if (isAuthenticated) {
      return (
        <Link
          to="/dashboard"
          className="cyber-button inline-flex items-center text-base px-8 py-3"
        >
          Go to Dashboard
          <ArrowRight className="ml-2 h-5 w-5" />
        </Link>
      );
    }

    return (
      <div className="flex justify-center space-x-4">
        <Link
          to="/signup"
          className="cyber-button inline-flex items-center text-base px-8 py-3"
        >
          Get Started
          <ArrowRight className="ml-2 h-5 w-5" />
        </Link>
        <Link
          to="/login"
          className="cyber-button inline-flex items-center text-base px-8 py-3"
        >
          Login
          <ArrowRight className="ml-2 h-5 w-5" />
        </Link>
      </div>
    );
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-radial from-primary-900/20 to-transparent"></div>
        
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6">
              <span className="neon-text">SURGE</span>⚡
              <span className="block mt-2">Load Testing Platform</span>
            </h1>
            <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-300 sm:mt-5">
              Push your applications to the limit. Discover performance bottlenecks before your users do.
            </p>
            <div className="mt-10">
              {renderAuthButtons()}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold neon-text-cyan">Features</h2>
            <p className="mt-4 text-xl text-gray-400">
              Everything you need to thoroughly test your applications
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature cards */}
            <div className="cyber-card p-6 transition-all duration-300 hover:shadow-neon-primary">
              <div className="text-primary-500 mb-4">
                <Server className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-bold mb-2">Powerful Load Testing</h3>
              <p className="text-gray-400">
                Simulate thousands of virtual users to stress test your applications and APIs.
              </p>
            </div>

            <div className="cyber-card p-6 transition-all duration-300 hover:shadow-neon-secondary">
              <div className="text-secondary-500 mb-4">
                <LineChart className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-bold mb-2">Real-time Metrics</h3>
              <p className="text-gray-400">
                Monitor response times, throughput, and error rates in real-time with beautiful visualizations.
              </p>
            </div>

            <div className="cyber-card p-6 transition-all duration-300 hover:shadow-neon-accent">
              <div className="text-accent-500 mb-4">
                <Lock className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-bold mb-2">Secure Test History</h3>
              <p className="text-gray-400">
                All your test results are securely stored and easily accessible for future reference.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {!isAuthenticated && (
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-gray-900 to-gray-950">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-8">
              <span className="neon-text-purple">Ready to test your limits?</span>
            </h2>
            <Link
              to="/signup"
              className="cyber-button inline-flex items-center text-base px-8 py-3"
            >
              <Zap className="mr-2 h-5 w-5" />
              Sign Up Free
            </Link>
          </div>
        </section>
      )}
    </div>
  );
};

export default HomePage;