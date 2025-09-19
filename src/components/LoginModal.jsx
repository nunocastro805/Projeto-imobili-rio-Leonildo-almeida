import React, { useState } from 'react';
import { FaLock, FaTimes, FaKey } from 'react-icons/fa';

export default function LoginModal({ onLogin, onClose, role, accessCodes }){
  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  function handleSubmit(e){
    e.preventDefault();
    const expectedCode = role === 'administrador' ? accessCodes.admin : accessCodes.owner;
    if (code === expectedCode) {
      onLogin();
      setError('');
    } else {
      setError('Código de acesso incorreto');
    }
  }

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 2000
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '2rem',
        borderRadius: '1rem',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
        maxWidth: '400px',
        width: '90%',
        position: 'relative'
      }}>
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            background: 'none',
            border: 'none',
            fontSize: '1.5rem',
            color: '#6b7280',
            cursor: 'pointer'
          }}
        >
          <FaTimes />
        </button>

        <div style={{textAlign: 'center', marginBottom: '2rem'}}>
          <div style={{
            width: '4rem',
            height: '4rem',
            backgroundColor: '#8b5cf6',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1rem'
          }}>
            <FaLock style={{color: 'white', fontSize: '1.5rem'}} />
          </div>
          <h2 style={{fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '0.5rem'}}>
            Acesso Restrito
          </h2>
          <p style={{color: '#6b7280'}}>
            Digite o código de acesso para {role === 'administrador' ? 'Administrador' : 'Dono da Empresa'}
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
          <div>
            <label style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: '500',
              color: '#374151',
              marginBottom: '0.5rem',
              display: 'flex',
              alignItems: 'center'
            }}>
              <FaKey style={{marginRight: '0.5rem', color: '#6b7280'}} />
              Código de Acesso
            </label>
            <input
              type="password"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Digite o código..."
              className="form-input"
              style={{textAlign: 'center', fontSize: '1.125rem', fontWeight: '600'}}
              required
            />
          </div>

          {error && (
            <div style={{
              backgroundColor: '#fef2f2',
              color: '#dc2626',
              padding: '0.75rem',
              borderRadius: '0.5rem',
              fontSize: '0.875rem',
              textAlign: 'center'
            }}>
              {error}
            </div>
          )}

          <button type="submit" className="btn" style={{width: '100%', fontSize: '1.125rem'}}>
            Acessar Painel
          </button>
        </form>

        <div style={{
          marginTop: '1.5rem',
          padding: '1rem',
          backgroundColor: '#f8fafc',
          borderRadius: '0.5rem',
          fontSize: '0.75rem',
          color: '#64748b',
          textAlign: 'center'
        }}>
          <strong>Nota:</strong> Este código é confidencial e deve ser mantido em segurança.
          Entre em contato com o administrador do sistema se esqueceu o código.
        </div>
      </div>
    </div>
  );
}