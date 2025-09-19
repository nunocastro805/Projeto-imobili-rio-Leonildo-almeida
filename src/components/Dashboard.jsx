import React, { useState, useEffect } from 'react';
import { FaTachometerAlt, FaTrash, FaInfoCircle, FaUser, FaPhone, FaEnvelope, FaCalendarAlt, FaCog, FaPlus, FaImage, FaVideo, FaTimes, FaChevronLeft, FaChevronRight, FaEdit, FaSave, FaStickyNote, FaFileAlt, FaHome, FaMapMarkerAlt } from 'react-icons/fa';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import AdminSettings from './AdminSettings';
import ListingForm from './ListingForm';

export default function Dashboard({ role, listings, leads, contactInfo, onUpdateContact, accessCodes, onUpdateAccessCodes, onCreate, onDelete, onDeleteLead }){
  const [activeTab, setActiveTab] = useState('dashboard');
  const [events, setEvents] = useState(() => {
    const savedEvents = localStorage.getItem('calendarEvents');
    return savedEvents ? JSON.parse(savedEvents) : [];
  });
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [newEvent, setNewEvent] = useState({
    name: '',
    number: '',
    title: '',
    description: ''
  });

  // Media viewer state
  const [showMediaViewer, setShowMediaViewer] = useState(false);
  const [currentMedia, setCurrentMedia] = useState([]);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [mediaType, setMediaType] = useState('image'); // 'image' or 'video'

  // Event editing state
  const [editingEventId, setEditingEventId] = useState(null);
  const [editEventData, setEditEventData] = useState({
    name: '',
    number: '',
    title: '',
    description: ''
  });

  // Notes state
  const [notes, setNotes] = useState(() => {
    const savedNotes = localStorage.getItem('adminNotes');
    return savedNotes ? JSON.parse(savedNotes) : [];
  });
  const [newNote, setNewNote] = useState('');
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [editNoteContent, setEditNoteContent] = useState('');

  // Save events to localStorage whenever events change
  useEffect(() => {
    localStorage.setItem('calendarEvents', JSON.stringify(events));
  }, [events]);

  // Save notes to localStorage whenever notes change
  useEffect(() => {
    localStorage.setItem('adminNotes', JSON.stringify(notes));
  }, [notes]);

  // Media viewer functions
  const openImageViewer = (images, startIndex = 0) => {
    setCurrentMedia(images);
    setCurrentMediaIndex(startIndex);
    setMediaType('image');
    setShowMediaViewer(true);
  };

  const openVideoViewer = (videos, startIndex = 0) => {
    setCurrentMedia(videos);
    setCurrentMediaIndex(startIndex);
    setMediaType('video');
    setShowMediaViewer(true);
  };

  const closeMediaViewer = () => {
    setShowMediaViewer(false);
    setCurrentMedia([]);
    setCurrentMediaIndex(0);
  };

  const nextMedia = () => {
    setCurrentMediaIndex((prev) => (prev + 1) % currentMedia.length);
  };

  const prevMedia = () => {
    setCurrentMediaIndex((prev) => (prev - 1 + currentMedia.length) % currentMedia.length);
  };

  // Event editing functions
  const startEditingEvent = (event) => {
    setEditingEventId(event.id);
    setEditEventData({
      name: event.name || '',
      number: event.number || '',
      title: event.title || '',
      description: event.description || ''
    });
  };

  const cancelEditingEvent = () => {
    setEditingEventId(null);
    setEditEventData({
      name: '',
      number: '',
      title: '',
      description: ''
    });
  };

  const saveEditedEvent = () => {
    if (!editEventData.title.trim()) return;

    const updatedEvents = events.map(event =>
      event.id === editingEventId
        ? {
            ...event,
            name: editEventData.name,
            number: editEventData.number,
            title: editEventData.title,
            description: editEventData.description
          }
        : event
    );
    setEvents(updatedEvents);
    localStorage.setItem('calendarEvents', JSON.stringify(updatedEvents));
    cancelEditingEvent();
  };

  const deleteEvent = (eventId) => {
    if (window.confirm('Tem certeza que deseja eliminar este evento?')) {
      const updatedEvents = events.filter(event => event.id !== eventId);
      setEvents(updatedEvents);
      localStorage.setItem('calendarEvents', JSON.stringify(updatedEvents));
    }
  };

  // Export/Import functions
  const exportData = () => {
    const data = {
      events: events,
      notes: notes,
      exportedAt: new Date().toISOString(),
      version: '1.0'
    };

    const dataStr = JSON.stringify(data, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);

    const exportFileDefaultName = `dashboard-data-${new Date().toISOString().split('T')[0]}.json`;

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const importData = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedData = JSON.parse(e.target.result);

          if (importedData.events && Array.isArray(importedData.events)) {
            setEvents(importedData.events);
            localStorage.setItem('calendarEvents', JSON.stringify(importedData.events));
          }

          if (importedData.notes && Array.isArray(importedData.notes)) {
            setNotes(importedData.notes);
            localStorage.setItem('adminNotes', JSON.stringify(importedData.notes));
          }

          alert('Dados importados com sucesso!');
        } catch (error) {
          alert('Erro ao importar dados. Verifique se o arquivo é válido.');
        }
      };
      reader.readAsText(file);
    }
  };

  // Notes functions
  const addNote = () => {
    if (newNote.trim()) {
      const note = {
        id: Date.now(),
        content: newNote.trim(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      setNotes([note, ...notes]);
      setNewNote('');
    }
  };

  const startEditingNote = (note) => {
    setEditingNoteId(note.id);
    setEditNoteContent(note.content);
  };

  const saveEditedNote = () => {
    if (editNoteContent.trim()) {
      const updatedNotes = notes.map(note =>
        note.id === editingNoteId
          ? {
              ...note,
              content: editNoteContent.trim(),
              updatedAt: new Date().toISOString()
            }
          : note
      );
      setNotes(updatedNotes);
      setEditingNoteId(null);
      setEditNoteContent('');
    }
  };

  const cancelEditingNote = () => {
    setEditingNoteId(null);
    setEditNoteContent('');
  };

  const deleteNote = (noteId) => {
    if (window.confirm('Tem certeza que deseja eliminar esta nota?')) {
      setNotes(notes.filter(note => note.id !== noteId));
    }
  };

  return (
    <div className="space-y-6">
      {/* Abas de navegação */}
      <div style={{backgroundColor: 'white', padding: '1rem', borderRadius: '0.5rem', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'}}>
        <div style={{display: 'flex', gap: '1rem', marginBottom: '1.5rem', borderBottom: '1px solid #e5e7eb'}}>
          <button
            onClick={() => setActiveTab('dashboard')}
            style={{
              padding: '0.5rem 1rem',
              border: 'none',
              backgroundColor: activeTab === 'dashboard' ? '#2563eb' : 'transparent',
              color: activeTab === 'dashboard' ? 'white' : '#6b7280',
              borderRadius: '0.375rem',
              fontWeight: '500',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <FaTachometerAlt />
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab('new-property')}
            style={{
              padding: '0.5rem 1rem',
              border: 'none',
              backgroundColor: activeTab === 'new-property' ? '#2563eb' : 'transparent',
              color: activeTab === 'new-property' ? 'white' : '#6b7280',
              borderRadius: '0.375rem',
              fontWeight: '500',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <FaPlus />
            Novo Imóvel
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            style={{
              padding: '0.5rem 1rem',
              border: 'none',
              backgroundColor: activeTab === 'settings' ? '#2563eb' : 'transparent',
              color: activeTab === 'settings' ? 'white' : '#6b7280',
              borderRadius: '0.375rem',
              fontWeight: '500',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <FaCog />
            Configurações
          </button>
          <button
            onClick={() => setActiveTab('calendar')}
            style={{
              padding: '0.5rem 1rem',
              border: 'none',
              backgroundColor: activeTab === 'calendar' ? '#2563eb' : 'transparent',
              color: activeTab === 'calendar' ? 'white' : '#6b7280',
              borderRadius: '0.375rem',
              fontWeight: '500',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <FaCalendarAlt />
            Calendário
          </button>
          <button
            onClick={() => setActiveTab('notes')}
            style={{
              padding: '0.5rem 1rem',
              border: 'none',
              backgroundColor: activeTab === 'notes' ? '#2563eb' : 'transparent',
              color: activeTab === 'notes' ? 'white' : '#6b7280',
              borderRadius: '0.375rem',
              fontWeight: '500',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <FaStickyNote />
            Notas
          </button>
        </div>

        {activeTab === 'dashboard' && (
          <>
            <h2 style={{fontSize: '1.25rem', fontWeight: '600', color: '#1f2937', marginBottom: '1rem', display: 'flex', alignItems: 'center'}}>
              <FaTachometerAlt style={{marginRight: '0.5rem', color: '#2563eb'}} />
              Painel - {role}
            </h2>

            {/* Data Management */}
            <div style={{marginBottom: '2rem', padding: '1rem', backgroundColor: '#f0f9ff', borderRadius: '0.5rem', border: '1px solid #0ea5e9'}}>
              <h4 style={{fontSize: '1rem', fontWeight: '500', color: '#0c4a6e', marginBottom: '0.75rem', display: 'flex', alignItems: 'center'}}>
                <FaFileAlt style={{marginRight: '0.5rem'}} />
                Gerenciamento de Dados
              </h4>
              <div style={{display: 'flex', gap: '1rem', flexWrap: 'wrap'}}>
                <button
                  onClick={exportData}
                  style={{
                    padding: '0.5rem 1rem',
                    backgroundColor: '#059669',
                    color: 'white',
                    border: 'none',
                    borderRadius: '0.375rem',
                    fontSize: '0.875rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                  title="Exportar todos os dados (eventos e notas)"
                >
                  <FaFileAlt />
                  Exportar Dados
                </button>
                <div>
                  <input
                    type="file"
                    accept=".json"
                    onChange={importData}
                    style={{display: 'none'}}
                    id="import-file"
                  />
                  <label
                    htmlFor="import-file"
                    style={{
                      padding: '0.5rem 1rem',
                      backgroundColor: '#7c3aed',
                      color: 'white',
                      border: 'none',
                      borderRadius: '0.375rem',
                      fontSize: '0.875rem',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}
                    title="Importar dados de um arquivo JSON"
                  >
                    <FaFileAlt />
                    Importar Dados
                  </label>
                </div>
              </div>
              <p style={{fontSize: '0.75rem', color: '#64748b', marginTop: '0.5rem'}}>
                Use exportar para fazer backup dos dados e importar para restaurar dados de outro ambiente.
              </p>
            </div>

            {(role === 'administrador' || role === 'dono') && (
              <div>
                <h4 style={{fontSize: '1.125rem', fontWeight: '500', color: '#374151', marginBottom: '0.75rem'}}>Gerir imóveis</h4>
                <div className="space-y-4">
                  {listings.map(l => (
                    <div key={l.id} style={{
                      backgroundColor: '#f9fafb',
                      borderRadius: '0.5rem',
                      border: '1px solid #e5e7eb',
                      padding: '1rem',
                      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
                    }}>
                      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.75rem'}}>
                        <div style={{flex: 1}}>
                          <h5 style={{fontSize: '1.125rem', fontWeight: '600', color: '#1f2937', marginBottom: '0.5rem'}}>
                            {l.title}
                          </h5>
                          <div style={{display: 'flex', flexWrap: 'wrap', gap: '1rem', fontSize: '0.875rem', color: '#6b7280'}}>
                            <span style={{
                              backgroundColor: l.type === 'arrendar' ? '#dbeafe' : '#fef3c7',
                              color: l.type === 'arrendar' ? '#1e40af' : '#92400e',
                              padding: '0.25rem 0.5rem',
                              borderRadius: '0.25rem',
                              fontWeight: '500'
                            }}>
                              {l.type === 'arrendar' ? 'Para Arrendar' : 'Para Vender'}
                            </span>
                            <span style={{fontWeight: '600', color: '#059669'}}>
                              {l.price}
                            </span>
                            {l.location && (
                              <span style={{display: 'flex', alignItems: 'center', color: '#ef4444'}}>
                                <FaMapMarkerAlt style={{marginRight: '0.25rem'}} />
                                {l.location}
                              </span>
                            )}
                          </div>
                        </div>
                        <button
                          onClick={()=>onDelete(l.id)}
                          style={{
                            color: '#dc2626',
                            fontSize: '1.25rem',
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            padding: '0.5rem',
                            borderRadius: '0.25rem',
                            transition: 'all 0.2s'
                          }}
                          onMouseOver={(e) => {
                            e.target.style.backgroundColor = '#fef2f2';
                            e.target.style.color = '#b91c1c';
                          }}
                          onMouseOut={(e) => {
                            e.target.style.backgroundColor = 'transparent';
                            e.target.style.color = '#dc2626';
                          }}
                          title="Eliminar imóvel"
                        >
                          <FaTrash />
                        </button>
                      </div>

                      {l.description && (
                        <div style={{marginBottom: '0.75rem'}}>
                          <p style={{fontSize: '0.875rem', color: '#4b5563', lineHeight: '1.4'}}>
                            {l.description}
                          </p>
                        </div>
                      )}

                      {l.images && l.images.length > 0 && (
                        <div style={{marginBottom: '0.75rem'}}>
                          <div style={{display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center'}}>
                            {l.images.slice(0, 3).map((image, index) => (
                              <img
                                key={index}
                                src={image}
                                alt={`Imagem ${index + 1}`}
                                style={{
                                  width: '60px',
                                  height: '60px',
                                  objectFit: 'cover',
                                  borderRadius: '0.25rem',
                                  border: '1px solid #e5e7eb',
                                  cursor: 'pointer',
                                  transition: 'transform 0.2s'
                                }}
                                onClick={() => openImageViewer(l.images, index)}
                                onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
                                onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
                                title="Clique para ver imagem ampliada"
                              />
                            ))}
                            {l.images.length > 3 && (
                              <div
                                style={{
                                  width: '60px',
                                  height: '60px',
                                  backgroundColor: '#e5e7eb',
                                  borderRadius: '0.25rem',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  fontSize: '0.75rem',
                                  color: '#6b7280',
                                  fontWeight: '500',
                                  cursor: 'pointer',
                                  transition: 'background-color 0.2s'
                                }}
                                onClick={() => openImageViewer(l.images, 3)}
                                onMouseOver={(e) => e.target.style.backgroundColor = '#d1d5db'}
                                onMouseOut={(e) => e.target.style.backgroundColor = '#e5e7eb'}
                                title="Clique para ver todas as imagens"
                              >
                                +{l.images.length - 3}
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {l.videos && l.videos.length > 0 && (
                        <div style={{fontSize: '0.75rem', color: '#6b7280'}}>
                          <span
                            style={{
                              cursor: 'pointer',
                              textDecoration: 'underline',
                              color: '#2563eb'
                            }}
                            onClick={() => openVideoViewer(l.videos, 0)}
                            onMouseOver={(e) => e.target.style.color = '#1d4ed8'}
                            onMouseOut={(e) => e.target.style.color = '#2563eb'}
                            title="Clique para ver vídeos"
                          >
                            <FaVideo style={{marginRight: '0.25rem'}} />
                            {l.videos.length} vídeo{l.videos.length > 1 ? 's' : ''} disponível{l.videos.length > 1 ? 'is' : ''}
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {(role === 'administrador' || role === 'dono') && leads && leads.length > 0 && (
              <div style={{marginTop: '2rem'}}>
                <h4 style={{fontSize: '1.125rem', fontWeight: '500', color: '#374151', marginBottom: '0.75rem', display: 'flex', alignItems: 'center'}}>
                  <FaUser style={{marginRight: '0.5rem', color: '#8b5cf6'}} />
                  Leads de Clientes ({leads.length})
                </h4>
                <div className="space-y-2">
                  {leads.map(lead => (
                    <div key={lead.id} style={{
                      backgroundColor: lead.status === 'novo' ? '#fef3c7' : '#f0fdf4',
                      padding: '1rem',
                      borderRadius: '0.5rem',
                      border: '1px solid #e5e7eb'
                    }}>
                      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.5rem'}}>
                        <div>
                          <h5 style={{fontWeight: '600', color: '#1f2937'}}>{lead.name}</h5>
                          <p style={{fontSize: '0.875rem', color: '#6b7280', marginTop: '0.25rem'}}>
                            Interesse em: <strong>{lead.listingTitle}</strong>
                          </p>
                        </div>
                        <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                          <span style={{
                            backgroundColor: lead.status === 'novo' ? '#f59e0b' : '#10b981',
                            color: 'white',
                            padding: '0.25rem 0.5rem',
                            borderRadius: '9999px',
                            fontSize: '0.75rem',
                            fontWeight: '600'
                          }}>
                            {lead.status}
                          </span>
                          <button
                            onClick={() => onDeleteLead(lead.id)}
                            style={{
                              color: '#dc2626',
                              fontSize: '1rem',
                              background: 'none',
                              border: 'none',
                              cursor: 'pointer',
                              padding: '0.25rem',
                              borderRadius: '0.25rem'
                            }}
                            onMouseOver={(e) => e.target.style.backgroundColor = '#fef2f2'}
                            onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
                            title="Eliminar pedido"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </div>

                      <div style={{display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.875rem'}}>
                        <div style={{display: 'flex', alignItems: 'center', color: '#4b5563'}}>
                          <FaPhone style={{marginRight: '0.5rem', color: '#6b7280'}} />
                          {lead.phone}
                        </div>
                        <div style={{display: 'flex', alignItems: 'center', color: '#4b5563'}}>
                          <FaEnvelope style={{marginRight: '0.5rem', color: '#6b7280'}} />
                          {lead.email}
                        </div>
                        <div style={{display: 'flex', alignItems: 'center', color: '#4b5563'}}>
                          <FaCalendarAlt style={{marginRight: '0.5rem', color: '#6b7280'}} />
                          {new Date(lead.date).toLocaleDateString('pt-PT')}
                        </div>
                      </div>

                      {lead.message && (
                        <div style={{marginTop: '0.75rem', padding: '0.5rem', backgroundColor: 'white', borderRadius: '0.25rem'}}>
                          <p style={{fontSize: '0.875rem', color: '#4b5563', margin: 0}}>
                            <strong>Mensagem:</strong> {lead.message}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {activeTab === 'new-property' && (
          <>
            <h2 style={{fontSize: '1.25rem', fontWeight: '600', color: '#1f2937', marginBottom: '1rem', display: 'flex', alignItems: 'center'}}>
              <FaHome style={{marginRight: '0.5rem', color: '#2563eb'}} />
              Adicionar Novo Imóvel
            </h2>
            <div style={{maxWidth: '800px'}}>
              <ListingForm onCreate={onCreate} />
            </div>
          </>
        )}

        {activeTab === 'settings' && (
          <AdminSettings
            contactInfo={contactInfo}
            onUpdateContact={onUpdateContact}
            accessCodes={accessCodes}
            onUpdateAccessCodes={onUpdateAccessCodes}
          />
        )}

        {activeTab === 'calendar' && (
          <>
            <h2 style={{fontSize: '1.25rem', fontWeight: '600', color: '#1f2937', marginBottom: '1rem', display: 'flex', alignItems: 'center'}}>
              <FaCalendarAlt style={{marginRight: '0.5rem', color: '#2563eb'}} />
              Calendário de Agendamentos
            </h2>

            <div style={{display: 'flex', gap: '2rem'}}>
              <div style={{flex: 1}}>
                <Calendar
                  onChange={setSelectedDate}
                  value={selectedDate}
                  tileContent={({ date, view }) => {
                    const dayEvents = events.filter(event =>
                      new Date(event.date).toDateString() === date.toDateString()
                    );
                    return dayEvents.length > 0 ? (
                      <div style={{fontSize: '0.75rem', color: '#2563eb', marginTop: '0.25rem'}}>
                        {dayEvents.length} evento{dayEvents.length > 1 ? 's' : ''}
                      </div>
                    ) : null;
                  }}
                />
              </div>

              <div style={{flex: 1}}>
                <h3 style={{fontSize: '1.125rem', fontWeight: '500', color: '#374151', marginBottom: '1rem'}}>
                  Eventos em {selectedDate.toLocaleDateString('pt-PT')}
                </h3>
                <div className="space-y-2">
                  {events.filter(event =>
                    new Date(event.date).toDateString() === selectedDate.toDateString()
                  ).map(event => (
                    <div key={event.id} style={{
                      backgroundColor: '#f9fafb',
                      padding: '0.75rem',
                      borderRadius: '0.375rem',
                      border: '1px solid #e5e7eb'
                    }}>
                      {editingEventId === event.id ? (
                        // Edit mode
                        <div style={{display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>
                          <input
                            type="text"
                            placeholder="Nome"
                            value={editEventData.name}
                            onChange={(e) => setEditEventData({...editEventData, name: e.target.value})}
                            style={{
                              width: '100%',
                              padding: '0.5rem',
                              border: '1px solid #d1d5db',
                              borderRadius: '0.375rem',
                              fontSize: '0.875rem'
                            }}
                          />
                          <input
                            type="text"
                            placeholder="Número"
                            value={editEventData.number}
                            onChange={(e) => setEditEventData({...editEventData, number: e.target.value})}
                            style={{
                              width: '100%',
                              padding: '0.5rem',
                              border: '1px solid #d1d5db',
                              borderRadius: '0.375rem',
                              fontSize: '0.875rem'
                            }}
                          />
                          <input
                            type="text"
                            placeholder="Título do evento"
                            value={editEventData.title}
                            onChange={(e) => setEditEventData({...editEventData, title: e.target.value})}
                            style={{
                              width: '100%',
                              padding: '0.5rem',
                              border: '1px solid #d1d5db',
                              borderRadius: '0.375rem',
                              fontSize: '0.875rem',
                              fontWeight: '600'
                            }}
                          />
                          <textarea
                            placeholder="Descrição"
                            value={editEventData.description}
                            onChange={(e) => setEditEventData({...editEventData, description: e.target.value})}
                            rows="2"
                            style={{
                              width: '100%',
                              padding: '0.5rem',
                              border: '1px solid #d1d5db',
                              borderRadius: '0.375rem',
                              fontSize: '0.875rem',
                              resize: 'vertical'
                            }}
                          />
                          <div style={{display: 'flex', gap: '0.5rem', justifyContent: 'flex-end'}}>
                            <button
                              onClick={saveEditedEvent}
                              style={{
                                padding: '0.25rem 0.75rem',
                                backgroundColor: '#10b981',
                                color: 'white',
                                border: 'none',
                                borderRadius: '0.25rem',
                                fontSize: '0.75rem',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.25rem'
                              }}
                            >
                              <FaSave />
                              Salvar
                            </button>
                            <button
                              onClick={cancelEditingEvent}
                              style={{
                                padding: '0.25rem 0.75rem',
                                backgroundColor: '#6b7280',
                                color: 'white',
                                border: 'none',
                                borderRadius: '0.25rem',
                                fontSize: '0.75rem',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.25rem'
                              }}
                            >
                              <FaTimes />
                              Cancelar
                            </button>
                          </div>
                        </div>
                      ) : (
                        // View mode
                        <div>
                          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem'}}>
                            <div style={{fontWeight: '600', color: '#1f2937'}}>{event.title}</div>
                            <div style={{display: 'flex', gap: '0.25rem'}}>
                              <button
                                onClick={() => startEditingEvent(event)}
                                style={{
                                  color: '#2563eb',
                                  fontSize: '0.875rem',
                                  background: 'none',
                                  border: 'none',
                                  cursor: 'pointer',
                                  padding: '0.25rem',
                                  borderRadius: '0.25rem'
                                }}
                                onMouseOver={(e) => e.target.style.backgroundColor = '#eff6ff'}
                                onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
                                title="Editar evento"
                              >
                                <FaEdit />
                              </button>
                              <button
                                onClick={() => deleteEvent(event.id)}
                                style={{
                                  color: '#dc2626',
                                  fontSize: '0.875rem',
                                  background: 'none',
                                  border: 'none',
                                  cursor: 'pointer',
                                  padding: '0.25rem',
                                  borderRadius: '0.25rem'
                                }}
                                onMouseOver={(e) => e.target.style.backgroundColor = '#fef2f2'}
                                onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
                                title="Eliminar evento"
                              >
                                <FaTrash />
                              </button>
                            </div>
                          </div>
                          {event.name && <div style={{fontSize: '0.875rem', color: '#4b5563', marginTop: '0.25rem'}}><strong>Nome:</strong> {event.name}</div>}
                          {event.number && <div style={{fontSize: '0.875rem', color: '#4b5563'}}><strong>Número:</strong> {event.number}</div>}
                          {event.description && <div style={{fontSize: '0.875rem', color: '#6b7280', marginTop: '0.25rem'}}>{event.description}</div>}
                        </div>
                      )}
                    </div>
                  ))}
                  {events.filter(event =>
                    new Date(event.date).toDateString() === selectedDate.toDateString()
                  ).length === 0 && (
                    <p style={{color: '#6b7280'}}>Nenhum evento agendado para este dia.</p>
                  )}
                </div>

                <div style={{marginTop: '2rem'}}>
                  <h4 style={{fontSize: '1rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem'}}>
                    Adicionar Evento
                  </h4>
                  <div style={{display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>
                    <input
                      type="text"
                      placeholder="Nome"
                      value={newEvent.name}
                      onChange={(e) => setNewEvent({...newEvent, name: e.target.value})}
                      style={{
                        width: '100%',
                        padding: '0.5rem',
                        border: '1px solid #d1d5db',
                        borderRadius: '0.375rem'
                      }}
                    />
                    <input
                      type="text"
                      placeholder="Número"
                      value={newEvent.number}
                      onChange={(e) => setNewEvent({...newEvent, number: e.target.value})}
                      style={{
                        width: '100%',
                        padding: '0.5rem',
                        border: '1px solid #d1d5db',
                        borderRadius: '0.375rem'
                      }}
                    />
                    <input
                      type="text"
                      placeholder="Título do evento"
                      value={newEvent.title}
                      onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                      style={{
                        width: '100%',
                        padding: '0.5rem',
                        border: '1px solid #d1d5db',
                        borderRadius: '0.375rem'
                      }}
                    />
                    <textarea
                      placeholder="Descrição"
                      value={newEvent.description}
                      onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
                      rows="3"
                      style={{
                        width: '100%',
                        padding: '0.5rem',
                        border: '1px solid #d1d5db',
                        borderRadius: '0.375rem',
                        resize: 'vertical'
                      }}
                    />
                  </div>
                  <button
                    onClick={() => {
                      if (newEvent.title.trim()) {
                        const updatedEvents = [...events, {
                          id: Date.now(),
                          name: newEvent.name,
                          number: newEvent.number,
                          title: newEvent.title,
                          description: newEvent.description,
                          date: selectedDate.toISOString()
                        }];
                        setEvents(updatedEvents);
                        localStorage.setItem('calendarEvents', JSON.stringify(updatedEvents));
                        setNewEvent({
                          name: '',
                          number: '',
                          title: '',
                          description: ''
                        });
                      }
                    }}
                    className="btn"
                    style={{fontSize: '0.875rem', padding: '0.5rem 1rem', marginTop: '0.5rem'}}
                  >
                    <FaPlus style={{marginRight: '0.5rem'}} />
                    Adicionar
                  </button>
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === 'notes' && (
          <>
            <h2 style={{fontSize: '1.25rem', fontWeight: '600', color: '#1f2937', marginBottom: '1rem', display: 'flex', alignItems: 'center'}}>
              <FaStickyNote style={{marginRight: '0.5rem', color: '#2563eb'}} />
              Notas do Administrador
            </h2>

            {/* Add new note */}
            <div style={{marginBottom: '2rem', padding: '1rem', backgroundColor: '#f9fafb', borderRadius: '0.5rem', border: '1px solid #e5e7eb'}}>
              <h4 style={{fontSize: '1rem', fontWeight: '500', color: '#374151', marginBottom: '0.75rem'}}>
                Adicionar Nova Nota
              </h4>
              <div style={{display: 'flex', gap: '0.5rem'}}>
                <textarea
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Digite sua nota aqui..."
                  rows="3"
                  style={{
                    flex: 1,
                    padding: '0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.375rem',
                    fontSize: '0.875rem',
                    resize: 'vertical'
                  }}
                />
                <button
                  onClick={addNote}
                  disabled={!newNote.trim()}
                  style={{
                    padding: '0.75rem 1rem',
                    backgroundColor: newNote.trim() ? '#10b981' : '#d1d5db',
                    color: 'white',
                    border: 'none',
                    borderRadius: '0.375rem',
                    cursor: newNote.trim() ? 'pointer' : 'not-allowed',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                >
                  <FaPlus />
                  Adicionar
                </button>
              </div>
            </div>

            {/* Notes list */}
            <div>
              <h4 style={{fontSize: '1.125rem', fontWeight: '500', color: '#374151', marginBottom: '0.75rem', display: 'flex', alignItems: 'center'}}>
                <FaFileAlt style={{marginRight: '0.5rem', color: '#8b5cf6'}} />
                Suas Notas ({notes.length})
              </h4>

              {notes.length === 0 ? (
                <div style={{textAlign: 'center', padding: '2rem', color: '#6b7280'}}>
                  <FaStickyNote style={{fontSize: '3rem', marginBottom: '1rem', opacity: 0.5}} />
                  <p>Nenhuma nota ainda. Adicione sua primeira nota acima!</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {notes.map(note => (
                    <div key={note.id} style={{
                      backgroundColor: '#f9fafb',
                      borderRadius: '0.5rem',
                      border: '1px solid #e5e7eb',
                      padding: '1rem'
                    }}>
                      {editingNoteId === note.id ? (
                        // Edit mode
                        <div>
                          <textarea
                            value={editNoteContent}
                            onChange={(e) => setEditNoteContent(e.target.value)}
                            rows="4"
                            style={{
                              width: '100%',
                              padding: '0.75rem',
                              border: '1px solid #d1d5db',
                              borderRadius: '0.375rem',
                              fontSize: '0.875rem',
                              marginBottom: '0.75rem',
                              resize: 'vertical'
                            }}
                          />
                          <div style={{display: 'flex', gap: '0.5rem', justifyContent: 'flex-end'}}>
                            <button
                              onClick={saveEditedNote}
                              style={{
                                padding: '0.25rem 0.75rem',
                                backgroundColor: '#10b981',
                                color: 'white',
                                border: 'none',
                                borderRadius: '0.25rem',
                                fontSize: '0.75rem',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.25rem'
                              }}
                            >
                              <FaSave />
                              Salvar
                            </button>
                            <button
                              onClick={cancelEditingNote}
                              style={{
                                padding: '0.25rem 0.75rem',
                                backgroundColor: '#6b7280',
                                color: 'white',
                                border: 'none',
                                borderRadius: '0.25rem',
                                fontSize: '0.75rem',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.25rem'
                              }}
                            >
                              <FaTimes />
                              Cancelar
                            </button>
                          </div>
                        </div>
                      ) : (
                        // View mode
                        <div>
                          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem'}}>
                            <div style={{flex: 1, marginRight: '1rem'}}>
                              <p style={{fontSize: '0.875rem', color: '#4b5563', lineHeight: '1.5', whiteSpace: 'pre-wrap'}}>
                                {note.content}
                              </p>
                            </div>
                            <div style={{display: 'flex', gap: '0.25rem'}}>
                              <button
                                onClick={() => startEditingNote(note)}
                                style={{
                                  color: '#2563eb',
                                  fontSize: '0.875rem',
                                  background: 'none',
                                  border: 'none',
                                  cursor: 'pointer',
                                  padding: '0.25rem',
                                  borderRadius: '0.25rem'
                                }}
                                onMouseOver={(e) => e.target.style.backgroundColor = '#eff6ff'}
                                onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
                                title="Editar nota"
                              >
                                <FaEdit />
                              </button>
                              <button
                                onClick={() => deleteNote(note.id)}
                                style={{
                                  color: '#dc2626',
                                  fontSize: '0.875rem',
                                  background: 'none',
                                  border: 'none',
                                  cursor: 'pointer',
                                  padding: '0.25rem',
                                  borderRadius: '0.25rem'
                                }}
                                onMouseOver={(e) => e.target.style.backgroundColor = '#fef2f2'}
                                onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
                                title="Eliminar nota"
                              >
                                <FaTrash />
                              </button>
                            </div>
                          </div>
                          <div style={{fontSize: '0.75rem', color: '#6b7280'}}>
                            Criado em: {new Date(note.createdAt).toLocaleDateString('pt-PT')}
                            {note.updatedAt !== note.createdAt && (
                              <span style={{marginLeft: '1rem'}}>
                                Atualizado em: {new Date(note.updatedAt).toLocaleDateString('pt-PT')}
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Media Viewer Modal */}
      {showMediaViewer && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.9)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '2rem'
        }}>
          <div style={{
            position: 'relative',
            maxWidth: '90vw',
            maxHeight: '90vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {/* Close button */}
            <button
              onClick={closeMediaViewer}
              style={{
                position: 'absolute',
                top: '-40px',
                right: '0',
                color: 'white',
                fontSize: '2rem',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                zIndex: 1001
              }}
              title="Fechar"
            >
              <FaTimes />
            </button>

            {/* Navigation buttons */}
            {currentMedia.length > 1 && (
              <>
                <button
                  onClick={prevMedia}
                  style={{
                    position: 'absolute',
                    left: '-60px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'white',
                    fontSize: '2rem',
                    background: 'rgba(0, 0, 0, 0.5)',
                    border: 'none',
                    borderRadius: '50%',
                    width: '50px',
                    height: '50px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1001
                  }}
                  title="Anterior"
                >
                  <FaChevronLeft />
                </button>
                <button
                  onClick={nextMedia}
                  style={{
                    position: 'absolute',
                    right: '-60px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'white',
                    fontSize: '2rem',
                    background: 'rgba(0, 0, 0, 0.5)',
                    border: 'none',
                    borderRadius: '50%',
                    width: '50px',
                    height: '50px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1001
                  }}
                  title="Próximo"
                >
                  <FaChevronRight />
                </button>
              </>
            )}

            {/* Media display */}
            {mediaType === 'image' ? (
              <img
                src={currentMedia[currentMediaIndex]}
                alt={`Imagem ${currentMediaIndex + 1}`}
                style={{
                  maxWidth: '100%',
                  maxHeight: '100%',
                  objectFit: 'contain',
                  borderRadius: '0.5rem'
                }}
              />
            ) : (
              <video
                src={currentMedia[currentMediaIndex]}
                controls
                style={{
                  maxWidth: '100%',
                  maxHeight: '100%',
                  borderRadius: '0.5rem'
                }}
                autoPlay
              />
            )}

            {/* Media counter */}
            {currentMedia.length > 1 && (
              <div style={{
                position: 'absolute',
                bottom: '-40px',
                left: '50%',
                transform: 'translateX(-50%)',
                color: 'white',
                fontSize: '0.875rem',
                background: 'rgba(0, 0, 0, 0.7)',
                padding: '0.5rem 1rem',
                borderRadius: '1rem'
              }}>
                {currentMediaIndex + 1} de {currentMedia.length}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
