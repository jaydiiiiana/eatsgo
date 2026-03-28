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
        padding: '1.5rem', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        zIndex: 10,
        width: '100%',
        maxWidth: '500px',
        margin: '0 auto'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ background: 'var(--primary)', width: '32px', height: '32px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: 'white', fontWeight: 800, fontSize: '1rem' }}>E</span>
          </div>
          <span style={{ fontWeight: 800, fontSize: '1.25rem', color: 'var(--text-main)', letterSpacing: '-0.04em' }}>EatsGo</span>
        </div>
        
        <button 
          onClick={() => navigate(user ? '/profile' : '/login')} 
          style={{ background: 'transparent', border: 'none', color: 'var(--text-main)', fontWeight: 700, cursor: 'pointer', fontSize: '0.85rem' }}
        >
          {user ? 'My Profile' : 'Sign In'}
        </button>
      </nav>

      {/* Hero Section */}
      <section style={{ 
        minHeight: '80vh', 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center',
        padding: '5rem 1.5rem 3rem',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          style={{ position: 'relative', zIndex: 2 }}
        >
          <span style={{ 
            color: 'var(--primary)', 
            fontWeight: 800, 
            letterSpacing: '0.1em', 
            fontSize: '0.75rem', 
            textTransform: 'uppercase',
            marginBottom: '0.75rem',
            display: 'block'
          }}>Boutique Pinoy Dessert Experience</span>
          
          <h1 style={{ fontSize: '2.8rem', marginBottom: '1.25rem', lineHeight: 1.1, letterSpacing: '-0.04em' }}>
            Artisan <span style={{ color: 'var(--primary)' }}>Desserts</span> <br />
            with a Pinoy Soul.
          </h1>
          
          <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', marginBottom: '2.5rem', maxWidth: '380px', margin: '0 auto 2.5rem' }}>
            Experience the soulful sweetness of Boutique Pinoy Desserts, from creamy Ube delights to golden Mango favorites.
          </p>
          
          <button className="btn btn-primary" onClick={handleStart} style={{ padding: '1rem 2rem', fontSize: '1rem', borderRadius: '18px' }}>
            Explore Menu <ArrowRight size={20} />
          </button>
        </motion.div>

        {/* Hero Illustration / Image Placeholder */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          style={{ 
            marginTop: '3.5rem', 
            width: '100%', 
            aspectRatio: '16/10', 
            borderRadius: '30px', 
            overflow: 'hidden',
            boxShadow: 'var(--shadow-md)',
            background: 'url(/hero_purely_pinoy.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            position: 'relative'
          }}
        >
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.1), transparent)' }}></div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section style={{ padding: '5rem 0', background: 'white' }}>
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <h2 style={{ fontSize: '2.2rem', marginBottom: '0.75rem' }}>Boutique Flavors, Pinoy Heart</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>Elegance and soulful local favorites delivered to your door.</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="card" style={{ padding: '2rem', border: 'none', background: 'var(--background)' }}>
            <div style={{ background: 'var(--primary)', width: '44px', height: '44px', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
              <Utensils color="white" size={20} />
            </div>
            <h3 style={{ marginBottom: '0.75rem', fontSize: '1.2rem' }}>Artisan Favorites</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Indulge in our signature Ube cakes, golden Mango delights, and silky Leche Flan.</p>
          </div>

          <div className="card" style={{ padding: '2rem', border: 'none', background: 'var(--background)' }}>
            <div style={{ background: 'var(--primary)', width: '44px', height: '44px', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
              <ShoppingBag color="white" size={20} />
            </div>
            <h3 style={{ marginBottom: '0.75rem', fontSize: '1.2rem' }}>Boutique Tradition</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Soulful Filipino recipes reimagined with a modern boutique touch.</p>
          </div>

          <div className="card" style={{ padding: '2rem', border: 'none', background: 'var(--background)' }}>
            <div style={{ background: 'var(--primary)', width: '44px', height: '44px', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
              <Truck color="white" size={20} />
            </div>
            <h3 style={{ marginBottom: '0.75rem', fontSize: '1.2rem' }}>Earthy Craft</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Premium packaging delivered with exceptional care and boutique style.</p>
          </div>
        </div>
      </section>

      {/* Footer / Admin Entry */}
      <footer style={{ padding: '5rem 1.5rem', textAlign: 'center', background: 'var(--text-main)', color: 'white', margin: '0 -1.5rem', borderRadius: '40px 40px 0 0' }}>
        <h2 style={{ fontSize: '1.8rem', marginBottom: '1.5rem' }}>Ready to Experience It?</h2>
        <button className="btn btn-primary" onClick={handleStart} style={{ padding: '1rem 2rem', background: 'var(--primary-light)' }}>
          Order Now <ArrowRight size={20} />
        </button>
        
        <div style={{ marginTop: '3rem', paddingTop: '3rem', borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
          <span style={{ opacity: 0.6, fontSize: '0.8rem' }}>© 2024 EatsGo Delivery</span>
          <button 
            onClick={() => navigate('/login')} 
            style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <ShieldCheck size={14} /> Admin Portal
          </button>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
