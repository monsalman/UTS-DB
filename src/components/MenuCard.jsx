'use client';
import React from 'react';
import { Plus, Info, Image as ImageIcon } from 'lucide-react';
import { useCart } from '@/context/CartContext';

const MenuCard = ({ product }) => {
  const { addToCart } = useCart();

  return (
    <div className="card fade-in" style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
      height: '100%',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div style={{
        width: '100%',
        height: '160px',
        borderRadius: '12px',
        overflow: 'hidden',
        position: 'relative',
        background: 'rgba(255,255,255,0.05)'
      }}>
        {product.image ? (
          <img 
            src={product.image} 
            alt={product.name} 
            style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'var(--transition)' }}
          />
        ) : (
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ImageIcon size={48} color="var(--text-muted)" style={{ opacity: 0.3 }} />
          </div>
        )}
        <div style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          background: 'rgba(0,0,0,0.5)',
          padding: '4px 8px',
          borderRadius: '8px',
          fontSize: '12px',
          backdropFilter: 'blur(4px)'
        }}>
          Rp {product.price.toLocaleString()}
        </div>
      </div>

      <div>
        <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '4px' }}>{product.name}</h3>
        <p style={{ fontSize: '13px', color: 'var(--text-muted)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {product.description}
        </p>
      </div>

      <div style={{ marginTop: 'auto', display: 'flex', gap: '8px' }}>
        <button 
          onClick={() => addToCart(product)}
          className="btn-primary" 
          style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '10px' }}
        >
          <Plus size={18} />
          Add
        </button>
        <button style={{
          background: 'var(--glass-bg)',
          border: '1px solid var(--border)',
          borderRadius: '12px',
          padding: '10px',
          color: 'var(--text-main)',
          cursor: 'pointer'
        }}>
          <Info size={18} />
        </button>
      </div>
    </div>
  );
};

export default MenuCard;
