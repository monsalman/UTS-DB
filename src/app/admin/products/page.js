'use client';
import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Loader2, Save, X, Image as ImageIcon } from 'lucide-react';
import Sidebar from '@/components/Sidebar';
import Navbar from '@/components/Navbar';
import { CATEGORIES as categoryOptions } from '@/lib/constants';

export default function ProductManagement() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    category: 'coffee',
    price: '',
    image: '',
    description: '',
    stock: 0
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const data = new FormData();
    data.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: data,
      });
      const fileData = await res.json();
      if (fileData.secure_url) {
        setFormData({ ...formData, image: fileData.secure_url });
      } else {
        alert('Upload failed: ' + (fileData.message || 'Unknown error'));
      }
    } catch (err) {
      console.error('Upload error:', err);
      alert('Error uploading image');
    } finally {
      setUploading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products');
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (product = null) => {
    console.log('Opening modal for:', product);
    if (product) {
      setCurrentProduct(product);
      setFormData({
        name: product.name,
        category: product.category,
        price: product.price,
        image: product.image,
        description: product.description,
        stock: product.stock || 0
      });
    } else {
      setCurrentProduct(null);
      setFormData({
        name: '',
        category: 'coffee',
        price: '',
        image: '',
        description: '',
        stock: 0
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Submitting form:', formData);

    // Clean price data (remove commas if any)
    const cleanedPrice = formData.price.toString().replace(/,/g, '');
    const dataToSubmit = { ...formData, price: cleanedPrice };

    const url = currentProduct ? `/api/products/${currentProduct.id}` : '/api/products';
    const method = currentProduct ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSubmit),
      });
      if (res.ok) {
        setIsModalOpen(false);
        fetchProducts();
      } else {
        const errorData = await res.json();
        alert(`Error: ${errorData.message || 'Failed to save product'}`);
      }
    } catch (err) {
      console.error('Submit error:', err);
      alert('Network error or server is down');
    }
  };

  const handleDelete = async (id) => {
    console.log('Deleting product:', id);
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchProducts();
      } else {
        alert('Failed to delete product');
      }
    } catch (err) {
      console.error('Delete error:', err);
      alert('Network error or server is down');
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-dark)' }}>
      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      <main style={{
        marginLeft: isCollapsed ? '80px' : '260px',
        flex: 1,
        padding: '100px 40px 40px',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
      }}>
        <Navbar userType="employee" isSidebarCollapsed={isCollapsed} hasCart={false} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
          <div className="fade-in">
            <h2 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '8px' }}>Product Management</h2>
            <p style={{ color: 'var(--text-muted)' }}>Manage your menu items, prices, and descriptions.</p>
          </div>
          <button onClick={() => handleOpenModal()} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Plus size={20} />
            Add Product
          </button>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '100px' }}><Loader2 className="animate-spin" size={40} /></div>
        ) : (
          <div className="glass" style={{ borderRadius: '24px', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)', background: 'rgba(255,255,255,0.02)' }}>
                  <th style={{ padding: '20px' }}>Product</th>
                  <th style={{ padding: '20px' }}>Category</th>
                  <th style={{ padding: '20px' }}>Price</th>
                  <th style={{ padding: '20px' }}>Stock</th>
                  <th style={{ padding: '20px' }}>Last Update</th>
                  <th style={{ padding: '20px' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id} style={{ borderBottom: '1px solid var(--border)', transition: 'var(--transition)' }}>
                    <td style={{ padding: '20px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        {product.image ? (
                          <img src={product.image} alt="" style={{ width: '48px', height: '48px', borderRadius: '12px', objectFit: 'cover' }} />
                        ) : (
                          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <ImageIcon size={20} color="var(--text-muted)" />
                          </div>
                        )}
                        <div>
                          <p style={{ fontWeight: '600' }}>{product.name}</p>
                          <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>ID: #{product.id}</p>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '20px' }}>
                      <span style={{
                        background: 'var(--glass-bg)',
                        padding: '4px 12px',
                        borderRadius: '20px',
                        fontSize: '12px',
                        textTransform: 'capitalize'
                      }}>{product.category}</span>
                    </td>
                    <td style={{ padding: '20px', fontWeight: '600', color: 'var(--primary)' }}>
                      Rp {Number(product.price).toLocaleString()}
                    </td>
                    <td style={{ padding: '20px' }}>
                      <div style={{
                        display: 'inline-flex',
                        padding: '4px 10px',
                        borderRadius: '8px',
                        background: product.stock > 0 ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                        color: product.stock > 0 ? '#22c55e' : '#ef4444',
                        fontSize: '13px',
                        fontWeight: '600'
                      }}>
                        {product.stock} pcs
                      </div>
                    </td>
                    <td style={{ padding: '20px', fontSize: '13px', color: 'var(--text-muted)' }}>
                      {new Date(product.updated_at).toLocaleString('id-ID', {
                        day: '2-digit',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </td>
                    <td style={{ padding: '20px' }}>
                      <div style={{ display: 'flex', gap: '12px' }}>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenModal(product);
                          }}
                          style={{
                            background: 'rgba(255,255,255,0.05)',
                            border: '1px solid var(--border)',
                            color: 'var(--text-main)',
                            cursor: 'pointer',
                            padding: '8px',
                            borderRadius: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'var(--transition)',
                            position: 'relative',
                            zIndex: 10
                          }}
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(product.id);
                          }}
                          style={{
                            background: 'rgba(239, 68, 68, 0.1)',
                            border: '1px solid rgba(239, 68, 68, 0.2)',
                            color: '#ef4444',
                            cursor: 'pointer',
                            padding: '8px',
                            borderRadius: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'var(--transition)',
                            position: 'relative',
                            zIndex: 10
                          }}
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Modal */}
        {isModalOpen && (
          <div style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.8)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2000,
            padding: '20px'
          }}>
            <div className="glass fade-in" style={{ width: '100%', maxWidth: '500px', padding: '40px', borderRadius: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <h3 style={{ fontSize: '24px', fontWeight: '700' }}>{currentProduct ? 'Edit Product' : 'Add New Product'}</h3>
                <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Product Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="glass"
                    style={{ padding: '12px 16px', borderRadius: '12px', border: '1px solid var(--border)', color: 'white', outline: 'none' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '16px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Category</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="glass"
                      style={{ padding: '12px 16px', borderRadius: '12px', border: '1px solid var(--border)', color: 'white', outline: 'none', background: '#1e293b' }}
                    >
                      {categoryOptions.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Price (Rp)</label>
                    <input
                      type="text"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      required
                      placeholder="25000"
                      className="glass"
                      style={{ padding: '12px 16px', borderRadius: '12px', border: '1px solid var(--border)', color: 'white', outline: 'none' }}
                    />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Stock</label>
                    <input
                      type="number"
                      value={formData.stock}
                      onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                      required
                      className="glass"
                      style={{ padding: '12px 16px', borderRadius: '12px', border: '1px solid var(--border)', color: 'white', outline: 'none' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Product Image</label>
                  <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                    <div style={{
                      width: '80px',
                      height: '80px',
                      borderRadius: '12px',
                      background: 'var(--glass-bg)',
                      border: '1px solid var(--border)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      overflow: 'hidden'
                    }}>
                      {formData.image ? (
                        <img src={formData.image} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <ImageIcon size={32} color="var(--text-muted)" />
                      )}
                    </div>
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        style={{ display: 'none' }}
                        id="image-upload"
                      />
                      <label
                        htmlFor="image-upload"
                        style={{
                          background: 'var(--glass-bg)',
                          border: '1px solid var(--border)',
                          padding: '10px 16px',
                          borderRadius: '10px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '8px',
                          fontSize: '14px',
                          transition: 'var(--transition)'
                        }}
                      >
                        {uploading ? <Loader2 size={18} className="animate-spin" /> : <><Plus size={18} /> Upload Image</>}
                      </label>
                      <input
                        type="text"
                        value={formData.image}
                        onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                        placeholder="Or paste image URL here..."
                        className="glass"
                        style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border)', color: 'white', outline: 'none', fontSize: '12px' }}
                      />
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="glass"
                    style={{ padding: '12px 16px', borderRadius: '12px', border: '1px solid var(--border)', color: 'white', outline: 'none', resize: 'none' }}
                  />
                </div>

                <button type="submit" className="btn-primary" style={{ marginTop: '12px', padding: '14px', gap: '8px' }}>
                  <Save size={20} />
                  {currentProduct ? 'Update Product' : 'Create Product'}
                </button>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
