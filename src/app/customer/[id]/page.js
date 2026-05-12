'use client';
import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import useSWR from 'swr';
import { Search, History, X, Receipt, Clock, Package, CheckCircle } from 'lucide-react';
import { CATEGORIES } from '@/lib/constants';
import MenuCard from '@/components/MenuCard';
import Navbar from '@/components/Navbar';
import CartSidebar from '@/components/CartSidebar';

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function CustomerTablePage() {
  const { id } = useParams();
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [tableNumber, setTableNumber] = useState(id || '??');
  const [products, setProducts] = useState([]);

  // Use SWR for history to get real-time status updates
  const { data: history, error } = useSWR(
    isHistoryOpen ? `/api/transactions?tableId=${tableNumber}` : null,
    fetcher,
    { refreshInterval: 3000 }
  );

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/products');
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        console.error('Error fetching products:', err);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    if (id) {
      localStorage.setItem('customerTable', id);
      setTableNumber(id);
    } else {
      const saved = localStorage.getItem('customerTable');
      if (saved) setTableNumber(saved);
    }
  }, [id]);

  const getStatusDisplay = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return <span style={{ color: '#22c55e', display: 'flex', alignItems: 'center', gap: '4px' }}><CheckCircle size={12} /> Selesai</span>;
      case 'processing':
        return <span style={{ color: '#3b82f6', display: 'flex', alignItems: 'center', gap: '4px' }}><Package size={12} /> Sedang Disiapkan</span>;
      default:
        return <span style={{ color: '#f59e0b', display: 'flex', alignItems: 'center', gap: '4px' }}><Clock size={12} /> Menunggu</span>;
    }
  };

  const filteredProducts = products.filter(p => 
    (activeCategory === 'all' || p.category === activeCategory) &&
    (p.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div style={{ padding: '100px 404px 40px 24px' }}>
      <Navbar 
        toggleCart={() => setIsCartOpen(!isCartOpen)} 
        toggleHistory={() => setIsHistoryOpen(true)}
        userType="customer" 
        tableId={tableNumber} 
        hasCart={true}
      />
      <CartSidebar tableId={tableNumber} isOpen={isCartOpen} toggleCart={() => setIsCartOpen(false)} />

      {/* History Modal */}
      {isHistoryOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 3000, padding: '20px' }}>
          <div className="glass fade-in" style={{ width: '100%', maxWidth: '500px', borderRadius: '24px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '24px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <History size={24} color="var(--primary)" />
                <h3 style={{ fontSize: '20px', fontWeight: '700' }}>Order History</h3>
              </div>
              <button onClick={() => setIsHistoryOpen(false)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>
                <X size={24} />
              </button>
            </div>

            <div style={{ padding: '24px', maxHeight: '70vh', overflowY: 'auto' }}>
              {!history || history.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px 0' }}>
                  <Receipt size={48} color="var(--text-muted)" style={{ marginBottom: '16px' }} />
                  <p style={{ color: 'var(--text-muted)' }}>{error ? 'Gagal memuat data' : 'Belum ada pesanan'}</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {history.map((tx) => (
                    <div key={tx.id} className="glass" style={{ padding: '16px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', alignItems: 'center' }}>
                        <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--primary)' }}>#INV-{tx.id}</span>
                        <div style={{ fontSize: '12px', fontWeight: '700' }}>
                          {getStatusDisplay(tx.status)}
                        </div>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {tx.items?.map((item, idx) => (
                          <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                            <span>{(item.quantity || item.qty)}x {item.name}</span>
                            <span style={{ color: 'var(--text-muted)' }}>Rp {((item.price || 0) * (item.quantity || item.qty || 0)).toLocaleString()}</span>
                          </div>
                        ))}
                      </div>
                      <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', fontWeight: '700' }}>
                        <span>Total</span>
                        <span>Rp {Number(tx.total_amount).toLocaleString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="fade-in" style={{ marginBottom: '40px' }}>
        <h2 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '8px' }}>
          Welcome to Table #{tableNumber}
        </h2>
        <p style={{ color: 'var(--text-muted)' }}>
          Scan the QR code or select items to place your order.
        </p>
      </div>

      <div style={{ display: 'flex', gap: '16px', marginBottom: '32px', flexWrap: 'wrap', alignItems: 'center' }}>
        <div className="glass" style={{ flex: 1, minWidth: '280px', display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 20px', borderRadius: '16px' }}>
          <Search size={20} color="var(--text-muted)" />
          <input 
            type="text" 
            placeholder="Search menu..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ background: 'none', border: 'none', color: 'white', fontSize: '15px', outline: 'none', width: '100%' }}
          />
        </div>

        <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '8px', width: '100%' }}>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              style={{
                whiteSpace: 'nowrap',
                padding: '10px 20px',
                borderRadius: '12px',
                border: activeCategory === cat.id ? 'none' : '1px solid var(--border)',
                background: activeCategory === cat.id ? 'var(--primary)' : 'var(--glass-bg)',
                color: activeCategory === cat.id ? 'white' : 'var(--text-muted)',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'var(--transition)'
              }}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '24px' }}>
        {products.filter(p => 
          (activeCategory === 'all' || p.category === activeCategory) &&
          (p.name.toLowerCase().includes(searchQuery.toLowerCase()))
        ).map((product) => (
          <MenuCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
