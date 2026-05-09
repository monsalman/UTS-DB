'use client';
import React, { useState, useEffect } from 'react';
import { X, ShoppingBag, Trash2, Plus, Minus, CreditCard, Loader2, Image as ImageIcon, Wallet, QrCode, CreditCard as CardIcon, CheckCircle } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';

const CartSidebar = ({ tableId: initialTableId }) => {
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('cash');

  useEffect(() => {
    if (!user) {
      setPaymentMethod('qris');
    }
  }, [user]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [tableInput, setTableInput] = useState(initialTableId || '');
  const [availableTables, setAvailableTables] = useState([]);
  const [isManualInput, setIsManualInput] = useState(false);
  const [showTableConfirm, setShowTableConfirm] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    fetchTables();
  }, []);

  const fetchTables = async () => {
    try {
      const res = await fetch('/api/tables');
      const data = await res.json();
      setAvailableTables(data);
    } catch (err) {
      console.error(err);
    }
  };

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  useEffect(() => {
    let timer;
    if (showSuccess) {
      timer = setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
    }
    return () => clearTimeout(timer);
  }, [showSuccess]);

  const handlePlaceOrder = async () => {
    if (cart.length === 0) return;
    
    let finalTableId = tableInput || initialTableId;

    if (!finalTableId) {
      setShowAlert(true);
      return;
    }

    if (user) {
      const exists = availableTables.find(t => t.table_number === finalTableId);
      if (!exists) {
        setShowTableConfirm(true);
        return;
      }
    }

    await executeTransaction(finalTableId);
  };

  const executeTransaction = async (finalTableId) => {
    setLoading(true);
    try {
      const res = await fetch('/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cart,
          totalAmount: total,
          employeeId: user?.id || null,
          tableId: finalTableId || null,
          paymentMethod: paymentMethod,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setShowSuccess(true);
        clearCart();
        if (!initialTableId) {
          setTableInput('');
          setIsManualInput(false);
        }
      } else {
        alert(`Error: ${data.message}`);
      }
    } catch (err) {
      console.error(err);
      alert('Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmAddTable = async () => {
    let finalTableId = tableInput || initialTableId;
    try {
      const res = await fetch('/api/tables', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ table_number: finalTableId }),
      });
      if (!res.ok) throw new Error('Failed to create table');
      await fetchTables();
      setShowTableConfirm(false);
      await executeTransaction(finalTableId);
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <>
      <div className="glass" style={{
      width: '380px',
      height: '100vh',
      position: 'fixed',
      right: 0,
      top: 0,
      display: 'flex',
      flexDirection: 'column',
      zIndex: 100,
      borderTop: 'none',
      borderRight: 'none',
      borderBottom: 'none',
      borderLeft: '1px solid var(--border)',
      background: 'rgba(15, 23, 42, 0.9)',
      backdropFilter: 'blur(20px)'
    }}>
      {/* Header Area */}
      <div style={{ padding: '20px 30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <ShoppingBag size={24} color="var(--primary)" />
          <h2 style={{ fontSize: '20px', fontWeight: '700' }}>Your Order</h2>
        </div>
        {cart.length > 0 && (
          <button onClick={clearCart} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '14px' }}>
            Clear All
          </button>
        )}
      </div>

      {/* Table Selection for Staff only */}
      {user && !initialTableId && (
        <div style={{ padding: '0 30px 20px' }}>
          <div className="glass" style={{ 
            padding: '12px 16px', 
            borderRadius: '12px', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '12px',
            border: '1px solid var(--border)' 
          }}>
            <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>TABLE:</span>
            
            {!isManualInput ? (
              <select 
                value={tableInput}
                onChange={(e) => {
                  if (e.target.value === 'NEW_TABLE') {
                    setIsManualInput(true);
                    setTableInput('');
                  } else {
                    setTableInput(e.target.value);
                  }
                }}
                style={{ background: 'none', border: 'none', color: 'white', fontSize: '14px', outline: 'none', width: '100%', fontWeight: '600', cursor: 'pointer' }}
              >
                <option value="" disabled style={{ background: '#0f172a' }}>Select table...</option>
                {availableTables.map(t => (
                  <option key={t.id} value={t.table_number} style={{ background: '#0f172a' }}>
                    Table #{t.table_number}
                  </option>
                ))}
                <option value="NEW_TABLE" style={{ background: '#0f172a', color: 'var(--primary)', fontWeight: '700' }}>
                  + Input New Table...
                </option>
              </select>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%' }}>
                <input 
                  type="text" 
                  placeholder="Enter number..."
                  value={tableInput}
                  autoFocus
                  onChange={(e) => setTableInput(e.target.value)}
                  style={{ background: 'none', border: 'none', color: 'white', fontSize: '14px', outline: 'none', width: '100%', fontWeight: '600' }}
                />
                <button 
                  onClick={() => setIsManualInput(false)}
                  style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                >
                  <X size={16} />
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Items List */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px' }}>
        {cart.length === 0 ? (
          <div style={{ textAlign: 'center', marginTop: '100px', color: 'var(--text-muted)' }}>
            <ShoppingBag size={48} style={{ marginBottom: '16px', opacity: 0.2 }} />
            <p>Your cart is empty</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {cart.map((item) => (
              <div key={item.id} style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <div style={{ width: '60px', height: '60px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                  {item.image ? (
                    <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <ImageIcon size={24} color="var(--text-muted)" />
                  )}
                </div>
                <div style={{ flex: 1 }}>
                  <h4 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '4px' }}>{item.name}</h4>
                  <p style={{ fontSize: '12px', color: 'var(--primary)', fontWeight: '700' }}>
                    Rp {Number(item.price).toLocaleString()}
                  </p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.05)', padding: '4px 8px', borderRadius: '8px' }}>
                  <button onClick={() => updateQuantity(item.id, -1)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}><Minus size={14} /></button>
                  <span style={{ fontSize: '14px', fontWeight: '600' }}>{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, 1)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}><Plus size={14} /></button>
                </div>
                <button onClick={() => removeFromCart(item.id)} style={{ background: 'none', border: 'none', color: '#ef4444', opacity: 0.5, cursor: 'pointer' }}>
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer / Checkout */}
      {cart.length > 0 && (
        <div className="glass" style={{ padding: '24px 30px', borderTop: '1px solid var(--border)', background: 'rgba(255,255,255,0.02)' }}>
          <div style={{ marginBottom: '20px' }}>
            <p style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '10px' }}>Payment Method</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
              {[
                { id: 'cash', label: 'Cash', icon: <Wallet size={14} /> },
                { id: 'qris', label: 'QRIS', icon: <QrCode size={14} /> },
                { id: 'edc', label: 'EDC', icon: <CardIcon size={14} /> }
              ].map((method) => {
                const isDisabled = !user && method.id !== 'qris';
                return (
                  <button
                    key={method.id}
                    disabled={isDisabled}
                    onClick={() => setPaymentMethod(method.id)}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '4px',
                      padding: '8px',
                      borderRadius: '10px',
                      border: paymentMethod === method.id ? '2px solid var(--primary)' : '1px solid var(--border)',
                      background: paymentMethod === method.id ? 'rgba(139, 92, 246, 0.1)' : 'rgba(255,255,255,0.02)',
                      color: paymentMethod === method.id ? 'var(--primary)' : 'var(--text-muted)',
                      cursor: isDisabled ? 'not-allowed' : 'pointer',
                      opacity: isDisabled ? 0.3 : 1,
                      transition: 'var(--transition)',
                      filter: isDisabled ? 'grayscale(1)' : 'none'
                    }}
                  >
                    {method.icon}
                    <span style={{ fontSize: '10px', fontWeight: '600' }}>{method.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: 'var(--text-muted)' }}>
              <span>Subtotal</span>
              <span>Rp {subtotal.toLocaleString()}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: 'var(--text-muted)' }}>
              <span>Tax (10%)</span>
              <span>Rp {tax.toLocaleString()}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '18px', fontWeight: '700', color: 'white', marginTop: '4px' }}>
              <span>Total</span>
              <span>Rp {total.toLocaleString()}</span>
            </div>
          </div>
          <button 
            onClick={handlePlaceOrder}
            disabled={loading}
            className="btn-primary" 
            style={{ width: '100%', padding: '14px', borderRadius: '12px', fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
          >
            {loading ? <Loader2 className="animate-spin" /> : <><CreditCard size={18} /> Place Order</>}
          </button>
        </div>
      )}
      </div>
      <SuccessModal show={showSuccess} onClose={() => setShowSuccess(false)} />
      <ConfirmModal 
        show={showTableConfirm} 
        tableNumber={tableInput || initialTableId}
        onConfirm={handleConfirmAddTable}
        onCancel={() => setShowTableConfirm(false)}
      />
      <AlertModal 
        show={showAlert} 
        message="Please select or input a table number first!"
        onClose={() => setShowAlert(false)}
      />
    </>
  );
};

const AlertModal = ({ show, message, onClose }) => {
  if (!show) return null;
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10000, padding: '20px' }}>
      <div className="glass fade-in" style={{ width: '100%', maxWidth: '360px', padding: '40px 24px', borderRadius: '32px', textAlign: 'center' }}>
        <div style={{ width: '70px', height: '70px', borderRadius: '50%', background: 'rgba(239, 68, 68, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
          <X size={32} color="#ef4444" />
        </div>
        <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '12px' }}>Required Field</h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '15px', lineHeight: '1.6', marginBottom: '32px' }}>
          {message}
        </p>
        <button 
          onClick={onClose}
          className="btn-primary"
          style={{ width: '100%', padding: '14px', borderRadius: '12px', fontWeight: '700' }}
        >
          Got it
        </button>
      </div>
    </div>
  );
};

const ConfirmModal = ({ show, tableNumber, onConfirm, onCancel }) => {
  if (!show) return null;
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '20px' }}>
      <div className="glass fade-in" style={{ width: '100%', maxWidth: '400px', padding: '40px 32px', borderRadius: '32px', textAlign: 'center' }}>
        <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(99, 102, 241, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
          <Plus size={40} color="var(--primary)" />
        </div>
        <h3 style={{ fontSize: '22px', fontWeight: '700', marginBottom: '12px' }}>New Table?</h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '15px', lineHeight: '1.6', marginBottom: '32px' }}>
          Table <strong>#{tableNumber}</strong> is not registered. <br/>Would you like to add it to the database?
        </p>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button 
            onClick={onCancel}
            style={{ flex: 1, padding: '14px', borderRadius: '12px', border: '1px solid var(--border)', background: 'none', color: 'white', fontWeight: '600', cursor: 'pointer' }}
          >
            Cancel
          </button>
          <button 
            onClick={onConfirm}
            className="btn-primary"
            style={{ flex: 1, padding: '14px', borderRadius: '12px', fontWeight: '700' }}
          >
            Yes, Add Table
          </button>
        </div>
      </div>
    </div>
  );
};

const SuccessModal = ({ show, onClose }) => {
  if (!show) return null;
  return (
    <div style={{ 
      position: 'fixed', 
      inset: 0, 
      background: 'rgba(0,0,0,0.85)', 
      backdropFilter: 'blur(10px)', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      zIndex: 9999, 
      padding: '20px' 
    }}>
      <div className="glass fade-in" style={{ width: '100%', maxWidth: '380px', padding: '48px 32px', borderRadius: '32px', textAlign: 'center', position: 'relative' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: '20px', right: '20px', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
          <X size={24} />
        </button>
        <div style={{ width: '90px', height: '90px', borderRadius: '50%', background: 'rgba(34, 197, 94, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 28px' }}>
          <CheckCircle size={54} color="#22c55e" />
        </div>
        <h3 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '12px' }}>Transaction successful!</h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '15px', lineHeight: '1.6' }}>
          Your order has been placed successfully.<br/>Please wait for your items to be served.
        </p>
      </div>
    </div>
  );
};

export default CartSidebar;
