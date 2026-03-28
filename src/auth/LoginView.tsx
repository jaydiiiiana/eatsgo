import React, { useState } from 'react';
import { LogIn, Smartphone, Mail, Lock } from 'lucide-react';

interface LoginViewProps {
  onLogin: (identifier: string, pass: string) => Promise<void>;
  loading: boolean;
}

const LoginView: React.FC<LoginViewProps> = ({ onLogin, loading }) => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(identifier, password);
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div style={{ position: 'relative' }}>
        <div style={{ 
          position: 'absolute', 
          top: '50%', 
          left: '1.2rem', 
          transform: 'translateY(-50%)', 
          color: 'var(--text-muted)',
          zIndex: 1
        }}>
          {identifier.includes('@') ? <Mail size={20} /> : <Smartphone size={20} />}
        </div>
        <input 
          type="text" 
          placeholder="Email or Contact Number" 
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          style={{ paddingLeft: '3.5rem' }}
          required 
        />
      </div>

      <div style={{ position: 'relative' }}>
        <div style={{ 
          position: 'absolute', 
          top: '50%', 
          left: '1.2rem', 
          transform: 'translateY(-50%)', 
          color: 'var(--text-muted)',
          zIndex: 1
        }}>
          <Lock size={20} />
        </div>
        <input 
          type="password" 
          placeholder="Password" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ paddingLeft: '3.5rem' }}
          required 
        />
      </div>

      <button 
        type="submit" 
        className="btn btn-primary" 
        disabled={loading} 
        style={{ width: '100%', marginTop: '0.5rem', height: '54px' }}
      >
        {loading ? 'Authenticating...' : 'Sign In'}
        {!loading && <LogIn size={20} />}
      </button>
    </form>
  );
};

export default LoginView;
