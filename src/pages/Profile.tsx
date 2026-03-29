import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, User, Mail, ChevronRight, ShieldCheck, Edit2, Check, X } from 'lucide-react';
import { supabase } from '../lib/supabase';

const ProfilePage = () => {
  const { user, profile, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    full_name: profile?.full_name || '',
    email: user?.email || ''
  });

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const isMaster = localStorage.getItem('eatsgo_master_session') === 'true';
      
      if (isMaster) {
        // Update Master Admin Mock Session
        localStorage.setItem('eatsgo_admin_email', formData.email);
        localStorage.setItem('eatsgo_admin_name', formData.full_name);
        
        // Also try to update DB profile if possible
        await supabase
          .from('profiles')
          .update({ full_name: formData.full_name })
          .eq('id', user?.id);
      } else {
        // Standard User Update
        const { error } = await supabase
          .from('profiles')
          .update({ full_name: formData.full_name })
          .eq('id', user?.id);
        if (error) throw error;
      }

      setIsEditing(false);
      window.location.reload(); // Refresh to apply changes across context
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container animate-fade" style={{ paddingBottom: '110px' }}>
      <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1 style={{ marginBottom: '0.5rem' }}>My Account</h1>
          <p style={{ color: 'var(--text-muted)' }}>Manage your profile and orders.</p>
        </div>
        {!isEditing && (
          <button 
            onClick={() => setIsEditing(true)}
            style={{ 
              background: 'var(--primary-alpha)', 
              color: 'var(--primary)', 
              border: 'none', 
              padding: '8px 16px', 
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontWeight: 700,
              fontSize: '0.85rem'
            }}
          >
            <Edit2 size={16} /> Edit
          </button>
        )}
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

        {isEditing ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', textAlign: 'left' }}>
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px', display: 'block' }}>Full Name</label>
              <input 
                value={formData.full_name}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                placeholder="Your Name"
              />
            </div>
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px', display: 'block' }}>Contact Email</label>
              <input 
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="Email Address"
              />
            </div>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
              <button 
                className="btn btn-primary" 
                style={{ flex: 1 }} 
                onClick={handleSave}
                disabled={loading}
              >
                {loading ? 'Saving...' : <><Check size={18} /> Save</>}
              </button>
              <button 
                className="btn btn-secondary" 
                style={{ flex: 1 }} 
                onClick={() => setIsEditing(false)}
              >
                <X size={18} /> Cancel
              </button>
            </div>
          </div>
        ) : (
          <>
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
          </>
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
