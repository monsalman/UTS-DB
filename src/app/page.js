'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, QrCode } from 'lucide-react';
import { CATEGORIES } from '@/lib/constants';
import MenuCard from '@/components/MenuCard';
import Navbar from '@/components/Navbar';
import CartSidebar from '@/components/CartSidebar';
import { useAuth } from '@/context/AuthContext';
import Sidebar from '@/components/Sidebar';

export default function EmployeeDashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState([]);
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

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

  if (loading || !user) {
    return <div style={{ background: '#0f172a', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading...</div>;
  }

  const filteredProducts = products.filter(p => 
    (activeCategory === 'all' || p.category === activeCategory) &&
    (p.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-dark)' }}>
      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      
      <main style={{ 
        marginLeft: isCollapsed ? '80px' : '260px', 
        marginRight: '380px',
        flex: 1, 
        padding: '100px 24px 40px',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
      }}>
        <Navbar userType="employee" isSidebarCollapsed={isCollapsed} hasCart={true} />
        
        <div className="fade-in" style={{ marginBottom: '40px' }}>
          <h2 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '8px' }}>Create New Order</h2>
          <p style={{ color: 'var(--text-muted)' }}>Select items from the menu to build a customer transaction.</p>
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
          {filteredProducts.map((product) => (
            <MenuCard key={product.id} product={product} />
          ))}
        </div>
      </main>

      <CartSidebar />
    </div>
  );
}


