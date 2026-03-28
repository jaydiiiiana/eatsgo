import React from 'react';
import { CheckCircle, User, Smartphone, Package, MapPin } from 'lucide-react';

interface Order {
  id: string;
  customer_name: string;
  customer_contact: string;
  total_price: number;
  status: string;
  type: string;
  meeting_location: string | null;
  is_verified: boolean;
  created_at: string;
}

interface OrderListProps {
  orders: Order[];
  onUpdateStatus: (id: string, status: string) => void;
}

const OrderList: React.FC<OrderListProps> = ({ orders, onUpdateStatus }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {orders.length === 0 ? (
        <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No orders yet.</p>
      ) : (
        orders.map(order => (
          <div key={order.id} className="card" style={{ borderLeft: `8px solid ${order.status === 'pending' ? 'var(--warning)' : 'var(--success)'}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <span style={{ fontWeight: 700, textTransform: 'uppercase', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                ID: {order.id.slice(0,8)}
              </span>
              <span style={{ 
                padding: '2px 8px', 
                borderRadius: 'var(--radius-full)', 
                fontSize: '0.75rem', 
                background: order.status === 'pending' ? '#FFF3E0' : '#E8F5E9',
                color: order.status === 'pending' ? '#E65100' : '#2E7D32',
                fontWeight: 600
              }}>
                {order.status}
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                <User size={16} /> 
                <span style={{ fontWeight: 600 }}>{order.customer_name}</span>
                {order.is_verified ? (
                  <span style={{ 
                    display: 'inline-flex', 
                    alignItems: 'center', 
                    gap: '4px', 
                    fontSize: '0.7rem', 
                    background: '#F1F8E9', 
                    color: '#33691E', 
                    padding: '2px 8px', 
                    borderRadius: '8px',
                    fontWeight: 700,
                    marginLeft: '4px',
                    border: '1px solid #DCEDC8'
                  }}>
                    <CheckCircle size={12} /> Verified
                  </span>
                ) : (
                  <span style={{ 
                    display: 'inline-flex', 
                    alignItems: 'center', 
                    gap: '4px', 
                    fontSize: '0.7rem', 
                    background: '#FFF3E0', 
                    color: '#E65100', 
                    padding: '2px 8px', 
                    borderRadius: '8px',
                    fontWeight: 700,
                    marginLeft: '4px',
                    border: '1px solid #FFE0B2'
                  }}>
                    ⚠️ Dummy
                  </span>
                )}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Smartphone size={16} /> {order.customer_contact}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Package size={16} /> {order.type.toUpperCase()}</div>
              {order.type === 'meeting' && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)' }}><MapPin size={16} /> {order.meeting_location}</div>
              )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #EEE', paddingTop: '1rem' }}>
              <span style={{ fontWeight: 700, fontSize: '1.2rem' }}>${order.total_price}</span>
              {order.status === 'pending' && (
                <button 
                  className="btn btn-primary" 
                  style={{ padding: '0.4rem 0.8rem', fontSize: '0.875rem' }}
                  onClick={() => onUpdateStatus(order.id, 'delivered')}
                >
                  <CheckCircle size={18} /> Mark Delivered
                </button>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default OrderList;
