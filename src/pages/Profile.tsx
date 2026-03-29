import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, User, Mail, ChevronRight, ShieldCheck, Check, MapPin, Phone, Settings } from 'lucide-react';
import { supabase } from '../lib/supabase';

const ProfilePage = () => {
  const { user, profile, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    full_name: profile?.full_name || '',
    email: user?.email || '',
    contact_number: profile?.contact_number || '',
    location: profile?.location || ''
  });

  const handleLogout = async () => {
    try {
      await signOut();
      // AuthContext handles redirect
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
        
        // Also update DB profile for location and name
        await supabase
          .from('profiles')
          .update({ 
            full_name: formData.full_name,
            contact_number: formData.contact_number,
            location: formData.location 
          })
          .eq('id', user?.id);
      } else {
        // Standard User Update
        const { error } = await supabase
          .from('profiles')
          .update({ 
            full_name: formData.full_name,
            contact_number: formData.contact_number,
            location: formData.location 
          })
          .eq('id', user?.id);
        if (error) throw error;
      }

      setIsEditing(false);
      window.location.reload(); 
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container animate-fade" style={{ paddingBottom: '160px' }}>
      
      {/* Premium Header */}
      <div style={{ textAlign: 'center', marginTop: '1.5rem', marginBottom: '2.5rem' }}>
        <div style={{ position: 'relative', display: 'inline-block' }}>
          <div style={{ 
            width: '100px', 
            height: '100px', 
            borderRadius: '50%', 
            background: 'var(--primary-alpha)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            color: 'var(--primary)',
            border: '4px solid white',
            boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
          }}>
            <User size={50} strokeWidth={1.5} />
          </div>
          {isAdmin && (
            <div style={{ 
              position: 'absolute', 
              bottom: '0', 
              right: '0', 
              background: 'var(--primary)', 
              color: 'white', 
              padding: '6px', 
              borderRadius: '50%',
              border: '3px solid white'
            }}>
              <ShieldCheck size={16} />
            </div>
          )}
        </div>
        <h2 style={{ fontSize: '1.75rem', marginTop: '1rem', marginBottom: '0.2rem' }}>{profile?.full_name || 'EatsGo User'}</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{user?.email}</p>
        
        {!isEditing && (
          <button 
            onClick={() => setIsEditing(true)}
            className="btn btn-secondary"
            style={{ 
              marginTop: '1rem',
              padding: '6px 20px', 
              borderRadius: '25px',
              fontSize: '0.8rem',
              fontWeight: 700,
              gap: '6px',
              cursor: 'pointer'
            }}
          >
            <Settings size={14} /> Profile Settings
          </button>
        )}
      </div>

      {isEditing ? (
        <div className="card glass-morphism animate-fade-in" style={{ padding: '2rem', marginBottom: '2rem' }}>
          <h3 style={{ marginBottom: '1.5rem', fontSize: '1.1rem', fontWeight: 700 }}>Edit Your Info</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '5px' }}>
                <User size={14} /> Full Name
              </label>
              <input 
                value={formData.full_name}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                placeholder="Ex. Juan Dela Cruz"
              />
            </div>

            <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '5px' }}>
                <Phone size={14} /> Contact Number
              </label>
              <input 
                value={formData.contact_number}
                onChange={(e) => setFormData({ ...formData, contact_number: e.target.value })}
                placeholder="Ex. 0917XXXXXXX"
              />
            </div>

            <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '5px' }}>
                <MapPin size={14} /> Default Meeting Location
              </label>
              <input 
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="Ex. Main Lobby, Gate 1, or My House"
              />
            </div>

            {isAdmin && (
              <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <Mail size={14} /> Admin Account Email
                </label>
                <input 
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="admin@email.com"
                />
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
              <button className="btn btn-primary" onClick={handleSave} disabled={loading} style={{ cursor: loading ? 'not-allowed' : 'pointer' }}>
                {loading ? 'Saving...' : <><Check size={18} /> Save</>}
              </button>
              <button className="btn btn-secondary" onClick={() => setIsEditing(false)} style={{ cursor: 'pointer' }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          
          {/* Quick Info Grid */}
          <div className="card glass-morphism" style={{ padding: '1.5rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem' }}>
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '5px' }}>Location</p>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '0.9rem', fontWeight: 600 }}>
                <MapPin size={14} color="var(--primary)" /> {profile?.location || 'Not set'}
              </div>
            </div>
            <div style={{ textAlign: 'center', borderLeft: '1px solid var(--border-color)' }}>
              <p style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '5px' }}>Contact</p>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '0.9rem', fontWeight: 600 }}>
                <Phone size={14} color="var(--primary)" /> {profile?.contact_number || 'Not set'}
              </div>
            </div>
          </div>

          <button 
            onClick={() => navigate(isAdmin ? '/admin' : '/menu')} 
            className="btn btn-secondary" 
            style={{ 
              display: 'flex',
              justifyContent: 'space-between', 
              padding: '1.25rem', 
              width: '100%', 
              background: 'white', 
              boxShadow: 'var(--shadow-sm)',
              borderRadius: '18px',
              cursor: 'pointer'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
              <div style={{ background: 'var(--primary-alpha)', padding: '10px', borderRadius: '14px' }}>
                <ShieldCheck size={22} color="var(--primary)" />
              </div>
              <div style={{ textAlign: 'left' }}>
                <h4 style={{ fontSize: '1rem', marginBottom: '2px' }}>{isAdmin ? 'Management Hub' : 'Browse Menu'}</h4>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{isAdmin ? 'System controls & settings' : 'Start your next order'}</p>
              </div>
            </div>
            <ChevronRight size={20} color="var(--text-muted)" />
          </button>

          <button 
            onClick={!loading ? handleLogout : undefined} 
            className="btn btn-secondary" 
            style={{ 
              display: 'flex',
              justifyContent: 'space-between', 
              padding: '1.25rem', 
              width: '100%', 
              background: 'white', 
              boxShadow: 'var(--shadow-sm)',
              borderRadius: '18px',
              color: 'var(--danger)',
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
              <div style={{ background: 'rgba(239, 83, 80, 0.1)', padding: '10px', borderRadius: '14px' }}>
                <LogOut size={22} />
              </div>
              <div style={{ textAlign: 'left' }}>
                <h4 style={{ fontSize: '1rem', marginBottom: '2px' }}>Sign Out</h4>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Securely end your session</p>
              </div>
            </div>
            <ChevronRight size={20} />
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
