import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Home from './pages/Home';
import AuthPage from './auth/AuthPage';
import AdminDashboard from './admin/AdminDashboard';
import CartPage from './pages/Cart';
import Navigation from './components/Navigation';
import ProfilePage from './pages/Profile';
import LandingPage from './pages/LandingPage';

const ProtectedRoute = ({ children, adminOnly = false }: { children: React.ReactNode, adminOnly?: boolean }) => {
  const { user, isAdmin, loading } = useAuth();
  
  if (loading) {
    return (
      <div style={{ 
        height: '80vh', 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center', 
        gap: '1.5rem' 
      }}>
        <div className="pulse" style={{ 
          background: 'var(--primary)', 
          width: '60px', 
          height: '60px', 
          borderRadius: '20px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          boxShadow: '0 10px 20px -5px rgba(141, 110, 99, 0.3)'
        }}>
          <span style={{ color: 'white', fontWeight: 800, fontSize: '2rem' }}>E</span>
        </div>
        <span style={{ color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.9rem', letterSpacing: '0.05em' }}>PREPARING YOUR EXPERIENCE...</span>
      </div>
    );
  }
  
  if (!user) return <Navigate to="/login" />;
  if (adminOnly && !isAdmin) return <Navigate to="/" />;
  
  return <>{children}</>;
};

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div className="app-shell">
            <main style={{ minHeight: '100vh' }}>
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
                  path="/profile" 
                  element={
                    <ProtectedRoute>
                      <ProfilePage />
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
            </main>
            <Navigation />
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
