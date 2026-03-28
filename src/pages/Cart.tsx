import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { Trash2, ShoppingBag, MapPin, Package, ArrowRight, ShieldCheck } from 'lucide-react';

const CartPage = () => {
  const { items, removeFromCart, total, clearCart } = useCart();
  const { user, profile, isEmailVerified } = useAuth();
  const navigate = useNavigate();
  const [orderType, setOrderType] = useState<'pickup' | 'meeting'>('pickup');
  const [meetingLocation, setMeetingLocation] = useState('');
  const [loading, setLoading] = useState(false);

  const DELIVERY_FEE = orderType === 'meeting' ? 2.50 : 0;
  const SERVICE_FEE = 0.50;
  const grandTotal = total + DELIVERY_FEE + SERVICE_FEE;

  const handlePlaceOrder = async () => {
    if (items.length === 0) return;
    if (!user) {
      navigate('/login');
      return;
    }

    setLoading(true);
    try {
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert([{
          customer_id: user.id,
          total_price: grandTotal,
          type: orderType,
          meeting_location: orderType === 'meeting' ? meetingLocation : null,
          customer_name: profile?.full_name || user.email,
          customer_contact: profile?.contact_number || '',
          is_verified: isEmailVerified,
        }])
        .select()
        .single();

      if (orderError) throw orderError;

      const orderItems = items.map(item => ({
        order_id: order.id,
        product_id: item.id,
        quantity: item.quantity,
        price_at_time_of_order: item.price
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      clearCart();
      alert('Order placed successfully!');
      navigate('/menu');
    } catch (err: any) {
      alert('Error placing order: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="animate-fade" style={{ textAlign: 'center', padding: '6rem 1rem' }}>
        <div style={{ background: 'var(--primary-alpha)', width: '100px', height: '100px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem' }}>
          <ShoppingBag size={48} color="var(--primary)" />
        </div>
        <h2 style={{ marginBottom: '1rem', fontSize: '1.8rem' }}>Your basket is empty</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2.5rem', maxWidth: '300px', margin: '0 auto 2.5rem' }}>Looks like you haven't added anything to your order yet.</p>
        <button className="btn btn-primary" onClick={() => navigate('/menu')}>Start Ordering</button>
      </div>
    );
  }

  return (
    <div className="animate-fade" style={{ paddingBottom: '120px' }}>
      <header style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.2rem' }}>Your <span style={{ color: 'var(--primary)' }}>Basket</span></h1>
        <p style={{ color: 'var(--text-muted)' }}>Review your items and checkout</p>
      </header>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2.5rem' }}>
        {items.map(item => (
          <div key={item.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem' }}>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <div style={{ width: '50px', height: '50px', background: 'var(--primary-alpha)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: 'var(--primary)' }}>
                {item.quantity}x
              </div>
              <div>
                <h4 style={{ margin: 0, fontSize: '1.1rem' }}>{item.name}</h4>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: 0 }}>${item.price.toFixed(2)} each</p>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
              <span style={{ fontWeight: 800, fontSize: '1.1rem' }}>${(item.price * item.quantity).toFixed(2)}</span>
              <button 
                onClick={() => removeFromCart(item.id)}
                style={{ background: '#FEE2E2', border: 'none', color: '#EF4444', cursor: 'pointer', padding: '8px', borderRadius: '10px' }}
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="card glass-morphism" style={{ marginBottom: '2rem', border: '1px solid var(--primary-alpha)' }}>
        <h3 style={{ marginBottom: '1.25rem', fontSize: '1.2rem' }}>Fulfillment Method</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
          <button 
            className="btn"
            onClick={() => setOrderType('pickup')}
            style={{ 
                background: orderType === 'pickup' ? 'var(--primary)' : 'white',
                color: orderType === 'pickup' ? 'white' : 'var(--text-main)',
                border: `1px solid ${orderType === 'pickup' ? 'var(--primary)' : 'rgba(141, 110, 99, 0.1)'}`,
                boxShadow: orderType === 'pickup' ? 'var(--shadow-md)' : 'none'
            }}
          >
            <Package size={18} /> Pickup
          </button>
          <button 
            className="btn"
            onClick={() => setOrderType('meeting')}
            style={{ 
                background: orderType === 'meeting' ? 'var(--primary)' : 'white',
                color: orderType === 'meeting' ? 'white' : 'var(--text-main)',
                border: `1px solid ${orderType === 'meeting' ? 'var(--primary)' : 'rgba(141, 110, 99, 0.1)'}`,
                boxShadow: orderType === 'meeting' ? 'var(--shadow-md)' : 'none'
            }}
          >
            <MapPin size={18} /> Meeting
          </button>
        </div>

        {orderType === 'meeting' && (
          <div className="animate-fade">
            <label style={{ fontSize: '0.8rem', fontWeight: 800, display: 'block', marginBottom: '0.6rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Meeting Location</label>
            <input 
              type="text" 
              placeholder="e.g. Main Lobby, Gate 1, Bench A" 
              value={meetingLocation}
              onChange={(e) => setMeetingLocation(e.target.value)}
              style={{ height: '55px', border: '1px solid rgba(141, 110, 99, 0.2)' }}
              required
            />
          </div>
        )}
      </div>

      <div className="card" style={{ background: 'var(--text-main)', color: 'white', padding: '2rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', opacity: 0.8, fontSize: '0.95rem' }}>
            <span>Subtotal</span>
            <span>${total.toFixed(2)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', opacity: 0.8, fontSize: '0.95rem' }}>
            <span>Delivery Fee</span>
            <span>{DELIVERY_FEE > 0 ? `$${DELIVERY_FEE.toFixed(2)}` : 'FREE'}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', opacity: 0.8, fontSize: '0.95rem' }}>
            <span>Service Fee</span>
            <span>${SERVICE_FEE.toFixed(2)}</span>
          </div>
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
          <span style={{ fontSize: '1.2rem', fontWeight: 600 }}>Total Price</span>
          <span style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--primary-light)' }}>${grandTotal.toFixed(2)}</span>
        </div>
        
        <button 
          className="btn btn-primary" 
          style={{ width: '100%', height: '60px', fontSize: '1.1rem', borderRadius: '18px' }}
          onClick={handlePlaceOrder}
          disabled={loading || (orderType === 'meeting' && !meetingLocation)}
        >
          {loading ? 'Processing...' : 'Place My Order'} <ArrowRight size={20} />
        </button>
        
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginTop: '1.25rem', opacity: 0.5, fontSize: '0.8rem' }}>
            <ShieldCheck size={14} /> Secure Checkout
        </div>
      </div>
    </div>
  );
};

export default CartPage;
