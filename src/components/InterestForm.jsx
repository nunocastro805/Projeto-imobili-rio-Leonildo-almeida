import React, { useState } from 'react';
import { FaUser, FaPhone, FaEnvelope, FaTimes, FaCheckCircle } from 'react-icons/fa';

export default function InterestForm({ listing, onSubmit, onClose }){
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  function handleSubmit(e){
    e.preventDefault();
    const lead = {
      id: Date.now(),
      listingId: listing.id,
      listingTitle: listing.title,
      name,
      phone,
      email,
      message,
      date: new Date().toISOString(),
      status: 'novo'
    };
    onSubmit(lead);
    setShowSuccess(true);
    setTimeout(() => {
      onClose();
    }, 3000);
  }

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '2rem',
        borderRadius: '1rem',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)',
        maxWidth: '500px',
        width: '90%',
        maxHeight: '90vh',
        overflow: 'auto'
      }}>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem'}}>
          <h3 style={{fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937'}}>
            Interesse em: {listing.title}
          </h3>
          <button onClick={onClose} style={{color: '#6b7280', fontSize: '1.5rem'}}>
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
          <div>
            <label style={{display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem', display: 'flex', alignItems: 'center'}}>
              <FaUser style={{marginRight: '0.5rem', color: '#6b7280'}} />
              Nome Completo
            </label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              required
              className="form-input"
              placeholder="Seu nome completo"
            />
          </div>

          <div>
            <label style={{display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem', display: 'flex', alignItems: 'center'}}>
              <FaPhone style={{marginRight: '0.5rem', color: '#6b7280'}} />
              Telefone
            </label>
            <input
              type="tel"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              required
              className="form-input"
              placeholder="+238 XXX XXX XXX"
            />
          </div>

          <div>
            <label style={{display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem', display: 'flex', alignItems: 'center'}}>
              <FaEnvelope style={{marginRight: '0.5rem', color: '#6b7280'}} />
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="form-input"
              placeholder="seu@email.com"
            />
          </div>

          <div>
            <label style={{display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem'}}>
              Mensagem (opcional)
            </label>
            <textarea
              value={message}
              onChange={e => setMessage(e.target.value)}
              className="form-input"
              style={{height: '4rem', resize: 'none'}}
              placeholder="Conte-nos mais sobre seu interesse..."
            />
          </div>

          <div style={{display: 'flex', gap: '1rem', marginTop: '1rem'}}>
            <button type="submit" className="btn" style={{flex: 1}}>
              Enviar Interesse
            </button>
            <button type="button" onClick={onClose} style={{
              flex: 1,
              padding: '0.75rem 1.5rem',
              border: '2px solid #d1d5db',
              backgroundColor: 'white',
              color: '#6b7280',
              borderRadius: '0.5rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}>
              Cancelar
            </button>
          </div>
        </form>
      </div>

      {showSuccess && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1001
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '2rem',
            borderRadius: '1rem',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)',
            maxWidth: '400px',
            width: '90%',
            textAlign: 'center'
          }}>
            <FaCheckCircle style={{fontSize: '3rem', color: '#10b981', marginBottom: '1rem'}} />
            <h3 style={{fontSize: '1.25rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '1rem'}}>
              Mensagem Enviada com Sucesso!
            </h3>
            <p style={{color: '#6b7280', lineHeight: '1.5'}}>
              Entraremos em contacto com a senhora ou senhor em breve para discutir os próximos passos.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}