import React from 'react';
import { FaHome, FaBuilding, FaSearch, FaMapMarkerAlt } from 'react-icons/fa';

export default function ServicesSection(){
  const services = [
    {
      icon: <FaHome className="text-3xl" style={{color: '#2563eb'}} />,
      title: 'Compra e Venda',
      description: 'Ajudamos você a encontrar ou vender o imóvel ideal com assessoria completa.'
    },
    {
      icon: <FaBuilding className="text-3xl" style={{color: '#2563eb'}} />,
      title: 'Arrendamento',
      description: 'Gestão completa de aluguel de imóveis residenciais e comerciais.'
    },
    {
      icon: <FaSearch className="text-3xl" style={{color: '#2563eb'}} />,
      title: 'Avaliação Imobiliária',
      description: 'Avaliações profissionais e precisas para compra, venda ou seguros.'
    },
    {
      icon: <FaMapMarkerAlt className="text-3xl" style={{color: '#2563eb'}} />,
      title: 'Localização de Agência',
      description: 'Encontre nossas agências em Cabo Verde para atendimento presencial.'
    }
  ];

  return (
    <section style={{
      padding: '4rem 0',
      backgroundColor: '#f8fafc',
      borderTop: '1px solid #e5e7eb',
      borderBottom: '1px solid #e5e7eb'
    }}>
      <div className="container">
        <div style={{textAlign: 'center', marginBottom: '3rem'}}>
          <h2 style={{
            fontSize: '2.5rem',
            fontWeight: 'bold',
            color: '#1f2937',
            marginBottom: '1rem'
          }}>
            Nossos Serviços
          </h2>
          <p style={{
            fontSize: '1.125rem',
            color: '#6b7280',
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            Oferecemos soluções completas no mercado imobiliário de Cabo Verde,
            com profissionais especializados para atender todas as suas necessidades.
          </p>
        </div>

        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: '1.5rem',
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          {services.map((service, index) => (
            <div key={index} style={{
              backgroundColor: 'white',
              padding: '2rem',
              borderRadius: '1rem',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.07)',
              border: '1px solid #e5e7eb',
              transition: 'all 0.3s ease',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-5px)';
              e.target.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.15)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.07)';
            }}
            >
              <div style={{textAlign: 'center', marginBottom: '1.5rem'}}>
                {service.icon}
              </div>
              <h3 style={{
                fontSize: '1.25rem',
                fontWeight: '600',
                color: '#1f2937',
                textAlign: 'center',
                marginBottom: '1rem'
              }}>
                {service.title}
              </h3>
              <p style={{
                color: '#6b7280',
                textAlign: 'center',
                lineHeight: '1.6',
                margin: 0
              }}>
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}