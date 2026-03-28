import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, User, Mail, ChevronRight, ShieldCheck } from 'lucide-react';

const ProfilePage = () => {
  const { user, profile, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  return (
    <div className="container animate-fade" style={{ paddingBottom: '110px' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ marginBottom: '0.5rem' }}>My Account</h1>
        <p style={{ color: 'var(--text-muted)' }}>Manage your profile and orders.</p>
      </div>

      <div className="card glass-morphism" style={{ padding: '2rem', marginBottom: '2rem', textAlign: 'center' }}>
        <div style={{ 
          width: '80px', 
          height: '80px', 
          borderRadius: '50%', 
          background: 'var(--primary-alpha)', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          margin: '0 auto 1.5rem',
          color: 'var(--primary)'
        }}>
          <User size={40} />
        </div>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{profile?.full_name || 'EatsGo User'}</h2>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: 'var(--text-muted)' }}>
          <Mail size={16} />
          <span>{user?.email}</span>
        </div>
        
        {isAdmin && (
          <div style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '6px', 
            marginTop: '1.5rem', 
            padding: '6px 12px', 
            background: 'var(--primary)', 
            color: 'white', 
            borderRadius: '12px',
            fontSize: '0.8rem',
            fontWeight: 700
          }}>
            <ShieldCheck size={14} /> Administrator Account
          </div>
        )}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <button 
          onClick={() => navigate(isAdmin ? '/admin' : '/menu')} 
          className="btn btn-secondary" 
          style={{ justifyContent: 'space-between', padding: '1.2rem', width: '100%' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ background: 'var(--primary-alpha)', padding: '8px', borderRadius: '10px' }}>
              <User size={20} color="var(--primary)" />
            </div>
            <span>{isAdmin ? 'Admin Dashboard' : 'Back to Menu'}</span>
          </div>
          <ChevronRight size={18} />
        </button>

        <button 
          onClick={handleLogout} 
          className="btn btn-secondary" 
          style={{ justifyContent: 'space-between', padding: '1.2rem', width: '100%', color: 'var(--danger)' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ background: 'rgba(239, 83, 80, 0.1)', padding: '8px', borderRadius: '10px' }}>
              <LogOut size={20} />
            </div>
            <span>Logout Account</span>
          </div>
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;
