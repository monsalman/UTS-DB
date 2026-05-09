'use client';
import React, { useState } from 'react';
import useSWR from 'swr';
import { History, Receipt, Calendar, User, CreditCard, ChevronRight, X, Loader2, Wallet, QrCode, CheckCircle, Clock, Package } from 'lucide-react';
import Sidebar from '@/components/Sidebar';
import Navbar from '@/components/Navbar';

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function TransactionHistory() {
  const { data: transactions, mutate, error } = useSWR('/api/transactions', fetcher, {
    refreshInterval: 3000, // Auto-update every 3 seconds
  });
  
  const [selectedTx, setSelectedTx] = useState(null);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);

  const loading = !transactions && !error;

  const updateStatus = async (id, newStatus) => {
    setUpdatingId(id);
    try {
      const res = await fetch('/api/transactions', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus }),
      });
      if (res.ok) {
        mutate(); // Instantly trigger SWR re-fetch
        if (selectedTx?.id === id) {
          setSelectedTx({ ...selectedTx, status: newStatus });
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return <span style={{ padding: '4px 12px', background: 'rgba(34, 197, 94, 0.1)', color: '#22c55e', borderRadius: '20px', fontSize: '12px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '6px' }}><CheckCircle size={14} /> Selesai</span>;
      case 'processing':
        return <span style={{ padding: '4px 12px', background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', borderRadius: '20px', fontSize: '12px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '6px' }}><Package size={14} /> Proses</span>;
      default:
        return <span style={{ padding: '4px 12px', background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', borderRadius: '20px', fontSize: '12px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '6px' }}><Clock size={14} /> Pending</span>;
    }
  };

  const getPaymentIcon = (method) => {
    switch (method?.toLowerCase()) {
      case 'qris': return <QrCode size={16} />;
      case 'edc': return <CreditCard size={16} />;
      default: return <Wallet size={16} />;
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
        
        <div className="fade-in" style={{ marginBottom: '40px' }}>
          <h2 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '8px' }}>Transaction History</h2>
          <p style={{ color: 'var(--text-muted)' }}>Monitor order statuses and audit sales in real-time.</p>
        </div>

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '100px' }}><Loader2 className="animate-spin" size={40} /></div>
        ) : (
          <div className="glass" style={{ borderRadius: '24px', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--border)', background: 'rgba(255,255,255,0.02)' }}>
                  <th style={{ padding: '20px' }}>Invoice ID</th>
                  <th style={{ padding: '20px' }}>Date & Time</th>
                  <th style={{ padding: '20px' }}>Status</th>
                  <th style={{ padding: '20px' }}>Total Amount</th>
                  <th style={{ padding: '20px' }}>Payment</th>
                  <th style={{ padding: '20px' }}>Staff</th>
                  <th style={{ padding: '20px' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {transactions?.map((tx) => (
                  <tr key={tx.id} className="table-row-hover" style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '20px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontWeight: '600' }}>
                        <Receipt size={18} color="var(--primary)" />
                        #INV-{tx.id.toString().padStart(5, '0')}
                      </div>
                    </td>
                    <td style={{ padding: '20px', fontSize: '14px' }}>
                      <div style={{ color: 'var(--text-muted)' }}>
                        {new Date(tx.created_at).toLocaleString('id-ID', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </td>
                    <td style={{ padding: '20px' }}>
                      {getStatusBadge(tx.status)}
                    </td>
                    <td style={{ padding: '20px', fontWeight: '700', color: 'var(--primary)' }}>
                      Rp {Number(tx.total_amount).toLocaleString()}
                    </td>
                    <td style={{ padding: '20px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', textTransform: 'uppercase', fontWeight: '600' }}>
                        {getPaymentIcon(tx.payment_method)}
                        {tx.payment_method}
                      </div>
                    </td>
                    <td style={{ padding: '20px', fontSize: '14px' }}>
                      {tx.employee?.username || (tx.table_id ? `Customer#${tx.table_id}` : 'System')}
                    </td>
                    <td style={{ padding: '20px' }}>
                      <button 
                        onClick={() => setSelectedTx(tx)}
                        style={{ background: 'var(--primary)', border: 'none', color: 'white', padding: '8px 16px', borderRadius: '10px', fontSize: '12px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                      >
                        Manage <ChevronRight size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Transaction Detail & Management Modal */}
        {selectedTx && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 3000, padding: '20px' }}>
            <div className="glass fade-in" style={{ width: '100%', maxWidth: '500px', borderRadius: '24px', overflow: 'hidden' }}>
              <div style={{ padding: '30px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h3 style={{ fontSize: '20px', fontWeight: '700' }}>Order Management</h3>
                  <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>#INV-{selectedTx.id.toString().padStart(5, '0')}</p>
                </div>
                <button onClick={() => setSelectedTx(null)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>
                  <X size={24} />
                </button>
              </div>
              
              <div style={{ padding: '30px' }}>
                <p style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '12px', textTransform: 'uppercase' }}>Update Status</p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '30px' }}>
                  {[
                    { id: 'pending', label: 'Pending', color: '#f59e0b' },
                    { id: 'processing', label: 'Proses', color: '#3b82f6' },
                    { id: 'completed', label: 'Selesai', color: '#22c55e' }
                  ].map((s) => (
                    <button
                      key={s.id}
                      onClick={() => updateStatus(selectedTx.id, s.id)}
                      disabled={updatingId === selectedTx.id}
                      style={{
                        padding: '12px',
                        borderRadius: '12px',
                        border: selectedTx.status === s.id ? `2px solid ${s.color}` : '1px solid var(--border)',
                        background: selectedTx.status === s.id ? `${s.color}20` : 'transparent',
                        color: selectedTx.status === s.id ? s.color : 'var(--text-muted)',
                        fontWeight: '700',
                        fontSize: '13px',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>

                <p style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '12px', textTransform: 'uppercase' }}>Order Items</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '30vh', overflowY: 'auto' }}>
                  {selectedTx.items?.map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '14px' }}>{item.quantity}x {item.name}</span>
                      <span style={{ fontSize: '14px', fontWeight: '600' }}>Rp {(item.price * item.quantity).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ padding: '30px', background: 'rgba(255,255,255,0.02)', borderTop: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '20px', fontWeight: '700' }}>
                  <span>Total</span>
                  <span style={{ color: 'var(--primary)' }}>Rp {Number(selectedTx.total_amount).toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
