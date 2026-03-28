import React, { useState } from 'react';
import { Plus, Trash2, Edit3, Check, X } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Category {
  id: string;
  name: string;
}

interface CategoryManagerProps {
  categories: Category[];
  showAddCategory: boolean;
  setShowAddCategory: (show: boolean) => void;
  newCategoryName: string;
  setNewCategoryName: (name: string) => void;
  onAddCategory: (e: React.FormEvent) => void;
  onDeleteCategory: (id: string) => void;
  refreshCategories: () => void;
}

const CategoryManager: React.FC<CategoryManagerProps> = ({ 
  categories, showAddCategory, setShowAddCategory, 
  newCategoryName, setNewCategoryName, onAddCategory, onDeleteCategory,
  refreshCategories
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');

  const startEdit = (cat: Category) => {
    setEditingId(cat.id);
    setEditName(cat.name);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditName('');
  };

  const handleUpdate = async (id: string) => {
    if (!editName.trim()) return;
    const { error } = await supabase.from('categories').update({ name: editName }).eq('id', id);
    if (!error) {
      setEditingId(null);
      refreshCategories();
    }
  };

  const confirmDelete = (id: string, name: string) => {
    if (window.confirm(`Delete the category "${name}"? Existing products in this category will become uncategorized.`)) {
      onDeleteCategory(id);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <button className="btn btn-primary" onClick={() => setShowAddCategory(true)} style={{ width: '100%' }}>
        <Plus size={20} /> Add New Category
      </button>

      {showAddCategory && (
        <div className="card glass-morphism animate-fade">
          <form onSubmit={onAddCategory} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <input 
              type="text" 
              placeholder="Category Name (e.g. Burgers)" 
              value={newCategoryName} 
              onChange={e => setNewCategoryName(e.target.value)} 
              required 
            />
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Save</button>
              <button type="button" className="btn btn-secondary" onClick={() => setShowAddCategory(false)} style={{ flex: 1 }}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
        {categories.map(cat => (
          <div key={cat.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem' }}>
            
            {editingId === cat.id ? (
              <div style={{ display: 'flex', gap: '0.5rem', flex: 1, marginRight: '1rem' }}>
                <input 
                  type="text" 
                  value={editName} 
                  onChange={e => setEditName(e.target.value)}
                  style={{ flex: 1, padding: '0.4rem 0.8rem' }}
                  autoFocus
                />
                <button onClick={() => handleUpdate(cat.id)} style={{ padding: '8px', background: '#E8F5E9', color: '#2E7D32', border: 'none', borderRadius: '4px' }}>
                  <Check size={18} />
                </button>
                <button onClick={cancelEdit} style={{ padding: '8px', background: '#FFE5E8', color: '#E71D36', border: 'none', borderRadius: '4px' }}>
                  <X size={18} />
                </button>
              </div>
            ) : (
              <span style={{ fontWeight: 600 }}>{cat.name}</span>
            )}

            {!editingId && (
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button 
                  onClick={() => startEdit(cat)} 
                  style={{ padding: '8px', border: 'none', background: 'none', color: 'var(--primary)' }}
                >
                  <Edit3 size={18} />
                </button>
                <button 
                  onClick={() => confirmDelete(cat.id, cat.name)} 
                  style={{ padding: '8px', border: 'none', background: 'none', color: 'var(--danger)' }}
                >
                  <Trash2 size={18} />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryManager;
