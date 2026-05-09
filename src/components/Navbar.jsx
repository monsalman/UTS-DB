'use client';
import React from 'react';
import { ShoppingBag, User, LogOut, History } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';

const Navbar = ({ toggleCart, toggleHistory, userType, tableId, isSidebarCollapsed, hasCart, isCartOpen }) => {
  const { user, logout } = useAuth();
  const { cart } = useCart();

  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <nav className="glass" style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      height: '70px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: userType === 'employee'
        ? `0 ${hasCart ? '404px' : '24px'} 0 ${isSidebarCollapsed ? '104px' : '284px'}`
        : `0 ${hasCart ? '404px' : '24px'} 0 24px`,
      zIndex: 50,
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      borderBottom: '1px solid var(--border)',
      borderTop: 'none',
      borderLeft: 'none',
      borderRight: 'none'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {userType === 'customer' && (
          <>
            <div style={{
              width: '40px',
              height: '40px',
              background: 'var(--primary)',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold',
              fontSize: '20px'
            }}>G</div>
            <h1 style={{ fontSize: '20px', fontWeight: '700', letterSpacing: '1px' }}>
              GLOW<span style={{ color: 'var(--primary)' }}>POS</span>
            </h1>
          </>
        )}
      </div>

      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '20px',
      }}>
        {userType === 'customer' && (
          <button 
            onClick={toggleHistory}
            style={{ 
              background: 'none', 
              border: 'none', 
              color: 'var(--text-muted)', 
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <History size={20} />
            <span className="desktop-only" style={{ fontSize: '14px', fontWeight: '600' }}>History</span>
          </button>
        )}
        <div className="desktop-only" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)' }}>
          <User size={18} />
          <span style={{ fontSize: '14px' }}>
            {userType === 'employee' ? `Staff - ${user?.username || 'Admin'}` : `Table #${tableId || '??'}`}
          </span>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
