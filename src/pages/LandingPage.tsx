import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingBag, ShieldCheck, Truck, Utensils, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const LandingPage = () => {
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();

  const handleStart = () => {
    if (!user) {
      navigate('/login');
    } else {
      navigate(isAdmin ? '/admin' : '/menu');
    }
  };

  return (
    <div className="animate-fade" style={{ background: 'var(--background)' }}>
      {/* Navbar Overlay */}
      <nav style={{ 
        position: 'absolute', 
        top: 0, 
        left: 0, 
        right: 0, 
        padding: '2rem', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        zIndex: 10 
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ background: 'var(--primary)', width: '36px', height: '36px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: 'white', fontWeight: 800, fontSize: '1.2rem' }}>E</span>
          </div>
          <span style={{ fontWeight: 800, fontSize: '1.5rem', color: 'var(--text-main)', letterSpacing: '-0.04em' }}>EatsGo</span>
        </div>
        
        <button 
          onClick={() => navigate('/login')} 
          style={{ background: 'transparent', border: 'none', color: 'var(--text-main)', fontWeight: 700, cursor: 'pointer', fontSize: '0.95rem' }}
        >
          {user ? 'My Profile' : 'Sign In'}
        </button>
      </nav>

      {/* Hero Section */}
      <section style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center',
        padding: '6rem 1.5rem',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          style={{ position: 'relative', zIndex: 2, maxWidth: '600px' }}
        >
          <span style={{ 
            color: 'var(--primary)', 
            fontWeight: 800, 
            letterSpacing: '0.1em', 
            fontSize: '0.8rem', 
            textTransform: 'uppercase',
            marginBottom: '1rem',
            display: 'block'
          }}>Boutique Pinoy Dessert Experience</span>
          
          <h1 style={{ fontSize: '4rem', marginBottom: '1.5rem', lineHeight: 1.1 }}>
            Artisan <span style={{ color: 'var(--primary)' }}>Desserts</span> <br />
            with a Pinoy Soul.
          </h1>
          
          <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', marginBottom: '3rem', maxWidth: '500px', margin: '0 auto 3rem' }}>
            Experience the unique fusion of Signature Tiramisu, Creamy Cheesecake, and Artisanal Filipino infusions.
          </p>
          
          <button className="btn btn-primary" onClick={handleStart} style={{ padding: '1.25rem 2.5rem', fontSize: '1.1rem', borderRadius: '20px' }}>
            Explore Menu <ArrowRight size={22} />
          </button>
        </motion.div>

        {/* Hero Illustration / Image Placeholder */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          style={{ 
            marginTop: '4rem', 
            width: '100%', 
            maxWidth: '1000px', 
            aspectRatio: '16/9', 
            borderRadius: '40px', 
            overflow: 'hidden',
            boxShadow: 'var(--shadow-lg)',
            background: 'url(/hero_boutique_pinoy_desserts.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            position: 'relative'
          }}
        >
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.2), transparent)' }}></div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section style={{ padding: '8rem 1.5rem', background: 'white' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Boutique Flavors, Pinoy Heart</h2>
            <p style={{ color: 'var(--text-muted)' }}>We bring elegant global classics and soulful local favorites to your doorstep.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
            <div className="card" style={{ padding: '2.5rem', border: 'none', background: 'var(--background)' }}>
              <div style={{ background: 'var(--primary)', width: '50px', height: '50px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
                <Utensils color="white" size={24} />
              </div>
              <h3 style={{ marginBottom: '1rem', fontSize: '1.3rem' }}>Global Classics</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>Indulge in our signature silky Tiramisu and velvety artisanal Cheesecakes.</p>
            </div>

            <div className="card" style={{ padding: '2.5rem', border: 'none', background: 'var(--background)' }}>
              <div style={{ background: 'var(--primary)', width: '50px', height: '50px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
                <ShoppingBag color="white" size={24} />
              </div>
              <h3 style={{ marginBottom: '1rem', fontSize: '1.3rem' }}>Pinoy Infusions</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>Soulful Filipino ingredients like Ube and Mango reimagined as boutique treats.</p>
            </div>

            <div className="card" style={{ padding: '2.5rem', border: 'none', background: 'var(--background)' }}>
              <div style={{ background: 'var(--primary)', width: '50px', height: '50px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
                <Truck color="white" size={24} />
              </div>
              <h3 style={{ marginBottom: '1rem', fontSize: '1.3rem' }}>Earthy Craft</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>Premium, minimalist packaging delivered with exceptional care and boutique style.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer / Admin Entry */}
      <footer style={{ padding: '6rem 1.5rem', textAlign: 'center', background: 'var(--text-main)', color: 'white' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '2rem' }}>Ready to Experience It?</h2>
        <button className="btn btn-primary" onClick={handleStart} style={{ padding: '1rem 2rem', background: 'var(--primary-light)' }}>
          Order Now <ArrowRight size={20} />
        </button>
        
        <div style={{ marginTop: '4rem', paddingTop: '4rem', borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap' }}>
          <span style={{ opacity: 0.6 }}>© 2024 EatsGo Delivery</span>
          <button 
            onClick={() => navigate('/login')} 
            style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <ShieldCheck size={14} /> Admin Portal
          </button>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
