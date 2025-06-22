import { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import LoadingSpinner from './components/ui/LoadingSpinner';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';

// Lazy load pages for better performance
const HomePage = lazy(() => import('./pages/HomePage'));
const LoginPage = lazy(() => import('./pages/auth/LoginPage'));
const SignupPage = lazy(() => import('./pages/auth/SignupPage'));
const DashboardPage = lazy(() => import('./pages/dashboard/DashboardPage'));
const ConfigurePage = lazy(() => import('./pages/dashboard/ConfigurePage'));
const TestResultsPage = lazy(() => import('./pages/dashboard/TestResultsPage'));
const HistoryPage = lazy(() => import('./pages/dashboard/HistoryPage'));

function App() {
  return (
    <AuthProvider>
      <Layout>
        <Suspense fallback={
          <div className="min-h-screen flex items-center justify-center">
            <LoadingSpinner size="lg" message="Loading application..." />
          </div>
        }>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/configure" element={<ConfigurePage />} />
              <Route path="/results/:testId" element={<TestResultsPage />} />
              <Route path="/history" element={<HistoryPage />} />
            </Route>
            
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </Layout>
    </AuthProvider>
  );
}

export default App;