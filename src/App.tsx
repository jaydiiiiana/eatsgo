import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Home from './pages/Home';
import AuthPage from './auth/AuthPage';
import AdminDashboard from './admin/AdminDashboard';
import CartPage from './pages/Cart';
import Navigation from './components/Navigation';

const ProtectedRoute = ({ children, adminOnly = false }: { children: React.ReactNode, adminOnly?: boolean }) => {
  const { user, isAdmin, loading } = useAuth();
  
  if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  if (adminOnly && !isAdmin) return <Navigate to="/" />;
  
  return <>{children}</>;
};

import LandingPage from './pages/LandingPage';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div className="app-shell">
            <main style={{ minHeight: '100vh' }}>
              <div className="container" style={{ paddingBottom: '120px', paddingTop: '1.5rem' }}>
                <Routes>
                  <Route path="/login" element={<AuthPage />} />
                  <Route path="/" element={<LandingPage />} />
                  <Route 
                    path="/menu" 
                    element={
                      <ProtectedRoute>
                        <Home />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/cart" 
                    element={
                      <ProtectedRoute>
                        <CartPage />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/admin/*" 
                    element={
                      <ProtectedRoute adminOnly>
                        <AdminDashboard />
                      </ProtectedRoute>
                    } 
                  />
                  <Route path="*" element={<Navigate to="/" />} />
                </Routes>
              </div>
            </main>
            <Navigation />
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
