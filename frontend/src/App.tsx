import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import { Toaster } from 'react-hot-toast';
import { Suspense } from 'react';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function AppRoutes() {
  const { token } = useAuth();
  
  return (
    <Routes>
      <Route path="/login" element={token ? <Navigate to="/dashboard" replace /> : <Login />} />
      <Route path="/register" element={token ? <Navigate to="/dashboard" replace /> : <Register />} />
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      } />
      <Route path="*" element={token ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Toaster position="top-right" />
          <Suspense fallback={<div>Loading...</div>}>
            <AppRoutes />
          </Suspense>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
