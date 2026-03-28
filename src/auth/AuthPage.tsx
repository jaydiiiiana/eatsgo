import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import LoginView from './LoginView';
import RegisterView from './RegisterView';

const AuthPage = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogin = async (identifier: string, pass: string) => {
    setLoading(true);
    setError(null);
    try {
      let email = identifier;
      
      // If it looks like a PH phone number (starts with 09 and is digits)
      if (/^09\d{9}$/.test(identifier)) {
        const { data: rpcData, error: rpcError } = await supabase
          .rpc('get_email_by_phone', { phone: identifier });
        
        if (rpcError) throw rpcError;
        if (!rpcData) throw new Error('No account found with this contact number');
        email = rpcData;
      }

      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password: pass,
      });
      if (signInError) throw signInError;
      navigate('/');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };


  const handleRegister = async (email: string, pass: string, name: string, contact: string) => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password: pass,
        options: {
          data: {
            full_name: name,
            contact_number: contact,
          }
        }
      });
      
      if (signUpError) throw signUpError;
      
      if (data.user) {
        await supabase
          .from('profiles')
          .insert([
            { id: data.user.id, full_name: name, contact_number: contact, role: 'customer' }
          ]);
      }
      
      alert('Registration successful! Please check your email for confirmation.');
      setIsSignUp(false);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade" style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center',
      padding: '2rem 1rem',
      background: 'linear-gradient(135deg, #FAF9F6 0%, #EFEBE9 100%)'
    }}>
      <header style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <div style={{ 
          background: 'var(--primary)', 
          width: '72px', 
          height: '72px', 
          borderRadius: '24px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          margin: '0 auto 1.5rem',
          boxShadow: '0 12px 24px -6px rgba(141, 110, 99, 0.4)'
        }}>
          <h1 style={{ color: 'white', fontSize: '2.5rem', margin: 0, fontFamily: 'Outfit' }}>E</h1>
        </div>
        <h1 style={{ fontSize: '2.8rem', color: 'var(--text-main)', marginBottom: '0.5rem', letterSpacing: '-0.05em' }}>EatsGo</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', fontWeight: 500 }}>Boutique Delivery Experience</p>
      </header>

      <div className="card glass-morphism" style={{ 
        width: '100%', 
        maxWidth: '440px', 
        padding: '3rem',
        boxShadow: 'var(--shadow-lg)',
        border: '1px solid rgba(141, 110, 99, 0.1)'
      }}>
        <h2 style={{ marginBottom: '2.5rem', textAlign: 'center', fontSize: '2rem' }}>
          {isSignUp ? 'Create Account' : 'Welcome Back'}
        </h2>

        {error && (
          <div style={{ 
            background: '#FEF2F2', 
            color: 'var(--danger)', 
            padding: '1rem', 
            borderRadius: 'var(--radius-md)', 
            marginBottom: '1.5rem', 
            fontSize: '0.9rem',
            border: '1px solid #FEE2E2',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <span style={{ fontWeight: 'bold' }}>!</span> {error}
          </div>
        )}

        {isSignUp ? (
          <RegisterView onRegister={handleRegister} loading={loading} />
        ) : (
          <LoginView onLogin={handleLogin} loading={loading} />
        )}

        <div style={{ marginTop: '2rem', textAlign: 'center' }}>
          <button 
            type="button" 
            onClick={() => setIsSignUp(!isSignUp)}
            style={{ 
              background: 'none', 
              border: 'none', 
              color: 'var(--primary)', 
              cursor: 'pointer', 
              fontWeight: '700',
              fontSize: '0.95rem'
            }}
          >
            {isSignUp ? 'Already have an account? Login' : "Don't have an account? Sign Up"}
          </button>
        </div>
      </div>
      
      <footer style={{ marginTop: '4rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
        &copy; 2024 EatsGo Delivery. All rights reserved.
      </footer>
    </div>
  );
};

export default AuthPage;
