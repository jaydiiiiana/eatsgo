import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { RefreshCw, ClipboardList, Package, Layers, Plus, LogOut, Circle, Settings } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import OrderList from './OrderList';
import Inventory from './Inventory';
import CategoryManager from './CategoryManager';
import AdminSettings from './AdminSettings';

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

interface Category {
  id: string;
  name: string;
}

interface Product {
  id: string;
  name: string;
  price: number;
  stock_quantity: number;
  category_id: string;
  category?: { name: string };
  image_url: string | null;
}

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState<'orders' | 'inventory' | 'categories' | 'settings'>('orders');
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const { signOut, user } = useAuth();

  const activeLabel = activeTab === 'orders' ? 'Orders' : 
                   activeTab === 'inventory' ? 'Menu Item' : 'Category';

  useEffect(() => {
    fetchOrders();
    fetchProducts();
    fetchCategories();

    const channel = supabase
      .channel('orders_channel')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'orders' }, payload => {
        setOrders(prev => [payload.new as Order, ...prev]);
        if (Notification.permission === 'granted') {
          new Notification('New Food Order!', { body: `Order from ${payload.new.customer_name}` });
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchOrders = async () => {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });
    if (!error && data) setOrders(data);
  };

  const fetchCategories = async () => {
    const { data, error } = await supabase.from('categories').select('*').order('name');
    if (!error && data) {
      setCategories(data);
    }
  };

  const fetchProducts = async () => {
    const { data, error } = await supabase
      .from('products')
      .select('*, category:categories(name)')
      .order('name');
    if (!error && data) setProducts(data);
  };

  const handleUpdateStatus = async (orderId: string, status: string) => {
    const { error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', orderId);
    if (!error) fetchOrders();
  };

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from('categories').insert([{ name: newCategoryName }]);
    if (!error) {
      setNewCategoryName('');
      setShowAddCategory(false);
      fetchCategories();
    }
  };

  const deleteCategory = async (id: string) => {
    if (confirm('Delete this category? Any products in this category will become uncategorized.')) {
      const { error } = await supabase.from('categories').delete().eq('id', id);
      if (!error) fetchCategories();
    }
  };

  const deleteProduct = async (id: string) => {
    if (confirm('Delete this product?')) {
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (!error) fetchProducts();
    }
  };

  const updateStock = async (id: string, currentStock: number, delta: number) => {
    const { error } = await supabase
      .from('products')
      .update({ stock_quantity: Math.max(0, currentStock + delta) })
      .eq('id', id);
    if (!error) fetchProducts();
  };

  const refreshAll = () => {
    fetchOrders();
    fetchProducts();
    fetchCategories();
  };

  return (
    <div className="animate-fade" style={{ paddingBottom: '100px' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem', marginTop: '1rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <h1 style={{ fontSize: '2.2rem', color: 'var(--text-main)', margin: 0 }}>Admin Panel</h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#F1F8E9', padding: '4px 10px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 800, color: '#33691E', border: '1px solid #DCEDC8' }}>
              <Circle size={8} fill="#33691E" /> LIVE
            </div>
          </div>
          <p style={{ color: 'var(--text-muted)' }}>Managing: <b>{user?.email}</b></p>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {activeTab !== 'orders' && (
            <button 
              className="btn btn-primary" 
              onClick={() => activeTab === 'inventory' ? setShowAddProduct(true) : setShowAddCategory(true)}
              style={{ padding: '0.75rem 1.25rem', borderRadius: '16px', boxShadow: '0 10px 20px -5px rgba(141, 110, 99, 0.4)' }}
            >
              <Plus size={20} /> Add {activeLabel}
            </button>
          )}
          
          <button className="btn btn-secondary" onClick={refreshAll} style={{ padding: '0.75rem', borderRadius: '16px', border: '1px solid rgba(141, 110, 99, 0.1)' }}>
            <RefreshCw size={22} color="var(--primary)" />
          </button>
          
          <button 
            className="btn" 
            onClick={() => signOut()}
            style={{ padding: '0.75rem', borderRadius: '16px', background: '#FEE2E2', color: '#EF4444', border: 'none' }}
            title="Log Out"
          >
            <LogOut size={22} />
          </button>
        </div>
      </header>

      <div className="admin-tabs glass-morphism" style={{ padding: '6px', marginBottom: '2.5rem', boxShadow: 'var(--shadow-md)' }}>
        <button 
          className={`admin-tab-item ${activeTab === 'orders' ? 'active' : ''}`}
          onClick={() => setActiveTab('orders')}
        >
          <ClipboardList size={20} />
          <span>Live Orders</span>
        </button>
        <button 
          className={`admin-tab-item ${activeTab === 'inventory' ? 'active' : ''}`}
          onClick={() => setActiveTab('inventory')}
        >
          <Package size={20} />
          <span>Menu Items</span>
        </button>
        <button 
          className={`admin-tab-item ${activeTab === 'categories' ? 'active' : ''}`}
          onClick={() => setActiveTab('categories')}
        >
          <Layers size={20} />
          <span>Categories</span>
        </button>
        <button 
          className={`admin-tab-item ${activeTab === 'settings' ? 'active' : ''}`}
          onClick={() => setActiveTab('settings')}
        >
          <Settings size={20} />
          <span>Settings</span>
        </button>
      </div>

      <main>
        {activeTab === 'orders' && (
          <OrderList 
            orders={orders} 
            onUpdateStatus={handleUpdateStatus} 
          />
        )}

        {activeTab === 'categories' && (
          <CategoryManager 
            categories={categories}
            showAddCategory={showAddCategory}
            setShowAddCategory={setShowAddCategory}
            newCategoryName={newCategoryName}
            setNewCategoryName={setNewCategoryName}
            onAddCategory={handleAddCategory}
            onDeleteCategory={deleteCategory}
            refreshCategories={fetchCategories}
          />
        )}

        {activeTab === 'inventory' && (
          <Inventory 
            products={products}
            categories={categories}
            showAddProduct={showAddProduct}
            setShowAddProduct={setShowAddProduct}
            onUpdateStock={updateStock}
            onDeleteProduct={deleteProduct}
            refreshProducts={fetchProducts}
          />
        )}

        {activeTab === 'settings' && (
          <div className="animate-fade">
            <h2 style={{ marginBottom: '1.5rem' }}>Global Settings</h2>
            <div className="card glass-morphism" style={{ maxWidth: '600px' }}>
                <AdminSettings />
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
