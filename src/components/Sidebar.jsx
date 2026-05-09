'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Tablet, Users, LogOut, ChevronLeft, ChevronRight, Menu, History } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const Sidebar = ({ isCollapsed, setIsCollapsed }) => {
  const pathname = usePathname();
  const { logout } = useAuth();

  const menuItems = [
    { name: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/' },
    { name: 'Table Management', icon: <Tablet size={20} />, path: '/admin/tables' },
    { name: 'Product Management', icon: <Users size={20} />, path: '/admin/products' },
    { name: 'Staff Management', icon: <Users size={20} />, path: '/admin/staff' },
    { name: 'Transaction History', icon: <History size={20} />, path: '/admin/transactions' },
  ];

  return (
    <aside className="glass" style={{
      width: isCollapsed ? '80px' : '260px',
      height: '100vh',
      position: 'fixed',
      left: 0,
      top: 0,
      padding: '30px 15px',
      display: 'flex',
      flexDirection: 'column',
      zIndex: 1000,
      borderTop: 'none',
      borderLeft: 'none',
      borderBottom: 'none',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: isCollapsed ? 'center' : 'space-between',
        marginBottom: '50px'
      }}>
        {!isCollapsed && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '32px',
              height: '32px',
              background: 'var(--primary)',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold',
              fontSize: '16px'
            }}>G</div>
            <h1 style={{ fontSize: '18px', fontWeight: '700', letterSpacing: '1px' }}>
              GLOW<span style={{ color: 'var(--primary)' }}>POS</span>
            </h1>
          </div>
        )}
        {isCollapsed && (
          <div style={{
            width: '32px',
            height: '32px',
            background: 'var(--primary)',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 'bold',
            fontSize: '16px'
          }}>G</div>
        )}
      </div>

      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        style={{
          position: 'absolute',
          right: '-12px',
          top: '35px',
          width: '24px',
          height: '24px',
          background: 'var(--primary)',
          border: 'none',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          cursor: 'pointer',
          boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
          zIndex: 1100
        }}
      >
        {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>

      <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {menuItems.map((item) => (
          <Link
            key={item.path}
            href={item.path}
            title={isCollapsed ? item.name : ''}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: isCollapsed ? 'center' : 'flex-start',
              gap: isCollapsed ? '0' : '12px',
              padding: '12px',
              borderRadius: '12px',
              textDecoration: 'none',
              color: pathname === item.path ? 'white' : 'var(--text-muted)',
              background: pathname === item.path ? 'var(--primary)' : 'transparent',
              transition: 'var(--transition)',
              fontWeight: pathname === item.path ? '600' : '400',
              overflow: 'hidden'
            }}
          >
            <div style={{ minWidth: '20px', display: 'flex', justifyContent: 'center' }}>{item.icon}</div>
            {!isCollapsed && <span style={{ whiteSpace: 'nowrap' }}>{item.name}</span>}
          </Link>
        ))}
      </nav>

      <button
        onClick={logout}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: isCollapsed ? 'center' : 'flex-start',
          gap: isCollapsed ? '0' : '12px',
          padding: '12px',
          borderRadius: '12px',
          border: 'none',
          background: 'none',
          color: '#ef4444',
          cursor: 'pointer',
          marginTop: 'auto',
          transition: 'var(--transition)'
        }}
      >
        <div style={{ minWidth: '20px', display: 'flex', justifyContent: 'center' }}><LogOut size={20} /></div>
        {!isCollapsed && <span style={{ fontWeight: '600', whiteSpace: 'nowrap' }}>Logout</span>}
      </button>
    </aside>
  );
};

export default Sidebar;
