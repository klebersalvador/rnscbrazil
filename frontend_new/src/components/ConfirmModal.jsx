import React from 'react';
import { createPortal } from 'react-dom';
import { AlertCircle, X, CheckCircle } from 'lucide-react';

export default function ConfirmModal({ isOpen, onClose, onConfirm, title, message, confirmText = 'Excluir', confirmColor = '#e63946', isDanger = true, isLoading = false }) {
  if (!isOpen) return null;

  const modalContent = (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
      backdropFilter: 'blur(5px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 999999
    }}>
      <div className="glass-panel animate-fade-in" style={{
        maxWidth: '400px',
        width: '90%',
        padding: '2rem',
        position: 'relative',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
      }}>
        <button 
          onClick={onClose}
          disabled={isLoading}
          style={{ 
            position: 'absolute', top: '15px', right: '15px', 
            background: 'none', border: 'none', color: '#a0aab2', cursor: isLoading ? 'not-allowed' : 'pointer',
            padding: '5px',
            opacity: isLoading ? 0.5 : 1
          }}
        >
          <X size={20} />
        </button>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '15px' }}>
          <div style={{ 
            background: isDanger ? 'rgba(230, 57, 70, 0.1)' : 'rgba(212, 175, 55, 0.1)', 
            padding: '1rem', 
            borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            {isDanger ? (
              <AlertCircle size={40} style={{ color: confirmColor }} />
            ) : (
              <AlertCircle size={40} style={{ color: confirmColor }} /> // Mantemos AlertCircle genérico para evitar erro caso CheckCircle não exista
            )}
          </div>
          
          <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '600', color: '#fff' }}>{title}</h3>
          <p style={{ color: '#a0aab2', margin: 0, fontSize: '0.95rem', lineHeight: '1.5' }}>{message}</p>
          
          <div style={{ display: 'flex', gap: '15px', marginTop: '1.5rem', width: '100%' }}>
            <button 
              className="btn btn-secondary" 
              style={{ flex: 1, padding: '0.8rem', opacity: isLoading ? 0.5 : 1 }} 
              onClick={onClose}
              disabled={isLoading}
            >
              Cancelar
            </button>
            <button 
              className="btn btn-primary" 
              style={{ 
                flex: 1, 
                padding: '0.8rem', 
                backgroundColor: confirmColor, 
                color: '#fff',
                border: 'none',
                opacity: isLoading ? 0.7 : 1,
                cursor: isLoading ? 'not-allowed' : 'pointer',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '8px'
              }} 
              onClick={onConfirm}
              disabled={isLoading}
            >
              {isLoading ? 'Aguarde...' : confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
