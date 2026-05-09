'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import CartSidebar from '@/components/CartSidebar';

export default function GenericCustomerPage() {
  const router = useRouter();
  const [tableNumber, setTableNumber] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem('customerTable');
    if (saved) {
      setTableNumber(saved);
    }
  }, [router]);

  return (
    <div style={{ padding: '100px 24px 40px', textAlign: 'center', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Navbar userType="customer" tableId={tableNumber} hasCart={false} />

      <div className="fade-in glass" style={{ padding: '60px', borderRadius: '24px', maxWidth: '600px', marginTop: '100px' }}>
        <h2 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '16px' }}>Scan Your Table QR</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '32px' }}>
          Please scan the QR code located on your table to start ordering.
        </p>
        {tableNumber && (
          <button 
            onClick={() => router.push(`/customer/${tableNumber}`)}
            className="btn-primary"
          >
            Continue to Table #{tableNumber}
          </button>
        )}
      </div>
    </div>
  );
}
