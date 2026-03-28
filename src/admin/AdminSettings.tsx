import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Mail, Save, CheckCircle2 } from 'lucide-react';

const AdminSettings = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      const { data } = await supabase
        .from('settings')
        .select('*')
        .eq('key', 'admin_notification_email')
        .single();
      
      if (data) setEmail(data.value);
    };
    fetchSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSaved(false);

    try {
      const { error } = await supabase
        .from('settings')
        .upsert({ key: 'admin_notification_email', value: email });

      if (error) throw error;
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err: any) {
      alert('Error saving settings: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div>
        <label style={{ display: 'block', marginBottom: '0.8rem', fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-muted)' }}>ADMIN NOTIFICATION EMAIL</label>
        <div style={{ position: 'relative' }}>
          <div style={{ position: 'absolute', top: '50%', left: '1rem', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
            <Mail size={20} />
          </div>
          <input 
            type="email" 
            placeholder="e.g. shop-orders@example.com" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ paddingLeft: '3.2rem', height: '55px' }}
            required 
          />
        </div>
        <p style={{ marginTop: '0.8rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          Order notifications will be sent to this address, as well as to the customer.
        </p>
      </div>

      <button 
        type="submit" 
        className="btn btn-primary" 
        disabled={loading}
        style={{ width: 'fit-content', padding: '0.8rem 2rem' }}
      >
        {saved ? (
          <><CheckCircle2 size={20} /> Saved!</>
        ) : (
          <><Save size={20} /> {loading ? 'Saving...' : 'Save Settings'}</>
        )}
      </button>
    </form>
  );
};

export default AdminSettings;
