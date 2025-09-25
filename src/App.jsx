import React, { useState, useMemo, useEffect } from 'react';
import Navbar from './components/Navbar';
import ListingCard from './components/ListingCard';
import ListingForm from './components/ListingForm';
import Dashboard from './components/Dashboard';
import LoginModal from './components/LoginModal';
import ServicesSection from './components/ServicesSection';
import sampleListings from './data/sampleListings';
import { FaSearch, FaPhone, FaEnvelope, FaMapMarkerAlt, FaLock } from 'react-icons/fa';

export default function App(){
  const [role, setRole] = useState('cliente');
  const [listings, setListings] = useState(() => {
    const savedListings = localStorage.getItem('listings');
    return savedListings ? JSON.parse(savedListings) : sampleListings;
  });
  const [filter, setFilter] = useState('todos');
  const [search, setSearch] = useState('');
  const [leads, setLeads] = useState(() => {
    const savedLeads = localStorage.getItem('leads');
    return savedLeads ? JSON.parse(savedLeads) : [
      {
        id: 1,
        listingId: 1,
        listingTitle: 'T1 espaçoso no Plateau',
        name: 'João Silva',
        phone: '+238 9XX XXX XXX',
        email: 'joao.silva@email.com',
        message: 'Gostaria de agendar uma visita para este apartamento.',
        date: '2024-01-15T10:30:00.000Z',
        status: 'novo'
      },
      {
        id: 2,
        listingId: 2,
        listingTitle: 'T3 moderno - Achada de Santo António',
        name: 'Maria Santos',
        phone: '+238 9YY YYY YYY',
        email: 'maria.santos@email.com',
        message: 'Estou interessada em comprar este imóvel. Qual o processo?',
        date: '2024-01-14T15:45:00.000Z',
        status: 'contatado'
      }
    ];
  });
  const [owners, setOwners] = useState(() => {
    const savedOwners = localStorage.getItem('owners');
    return savedOwners ? JSON.parse(savedOwners) : [
      {
        id: 1,
        name: 'Carlos Rodrigues',
        phone: '+238 9AA AAA AAA',
        email: 'carlos.rodrigues@email.com',
        address: 'Rua da Praia, Plateau',
        notes: 'Proprietário de vários imóveis no Plateau'
      },
      {
        id: 2,
        name: 'Ana Pereira',
        phone: '+238 9BB BBB BBB',
        email: 'ana.pereira@email.com',
        address: 'Achada de Santo António',
        notes: 'Proprietária de casa para venda'
      }
    ];
  });
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const [showPropertySearch, setShowPropertySearch] = useState(false);

  // Request notification permission on mount
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  // Dados de contato da empresa
  const [contactInfo, setContactInfo] = useState(() => {
    const savedContact = localStorage.getItem('contactInfo');
    return savedContact ? JSON.parse(savedContact) : {
      phone: '+238 9X XXX XXX',
      email: 'leonildo@mobilaria.cv'
    };
  });

  // Códigos de acesso
  const [accessCodes, setAccessCodes] = useState(() => {
    const savedCodes = localStorage.getItem('accessCodes');
    return savedCodes ? JSON.parse(savedCodes) : {
      admin: 'ADMIN2024',
      owner: 'DONO2024'
    };
  });

  // Save listings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('listings', JSON.stringify(listings));
  }, [listings]);

  // Save leads to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('leads', JSON.stringify(leads));
  }, [leads]);

  // Save owners to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('owners', JSON.stringify(owners));
  }, [owners]);

  // Save contactInfo to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('contactInfo', JSON.stringify(contactInfo));
  }, [contactInfo]);

  // Save accessCodes to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('accessCodes', JSON.stringify(accessCodes));
  }, [accessCodes]);

  function handleCreate(newListing){
    setListings([newListing, ...listings]);
  }

  function handleDelete(id){
    setListings(listings.filter(l => l.id !== id));
  }

  function handleInterestSubmit(lead){
    setLeads([lead, ...leads]);

    // Notify admins if authenticated
    if ((role === 'administrador' || role === 'dono') && isAuthenticated) {
      if (Notification.permission === 'granted') {
        new Notification('Nova mensagem de cliente', {
          body: `${lead.name} enviou uma mensagem sobre: ${lead.listingTitle}`,
          icon: '/favicon.ico'
        });
      }
    }
  }

  function handleDeleteLead(id){
    setLeads(leads.filter(lead => lead.id !== id));
  }

  function handleUpdateLead(updatedLead){
    setLeads(leads.map(lead => lead.id === updatedLead.id ? updatedLead : lead));
  }

  function handleCreateOwner(newOwner){
    setOwners([newOwner, ...owners]);
  }

  function handleUpdateOwner(updatedOwner){
    setOwners(owners.map(owner => owner.id === updatedOwner.id ? updatedOwner : owner));
  }

  function handleDeleteOwner(id){
    setOwners(owners.filter(owner => owner.id !== id));
  }

  function handleRoleChange(newRole){
    if (newRole === 'administrador' || newRole === 'dono') {
      setRole(newRole);
      setShowLogin(true);
    } else {
      setRole(newRole);
      setIsAuthenticated(false);
    }
  }

  function handleLogin(){
    setIsAuthenticated(true);
    setShowLogin(false);
  }

  function handleLogout(){
    setIsAuthenticated(false);
    setRole('cliente');
  }

  function handleUpdateContact(newContact){
    setContactInfo(newContact);
    alert('Informações de contato atualizadas com sucesso!');
  }

  function handleUpdateAccessCodes(newCodes){
    setAccessCodes(newCodes);
  }

  function handleImportData(importedData){
    if (importedData.events && Array.isArray(importedData.events)) {
      localStorage.setItem('calendarEvents', JSON.stringify(importedData.events));
    }

    if (importedData.notes && Array.isArray(importedData.notes)) {
      localStorage.setItem('adminNotes', JSON.stringify(importedData.notes));
    }

    if (importedData.listings && Array.isArray(importedData.listings)) {
      setListings(importedData.listings);
    }

    if (importedData.leads && Array.isArray(importedData.leads)) {
      setLeads(importedData.leads);
    }

    if (importedData.contactInfo) {
      setContactInfo(importedData.contactInfo);
    }

    if (importedData.accessCodes) {
      setAccessCodes(importedData.accessCodes);
    }

    if (importedData.owners && Array.isArray(importedData.owners)) {
      setOwners(importedData.owners);
    }

    // Force a page reload to refresh all data
    window.location.reload();
  }

  const visible = useMemo(() => {
    return listings.filter(l => {
      const matchesFilter = filter === 'todos' || l.type === filter;
      const matchesSearch = l.title.toLowerCase().includes(search.toLowerCase()) ||
                           l.description.toLowerCase().includes(search.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [listings, filter, search]);

  return (
    <div>
      <Navbar role={role} onChangeRole={handleRoleChange} onLogout={handleLogout} isAuthenticated={isAuthenticated} />

      {role === 'cliente' && !showPropertySearch && (
        <section
          className="hero-section"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1973&q=80')`
          }}
        >
          <div className="hero-content">
            <h1 className="text-4xl font-bold mb-4" style={{textShadow: '2px 2px 4px rgba(0,0,0,0.5)'}}>
              Encontre o Imóvel Perfeito
            </h1>
            <p className="text-2xl mb-8" style={{opacity: 0.9, textShadow: '1px 1px 2px rgba(0,0,0,0.5)'}}>
              Descubra as melhores opções de arrendamento e venda em Cabo Verde
            </p>
            <div className="flex flex-col justify-center" style={{gap: '1rem'}}>
              <button
                className="btn"
                style={{fontSize: '1.125rem', padding: '0.75rem 2rem', boxShadow: '0 4px 15px rgba(0,0,0,0.3)'}}
                onClick={() => setShowPropertySearch(true)}
              >
                Explorar Imóveis
              </button>
              <button
                className="btn"
                style={{fontSize: '1.125rem', padding: '0.75rem 2rem', background: 'white', color: '#8b5cf6', boxShadow: '0 4px 15px rgba(0,0,0,0.3)'}}
                onClick={() => setShowContact(true)}
              >
                Contactar-nos
              </button>
            </div>
          </div>
        </section>
      )}

      <main className="container" style={{padding: '2rem 1rem'}}>
        <div className="flex flex-col" style={{gap: '2rem'}}>
          {role === 'cliente' && showPropertySearch && (
            <section>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem'}}>
                <h2 className="text-2xl font-bold" style={{color: '#1f2937'}}>Encontre Seu Imóvel Ideal</h2>
                <button
                  onClick={() => setShowPropertySearch(false)}
                  style={{
                    padding: '0.5rem 1rem',
                    backgroundColor: '#f3f4f6',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.5rem',
                    color: '#6b7280',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                >
                  ← Voltar
                </button>
              </div>
              <div className="search-section">
                <div className="flex flex-col" style={{gap: '1.5rem'}}>
                  <div>
                    <label className="block font-semibold mb-3 flex items-center" style={{color: '#374151', fontSize: '0.875rem'}}>
                      <FaSearch className="mr-2" style={{color: '#8b5cf6'}} />
                      Buscar Imóveis
                    </label>
                    <div className="relative">
                      <FaSearch className="absolute" style={{left: '1rem', top: '1rem', color: '#9ca3af'}} />
                      <input
                        type="text"
                        placeholder="Digite título ou descrição..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="form-input"
                        style={{paddingLeft: '3rem', fontSize: '1.125rem'}}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block font-semibold mb-3 flex items-center" style={{color: '#374151', fontSize: '0.875rem'}}>
                      <FaMapMarkerAlt className="mr-2" style={{color: '#3b82f6'}} />
                      Tipo de Imóvel
                    </label>
                    <select
                      value={filter}
                      onChange={e=>setFilter(e.target.value)}
                      className="form-input"
                      style={{fontSize: '1.125rem'}}
                    >
                      <option value="todos">Todos os Tipos</option>
                      <option value="arrendar">Para Arrendar</option>
                      <option value="venda">Para Vender</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1" style={{gap: '1.5rem'}}>
                {visible.map(l => (
                  <ListingCard key={l.id} listing={l} onInterestSubmit={handleInterestSubmit} owners={owners} />
                ))}
              </div>
            </section>
          )}

          <aside className="space-y-6" style={{marginTop: '5rem'}}>
            {(role === 'administrador' || role === 'dono') && isAuthenticated ? (
              <Dashboard
                role={role}
                listings={listings}
                leads={leads}
                owners={owners}
                contactInfo={contactInfo}
                onUpdateContact={handleUpdateContact}
                accessCodes={accessCodes}
                onUpdateAccessCodes={handleUpdateAccessCodes}
                onCreate={handleCreate}
                onDelete={handleDelete}
                onDeleteLead={handleDeleteLead}
                onUpdateLead={handleUpdateLead}
                onCreateOwner={handleCreateOwner}
                onUpdateOwner={handleUpdateOwner}
                onDeleteOwner={handleDeleteOwner}
                onImportData={handleImportData}
              />
            ) : null}
          </aside>
        </div>
      </main>


      {showLogin && (
        <LoginModal
          role={role}
          accessCodes={accessCodes}
          onLogin={handleLogin}
          onClose={() => {
            setShowLogin(false);
            setRole('cliente');
          }}
        />
      )}

      {showContact && (
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
            maxWidth: '400px',
            width: '90%',
            textAlign: 'center'
          }}>
            <h3 style={{fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '1.5rem'}}>
              Contacte-nos
            </h3>
            <div style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
              <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', padding: '1rem', backgroundColor: '#f8fafc', borderRadius: '0.5rem'}}>
                <FaPhone style={{color: '#3b82f6', fontSize: '1.25rem'}} />
                <div>
                  <div style={{fontSize: '0.875rem', color: '#6b7280'}}>Telefone</div>
                  <div style={{fontWeight: '600', color: '#1f2937'}}>{contactInfo.phone}</div>
                </div>
              </div>
              <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', padding: '1rem', backgroundColor: '#f8fafc', borderRadius: '0.5rem'}}>
                <FaEnvelope style={{color: '#8b5cf6', fontSize: '1.25rem'}} />
                <div>
                  <div style={{fontSize: '0.875rem', color: '#6b7280'}}>Email</div>
                  <div style={{fontWeight: '600', color: '#1f2937'}}>{contactInfo.email}</div>
                </div>
              </div>
            </div>
            <button
              onClick={() => setShowContact(false)}
              style={{
                marginTop: '1.5rem',
                padding: '0.75rem 2rem',
                border: '2px solid #d1d5db',
                backgroundColor: 'white',
                color: '#6b7280',
                borderRadius: '0.5rem',
                fontWeight: '600',
                cursor: 'pointer',
                width: '100%'
              }}
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
