'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { QRCodeSVG } from 'qrcode.react';
import Navbar from '@/components/Navbar';
import CartSidebar from '@/components/CartSidebar';

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://utsdb.sudoman.my.id';

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

        <div style={{ marginBottom: '32px' }}>
          <p style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '16px' }}>Contoh QR Code Table #1:</p>
          <div style={{ 
            display: 'inline-block', 
            background: 'white', 
            padding: '20px', 
            borderRadius: '16px',
            boxShadow: '0 0 20px rgba(139, 92, 246, 0.3)'
          }}>
            <QRCodeSVG 
              value={`${APP_URL}/customer/1`} 
              size={200}
              level="H"
            />
          </div>
          <p style={{ fontSize: '13px', color: 'var(--primary)', marginTop: '12px' }}>
            {APP_URL}/customer/1
          </p>
        </div>

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
