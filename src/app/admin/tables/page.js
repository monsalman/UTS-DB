'use client';
import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Plus, Download, Trash2, Loader2, Tablet } from 'lucide-react';
import Sidebar from '@/components/Sidebar';
import Navbar from '@/components/Navbar';

export default function TableManagement() {
  const [tables, setTables] = useState([]);
  const [newTableNumber, setNewTableNumber] = useState('');
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    fetchTables();
  }, []);

  const fetchTables = async () => {
    try {
      const res = await fetch('/api/tables');
      const data = await res.json();
      setTables(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const addTable = async (e) => {
    e.preventDefault();
    if (!newTableNumber) return;
    setAdding(true);
    try {
      const res = await fetch('/api/tables', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ table_number: newTableNumber }),
      });
      if (res.ok) {
        setNewTableNumber('');
        fetchTables();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setAdding(false);
    }
  };

  const downloadQR = (tableNum) => {
    const svg = document.getElementById(`qr-${tableNum}`);
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.download = `QR-Table-${tableNum}.png`;
      downloadLink.href = `${pngFile}`;
      downloadLink.click();
    };
    img.src = "data:image/svg+xml;base64," + btoa(svgData);
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
          <h2 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '8px' }}>Table Management</h2>
          <p style={{ color: 'var(--text-muted)' }}>Create and manage table QR codes for customer ordering.</p>
        </div>

        {/* Add Table Form */}
        <div className="glass" style={{ padding: '24px', borderRadius: '20px', marginBottom: '40px' }}>
          <form onSubmit={addTable} style={{ display: 'flex', gap: '16px', alignItems: 'flex-end' }}>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '14px', fontWeight: '500', color: 'var(--text-muted)' }}>New Table Number</label>
              <input
                type="text"
                placeholder="e.g. 05"
                value={newTableNumber}
                onChange={(e) => setNewTableNumber(e.target.value)}
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid var(--border)',
                  color: 'white',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  outline: 'none'
                }}
              />
            </div>
            <button 
              type="submit" 
              disabled={adding}
              className="btn-primary" 
              style={{ height: '45px', padding: '0 30px' }}
            >
              {adding ? <Loader2 className="animate-spin" /> : <><Plus size={20} style={{ marginRight: '8px' }} /> Add Table</>}
            </button>
          </form>
        </div>

        {/* Tables Grid */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '50px' }}><Loader2 className="animate-spin" size={40} /></div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
            {tables.map((table) => {
              const customerUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/customer/${table.table_number}`;
              return (
                <div key={table.id} className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
                  <div style={{ 
                    background: 'white', 
                    padding: '16px', 
                    borderRadius: '16px',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.2)'
                  }}>
                    <QRCodeSVG 
                      id={`qr-${table.table_number}`}
                      value={customerUrl} 
                      size={180}
                      level="H"
                      includeMargin={true}
                    />
                  </div>
                  
                  <div style={{ textAlign: 'center' }}>
                    <h3 style={{ fontSize: '20px', fontWeight: '700' }}>Table {table.table_number}</h3>
                    <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>{customerUrl}</p>
                  </div>

                  <div style={{ display: 'flex', gap: '12px', width: '100%' }}>
                    <button 
                      onClick={() => downloadQR(table.table_number)}
                      style={{
                        flex: 1,
                        background: 'var(--glass-bg)',
                        border: '1px solid var(--border)',
                        color: 'white',
                        padding: '12px',
                        borderRadius: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        cursor: 'pointer',
                        transition: 'var(--transition)'
                      }}
                      onMouseOver={(e) => e.currentTarget.style.borderColor = 'var(--primary)'}
                      onMouseOut={(e) => e.currentTarget.style.borderColor = 'var(--border)'}
                    >
                      <Download size={18} />
                      Download
                    </button>
                    <button style={{
                      background: 'rgba(239, 68, 68, 0.1)',
                      border: '1px solid rgba(239, 68, 68, 0.2)',
                      color: '#ef4444',
                      padding: '12px',
                      borderRadius: '12px',
                      cursor: 'pointer'
                    }}>
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
