import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, Home as HomeIcon, Settings, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Navigation = () => {
  const location = useLocation();
  const { user, isAdmin } = useAuth();
  const { totalItems } = useCart();
  
  if (!user) return null;

  const isActive = (path: string) => location.pathname === path;
  const isAdminActive = location.pathname.startsWith('/admin');

  return (
    <nav className="nav-bar glass-morphism animate-fade" style={{ borderTop: '1px solid rgba(141, 110, 99, 0.08)', height: '80px' }}>
      <Link to="/menu" className={`nav-item ${isActive('/menu') ? 'active' : ''}`}>
        <div style={{ padding: '6px 16px', borderRadius: '16px', background: isActive('/menu') ? 'var(--primary-alpha)' : 'transparent', marginBottom: '4px', transition: 'all 0.3s' }}>
          <HomeIcon size={22} strokeWidth={isActive('/menu') ? 2.5 : 2} />
        </div>
        <span style={{ fontWeight: isActive('/menu') ? 800 : 600, fontSize: '0.7rem' }}>Menu</span>
      </Link>
      
      {!isAdmin && (
        <Link to="/cart" className={`nav-item ${isActive('/cart') ? 'active' : ''}`} style={{ position: 'relative' }}>
          <div style={{ padding: '6px 16px', borderRadius: '16px', background: isActive('/cart') ? 'var(--primary-alpha)' : 'transparent', marginBottom: '4px', transition: 'all 0.3s' }}>
            <ShoppingCart size={22} strokeWidth={isActive('/cart') ? 2.5 : 2} />
          </div>
          <span style={{ fontWeight: isActive('/cart') ? 800 : 600, fontSize: '0.7rem' }}>Cart</span>
          {totalItems > 0 && (
            <span className="cart-badge" style={{ top: '6px', right: '50%', transform: 'translateX(24px)', border: '2px solid white', background: 'var(--primary)' }}>{totalItems}</span>
          )}
        </Link>
      )}

      {isAdmin ? (
        <Link to="/admin" className={`nav-item ${isAdminActive ? 'active' : ''}`}>
          <div style={{ padding: '6px 16px', borderRadius: '16px', background: isAdminActive ? 'var(--primary-alpha)' : 'transparent', marginBottom: '4px', transition: 'all 0.3s' }}>
            <Settings size={22} strokeWidth={isAdminActive ? 2.5 : 2} />
          </div>
          <span style={{ fontWeight: isAdminActive ? 800 : 600, fontSize: '0.7rem' }}>Admin</span>
        </Link>
      ) : (
        <div className="nav-item">
          <div style={{ padding: '6px 16px', borderRadius: '16px', background: 'transparent', marginBottom: '4px' }}>
            <User size={22} strokeWidth={2} />
          </div>
          <span style={{ fontWeight: 600, fontSize: '0.7rem' }}>Profile</span>
        </div>
      )}
    </nav>
  );
};

export default Navigation;
