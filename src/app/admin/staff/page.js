'use client';
import React, { useState, useEffect } from 'react';
import { UserPlus, Trash2, Shield, User, X, Save, Loader2 } from 'lucide-react';
import Sidebar from '@/components/Sidebar';
import Navbar from '@/components/Navbar';

export default function StaffManagement() {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    role: 'employee'
  });

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    try {
      const res = await fetch('/api/staff');
      const data = await res.json();
      setStaff(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/staff', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok) {
        setIsModalOpen(false);
        setFormData({ username: '', password: '', role: 'employee' });
        fetchStaff();
      } else {
        alert(data.message || 'Error creating staff');
      }
    } catch (err) {
      console.error(err);
      alert('Network error');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to remove this staff member?')) return;
    try {
      const res = await fetch(`/api/staff/${id}`, { method: 'DELETE' });
      if (res.ok) fetchStaff();
    } catch (err) {
      console.error(err);
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
            <h2 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '8px' }}>Staff Management</h2>
            <p style={{ color: 'var(--text-muted)' }}>Manage employee accounts and access levels.</p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="btn-primary" 
            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px' }}
          >
            <UserPlus size={20} />
            Add New Staff
          </button>
        </div>

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '100px' }}><Loader2 className="animate-spin" size={40} /></div>
        ) : (
          <div className="glass" style={{ borderRadius: '24px', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--border)', background: 'rgba(255,255,255,0.02)' }}>
                  <th style={{ padding: '20px' }}>Username</th>
                  <th style={{ padding: '20px' }}>Role</th>
                  <th style={{ padding: '20px' }}>Access Level</th>
                  <th style={{ padding: '20px' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {staff.map((member) => (
                  <tr key={member.id} className="table-row-hover" style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '20px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--glass-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <User size={20} />
                        </div>
                        <span style={{ fontWeight: '600' }}>{member.username}</span>
                      </div>
                    </td>
                    <td style={{ padding: '20px' }}>
                      <span style={{ 
                        padding: '6px 12px', 
                        borderRadius: '8px', 
                        fontSize: '13px', 
                        fontWeight: '600',
                        background: member.role === 'admin' ? 'rgba(139, 92, 246, 0.1)' : 'rgba(59, 130, 246, 0.1)',
                        color: member.role === 'admin' ? '#a78bfa' : '#60a5fa'
                      }}>
                        {member.role.toUpperCase()}
                      </span>
                    </td>
                    <td style={{ padding: '20px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '14px' }}>
                        <Shield size={16} />
                        {member.role === 'admin' ? 'Full Access' : 'POS Access Only'}
                      </div>
                    </td>
                    <td style={{ padding: '20px' }}>
                      <button 
                        onClick={() => handleDelete(member.id)}
                        style={{ background: 'rgba(239, 68, 68, 0.1)', border: 'none', color: '#ef4444', padding: '10px', borderRadius: '10px', cursor: 'pointer' }}
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Add Staff Modal */}
        {isModalOpen && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 3000, padding: '20px' }}>
            <div className="glass fade-in" style={{ width: '100%', maxWidth: '400px', padding: '40px', borderRadius: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <h3 style={{ fontSize: '24px', fontWeight: '700' }}>Add New Staff</h3>
                <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Username</label>
                  <input
                    type="text"
                    required
                    value={formData.username}
                    onChange={(e) => setFormData({...formData, username: e.target.value})}
                    className="glass"
                    style={{ padding: '12px 16px', borderRadius: '12px', border: '1px solid var(--border)', color: 'white', outline: 'none' }}
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Initial Password</label>
                  <input
                    type="password"
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    className="glass"
                    style={{ padding: '12px 16px', borderRadius: '12px', border: '1px solid var(--border)', color: 'white', outline: 'none' }}
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Role</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({...formData, role: e.target.value})}
                    className="glass"
                    style={{ padding: '12px 16px', borderRadius: '12px', border: '1px solid var(--border)', color: 'white', outline: 'none', background: '#1e293b' }}
                  >
                    <option value="employee">Employee (POS)</option>
                    <option value="admin">Manager (Admin)</option>
                  </select>
                </div>

                <button type="submit" className="btn-primary" style={{ marginTop: '12px', padding: '14px', gap: '8px' }}>
                  <Save size={20} />
                  Save Staff Account
                </button>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
