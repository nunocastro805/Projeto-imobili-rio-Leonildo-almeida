import React from 'react';
import { FaHome, FaUser, FaSignOutAlt } from 'react-icons/fa';

export default function Navbar({ role, onChangeRole, onLogout, isAuthenticated }){

  return (
    <nav style={{background: 'transparent', color: 'white', boxShadow: 'none', position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10}}>
      <div className="container">
        <div className="flex justify-between items-center" style={{height: '4rem'}}>
          <div className="flex items-center space-x-2">
            <FaHome className="text-xl" />
            <span className="font-bold text-lg">Almeida Imobiliaria</span>
          </div>
          <div className="flex items-center space-x-4">
            {(role === 'administrador' || role === 'dono') && isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <span style={{color: 'white', fontSize: '0.875rem'}}>
                  <FaUser style={{marginRight: '0.5rem'}} />
                  {role === 'administrador' ? 'Administrador' : 'Dono'} (Autenticado)
                </span>
                <button
                  onClick={onLogout}
                  style={{
                    backgroundColor: '#dc2626',
                    color: 'white',
                    border: 'none',
                    borderRadius: '0.25rem',
                    padding: '0.5rem 1rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    fontSize: '0.875rem'
                  }}
                >
                  <FaSignOutAlt style={{marginRight: '0.5rem'}} />
                  Sair
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <FaUser className="text-sm" />
                  <label className="text-sm font-medium">Perfil:</label>
                </div>
                <select value={role} onChange={e => onChangeRole(e.target.value)} style={{backgroundColor: '#3b82f6', color: 'white', border: '1px solid #60a5fa', borderRadius: '0.25rem', padding: '0.25rem 0.75rem'}}>
                  <option value="cliente">Cliente</option>
                  <option value="administrador">Administrador</option>
                  <option value="dono">Dono da Empresa</option>
                </select>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
