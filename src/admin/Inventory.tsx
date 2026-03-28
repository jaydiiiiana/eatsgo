import React, { useState, useRef, useEffect } from 'react';
import { Plus, Trash2, Camera, UploadCloud, Edit3 } from 'lucide-react';
import Modal from '../components/Modal';
import { supabase } from '../lib/supabase';

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

interface InventoryProps {
  products: Product[];
  categories: Category[];
  showAddProduct: boolean;
  setShowAddProduct: (show: boolean) => void;
  onUpdateStock: (id: string, current: number, delta: number) => void;
  onDeleteProduct: (id: string) => void;
  refreshProducts: () => void;
}

const Inventory: React.FC<InventoryProps> = ({ 
  products, categories, showAddProduct, setShowAddProduct, 
  onUpdateStock, onDeleteProduct, refreshProducts
}) => {
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({ name: '', price: 0, stock: 0, category_id: '' });
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Pre-fill form when editing
  useEffect(() => {
    if (editingProduct) {
      setFormData({
        name: editingProduct.name,
        price: editingProduct.price,
        stock: editingProduct.stock_quantity,
        category_id: editingProduct.category_id
      });
      setImagePreview(editingProduct.image_url);
    } else {
      setFormData({ name: '', price: 0, stock: 0, category_id: categories[0]?.id || '' });
      setImagePreview(null);
    }
  }, [editingProduct, categories]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    let publicUrl = editingProduct?.image_url || '';

    try {
      // 1. Upload image if a new one is picked
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('item_photo')
          .upload(filePath, imageFile);

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
          .from('item_photo')
          .getPublicUrl(filePath);

        
        publicUrl = urlData.publicUrl;
      }

      const productPayload = {
        name: formData.name,
        price: formData.price,
        stock_quantity: formData.stock,
        category_id: formData.category_id || categories[0]?.id,
        image_url: publicUrl || `https://source.unsplash.com/featured/?${formData.name}`
      };

      if (editingProduct) {
        // Update existing
        const { error } = await supabase
          .from('products')
          .update(productPayload)
          .eq('id', editingProduct.id);
        if (error) throw error;
      } else {
        // Insert new
        const { error } = await supabase
          .from('products')
          .insert([productPayload]);
        if (error) throw error;
      }

      // Cleanup & Close
      handleClose();
      refreshProducts();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setShowAddProduct(false);
    setEditingProduct(null);
    setImageFile(null);
    setImagePreview(null);
  };

  const startEdit = (product: Product) => {
    setEditingProduct(product);
    setShowAddProduct(true);
  };

  const confirmDelete = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete the product "${name}"? This action cannot be undone.`)) {
      onDeleteProduct(id);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {categories.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', border: '2px dashed #DDD', padding: '2rem' }}>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>Please add a <b>Category</b> first!</p>
        </div>
      ) : (
        <button className="btn btn-primary" onClick={() => setShowAddProduct(true)} style={{ width: '100%', marginBottom: '1rem' }}>
          <Plus size={20} /> Add New Product
        </button>
      )}

      {/* Unified Add/Edit Modal */}
      <Modal 
        isOpen={showAddProduct} 
        onClose={handleClose} 
        title={editingProduct ? 'Edit Menu Item' : 'Add New Menu Item'}
      >
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          
          <div 
            onClick={() => fileInputRef.current?.click()}
            style={{ 
              height: '180px', 
              background: '#F8F9FA', 
              borderRadius: 'var(--radius-md)', 
              border: '2px dashed #E9ECEF',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              overflow: 'hidden',
              position: 'relative'
            }}
          >
            {imagePreview ? (
              <img src={imagePreview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                <Camera size={32} style={{ marginBottom: '0.5rem' }} />
                <div style={{ fontSize: '0.875rem' }}>Tap to upload food photo</div>
              </div>
            )}
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleImageChange} 
              accept="image/*" 
              style={{ display: 'none' }} 
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.875rem', fontWeight: 600 }}>Food Name</label>
            <input 
              type="text" 
              placeholder="e.g. Classic Burger" 
              value={formData.name} 
              onChange={e => setFormData({...formData, name: e.target.value})} 
              required 
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.875rem', fontWeight: 600 }}>Price ($)</label>
              <input 
                type="number" 
                step="0.01" 
                value={formData.price} 
                onChange={e => setFormData({...formData, price: parseFloat(e.target.value)})} 
                required 
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.875rem', fontWeight: 600 }}>In Stock</label>
              <input 
                type="number" 
                value={formData.stock} 
                onChange={e => setFormData({...formData, stock: parseInt(e.target.value)})} 
                required 
              />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.875rem', fontWeight: 600 }}>Category</label>
            <select 
              value={formData.category_id} 
              onChange={e => setFormData({...formData, category_id: e.target.value})}
              required
            >
              <option value="">Select Category</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading} style={{ marginTop: '1rem' }}>
            {loading ? <UploadCloud className="animate-spin" /> : editingProduct ? <Edit3 size={20} /> : <Plus size={20} />}
            {loading ? 'Saving Changes...' : editingProduct ? 'Update Item' : 'Add to Menu'}
          </button>
        </form>
      </Modal>

      {/* Product List */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
        {products.map(p => (
          <div key={p.id} className="card" style={{ display: 'flex', gap: '1rem', alignItems: 'center', padding: '0.8rem' }}>
            <div style={{ width: '60px', height: '60px', borderRadius: 'var(--radius-md)', background: '#EEE', overflow: 'hidden' }}>
              <img src={p.image_url || ''} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div style={{ flex: 1 }}>
              <h4 style={{ margin: 0, fontSize: '0.95rem' }}>{p.name}</h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', margin: 0 }}>
                ${p.price} | {p.category?.name || 'Uncategorized'}
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', background: '#F1F3F5', padding: '4px', borderRadius: 'var(--radius-md)', gap: '8px', marginRight: '4px' }}>
                <button onClick={() => onUpdateStock(p.id, p.stock_quantity, -1)} style={{ background: 'none', border: 'none', fontWeight: 800 }}>-</button>
                <span style={{ minWidth: '20px', textAlign: 'center', fontWeight: 600, fontSize: '0.875rem' }}>{p.stock_quantity}</span>
                <button onClick={() => onUpdateStock(p.id, p.stock_quantity, 1)} style={{ background: 'none', border: 'none', fontWeight: 800 }}>+</button>
              </div>
              
              <button onClick={() => startEdit(p)} style={{ padding: '8px', border: 'none', background: 'none', color: 'var(--primary)' }}>
                <Edit3 size={18} />
              </button>
              
              <button onClick={() => confirmDelete(p.id, p.name)} style={{ padding: '8px', border: 'none', background: 'none', color: 'var(--danger)' }}>
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Inventory;
