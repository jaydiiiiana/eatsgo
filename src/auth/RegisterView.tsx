import React, { useState } from 'react';
import { UserPlus, Mail, Lock, Smartphone } from 'lucide-react';

interface RegisterViewProps {
  onRegister: (email: string, pass: string, name: string, contact: string) => Promise<void>;
  loading: boolean;
}

const RegisterView: React.FC<RegisterViewProps> = ({ onRegister, loading }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [contactNo, setContactNo] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);

  // Password Validation States
  const hasEightChars = password.length >= 8;
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const isPassValid = hasEightChars && hasUpper && hasLower;

  // Contact Validation
  const isPhNumber = /^09[0-9]{9}$/.test(contactNo);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    // Basic Name Validation
    if (fullName.length < 2) {
      setLocalError('Please enter your full name.');
      return;
    }

    // Contact Validation
    if (!isPhNumber) {
      setLocalError('Contact number must be 11 digits (e.g., 09123456789).');
      return;
    }

    // Password Validation
    if (!isPassValid) {
      setLocalError('Password must meet all requirements below.');
      return;
    }

    onRegister(email, password, fullName, contactNo);
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {localError && (
        <div style={{ 
          background: '#FEF2F2', 
          color: 'var(--danger)', 
          padding: '0.8rem 1rem', 
          borderRadius: 'var(--radius-md)', 
          fontSize: '0.85rem',
          border: '1px solid #FEE2E2' 
        }}>
          {localError}
        </div>
      )}

      <div style={{ position: 'relative' }}>
        <div style={{ position: 'absolute', top: '50%', left: '1.2rem', transform: 'translateY(-50%)', color: 'var(--text-muted)', zIndex: 1 }}>
          <UserPlus size={20} />
        </div>
        <input 
          type="text" 
          placeholder="Full Name" 
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          style={{ paddingLeft: '3.5rem' }}
          required 
        />
      </div>

      <div style={{ position: 'relative' }}>
        <div style={{ position: 'absolute', top: '50%', left: '1.2rem', transform: 'translateY(-50%)', color: 'var(--text-muted)', zIndex: 1 }}>
          <Smartphone size={20} />
        </div>
        <input 
          type="tel" 
          placeholder="Contact No. (09...)" 
          value={contactNo}
          onChange={(e) => setContactNo(e.target.value)}
          style={{ paddingLeft: '3.5rem' }}
          maxLength={11}
          required 
        />
      </div>

      <div style={{ position: 'relative' }}>
        <div style={{ position: 'absolute', top: '50%', left: '1.2rem', transform: 'translateY(-50%)', color: 'var(--text-muted)', zIndex: 1 }}>
          <Mail size={20} />
        </div>
        <input 
          type="email" 
          placeholder="Email Address" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ paddingLeft: '3.5rem' }}
          required 
        />
      </div>

      <div style={{ position: 'relative' }}>
        <div style={{ position: 'absolute', top: '50%', left: '1.2rem', transform: 'translateY(-50%)', color: 'var(--text-muted)', zIndex: 1 }}>
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

      {/* Validation Checklist */}
      <div style={{ 
        padding: '1rem', 
        background: 'rgba(15, 23, 42, 0.03)', 
        borderRadius: 'var(--radius-md)', 
        fontSize: '0.8rem', 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '0.6rem',
        border: '1px solid rgba(0,0,0,0.02)'
      }}>
        <div style={{ color: isPhNumber ? 'var(--success)' : 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: isPhNumber ? 'var(--success)' : '#CBD5E1', transition: '0.3s' }}></div>
          Valid PH number (e.g. 0912...)
        </div>
        <div style={{ color: hasEightChars ? 'var(--success)' : 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: hasEightChars ? 'var(--success)' : '#CBD5E1', transition: '0.3s' }}></div>
          Min 8 characters
        </div>
        <div style={{ color: hasUpper ? 'var(--success)' : 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: hasUpper ? 'var(--success)' : '#CBD5E1', transition: '0.3s' }}></div>
          One UPPER CASE letter
        </div>
        <div style={{ color: hasLower ? 'var(--success)' : 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: hasLower ? 'var(--success)' : '#CBD5E1', transition: '0.3s' }}></div>
          One lower case letter
        </div>
      </div>

      <button 
        type="submit" 
        className="btn btn-primary" 
        disabled={loading || !isPassValid || !isPhNumber || fullName.length < 2} 
        style={{ width: '100%', marginTop: '0.5rem', height: '54px' }}
      >
        {loading ? 'Creating Account...' : 'Get Started'}
        {!loading && <UserPlus size={20} />}
      </button>
    </form>
  );
};

export default RegisterView;
