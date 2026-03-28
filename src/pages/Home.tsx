import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useCart } from '../context/CartContext';
import { Search, Plus, Star, MapPin, Clock, ChevronRight } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  category_id: string;
  category?: { name: string };
  stock_quantity: number;
}

const Home = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>(['All']);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const { addToCart } = useCart();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const { data: catData, error: catError } = await supabase.from('categories').select('name').order('name');
      if (catError) console.error(catError);
      else if (catData) setCategories(['All', ...catData.map(c => c.name)]);

      const { data, error } = await supabase
        .from('products')
        .select('*, category:categories(name)')
        .eq('is_active', true);
      
      if (error) console.error(error);
      else if (data) setProducts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || p.category?.name === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="container animate-fade">
      {/* Premium Header */}
      <header style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', cursor: 'pointer' }}>
          <div style={{ background: 'var(--primary-alpha)', color: 'var(--primary)', padding: '10px', borderRadius: '14px' }}>
            <MapPin size={20} />
          </div>
          <div style={{ flex: 1 }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Deliver to</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ fontWeight: 800, fontSize: '1.05rem' }}>Current Location</span>
              <ChevronRight size={16} color="var(--primary)" />
            </div>
          </div>
        </div>

        <h1 style={{ fontSize: '2.4rem', marginBottom: '1.5rem', lineHeight: 1.1 }}>What would you like <span style={{ color: 'var(--primary)' }}>to eat?</span></h1>
        
        <div style={{ position: 'relative' }}>
          <Search size={22} style={{ position: 'absolute', top: '50%', left: '1.25rem', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input 
            type="text" 
            placeholder="Search our delicious menu..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ 
              paddingLeft: '3.75rem', 
              borderRadius: 'var(--radius-lg)', 
              background: 'white', 
              border: '1px solid rgba(141, 110, 99, 0.1)', 
              boxShadow: 'var(--shadow-sm)',
              height: '60px',
              fontSize: '1.05rem'
            }}
          />
        </div>
      </header>

      {/* Horizontal Categories */}
      <section style={{ marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', gap: '0.75rem', overflowX: 'auto', paddingBottom: '0.5rem', maskImage: 'linear-gradient(to right, black 85%, transparent)' }}>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className="btn"
              style={{
                borderRadius: 'var(--radius-xl)',
                background: selectedCategory === cat ? 'var(--primary)' : 'white',
                color: selectedCategory === cat ? 'white' : 'var(--text-main)',
                border: `1px solid ${selectedCategory === cat ? 'var(--primary)' : 'rgba(141, 110, 99, 0.1)'}`,
                padding: '0.6rem 1.4rem',
                fontSize: '0.9rem',
                whiteSpace: 'nowrap'
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Product List */}
      <section style={{ paddingBottom: '100px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.4rem' }}>Recommended for you</h2>
        </div>
        
        {loading ? (
          <div className="product-grid">
            {[1, 2, 3, 4].map(n => (
              <div key={n} className="card" style={{ height: '300px', opacity: 0.5 }}></div>
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-muted)' }}>
            <Search size={48} style={{ opacity: 0.1, marginBottom: '1rem' }} />
            <p>No items match your search.</p>
          </div>
        ) : (
          <div className="product-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
            {filteredProducts.map(product => (
              <div key={product.id} className="card" style={{ padding: '0', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                <div style={{ position: 'relative', width: '100%', paddingTop: '65%' }}>
                  <img 
                    src={product.image_url || `https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format`} 
                    alt={product.name}
                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <div style={{ position: 'absolute', top: '12px', right: '12px', background: 'rgba(255,255,255,0.95)', padding: '5px 10px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', fontWeight: 800, boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
                    <Star size={14} fill="#D4A373" color="#D4A373" /> 4.9
                  </div>
                </div>
                
                <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                    <h3 style={{ fontSize: '1.25rem', margin: 0 }}>{product.name}</h3>
                    <span style={{ fontWeight: 800, fontSize: '1.15rem', color: 'var(--primary)' }}>${product.price}</span>
                  </div>
                  
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.25rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {product.description}
                  </p>
                  
                  <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 600 }}>
                      <Clock size={14} /> 20-30 min
                    </div>
                    <button 
                      className="btn btn-primary" 
                      style={{ padding: '0.5rem 1.25rem', borderRadius: '14px' }}
                      onClick={() => addToCart(product)}
                      disabled={product.stock_quantity <= 0}
                    >
                      {product.stock_quantity > 0 ? <Plus size={20} /> : 'Sold Out'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
