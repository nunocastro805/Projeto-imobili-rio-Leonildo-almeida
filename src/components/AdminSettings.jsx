import React, { useState } from 'react';
import { FaPhone, FaEnvelope, FaKey, FaSave, FaEdit, FaUser, FaCalendarAlt, FaBell } from 'react-icons/fa';

export default function AdminSettings({ contactInfo, onUpdateContact, accessCodes, onUpdateAccessCodes }){
   const [editingContact, setEditingContact] = useState(false);
   const [editingCodes, setEditingCodes] = useState(false);
   const [editingLeads, setEditingLeads] = useState(false);

   // Estados para edição de contato
   const [tempContact, setTempContact] = useState(contactInfo);

   // Estados para edição de códigos
   const [tempCodes, setTempCodes] = useState(accessCodes);
   const [currentPassword, setCurrentPassword] = useState('');
   const [codeError, setCodeError] = useState('');

   // Estados para configurações de leads
   const [leadsSettings, setLeadsSettings] = useState(() => {
     const savedSettings = localStorage.getItem('leadsSettings');
     return savedSettings ? JSON.parse(savedSettings) : {
       defaultFollowUpDays: 7,
       autoReminders: true,
       reminderFrequency: 3,
       leadStatuses: ['novo', 'contatado', 'fechado'],
       emailNotifications: true
     };
   });
   const [tempLeadsSettings, setTempLeadsSettings] = useState(leadsSettings);

  function handleSaveContact(){
    onUpdateContact(tempContact);
    setEditingContact(false);
  }

  function handleSaveCodes(){
    // Verificar se a senha atual está correta (simulação)
    if (currentPassword !== 'MASTER2024') {
      setCodeError('Senha mestra incorreta');
      return;
    }

    onUpdateAccessCodes(tempCodes);
    setEditingCodes(false);
    setCurrentPassword('');
    setCodeError('');
    alert('Códigos de acesso atualizados com sucesso!');
  }

  function handleSaveLeadsSettings(){
    setLeadsSettings(tempLeadsSettings);
    localStorage.setItem('leadsSettings', JSON.stringify(tempLeadsSettings));
    setEditingLeads(false);
    alert('Configurações de leads atualizadas com sucesso!');
  }

  return (
    <div className="space-y-6">
      {/* Seção de Informações de Contato */}
      <div style={{backgroundColor: 'white', padding: '1.5rem', borderRadius: '0.5rem', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'}}>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem'}}>
          <h3 style={{fontSize: '1.25rem', fontWeight: '600', color: '#1f2937', display: 'flex', alignItems: 'center'}}>
            <FaPhone style={{marginRight: '0.5rem', color: '#2563eb'}} />
            Informações de Contato da Empresa
          </h3>
          {!editingContact && (
            <button
              onClick={() => setEditingContact(true)}
              className="btn"
              style={{fontSize: '0.875rem', padding: '0.5rem 1rem'}}
            >
              <FaEdit style={{marginRight: '0.5rem'}} />
              Editar
            </button>
          )}
        </div>

        {editingContact ? (
          <div style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
            <div>
              <label style={{display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem'}}>
                Telefone
              </label>
              <input
                type="tel"
                value={tempContact.phone}
                onChange={(e) => setTempContact({...tempContact, phone: e.target.value})}
                className="form-input"
                placeholder="+238 XXX XXX XXX"
              />
            </div>

            <div>
              <label style={{display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem'}}>
                Email
              </label>
              <input
                type="email"
                value={tempContact.email}
                onChange={(e) => setTempContact({...tempContact, email: e.target.value})}
                className="form-input"
                placeholder="empresa@email.com"
              />
            </div>

            <div style={{display: 'flex', gap: '1rem', marginTop: '1rem'}}>
              <button onClick={handleSaveContact} className="btn">
                <FaSave style={{marginRight: '0.5rem'}} />
                Salvar
              </button>
              <button
                onClick={() => {
                  setTempContact(contactInfo);
                  setEditingContact(false);
                }}
                style={{
                  padding: '0.75rem 1.5rem',
                  border: '2px solid #d1d5db',
                  backgroundColor: 'white',
                  color: '#6b7280',
                  borderRadius: '0.5rem',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Cancelar
              </button>
            </div>
          </div>
        ) : (
          <div style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
            <div style={{display: 'flex', alignItems: 'center', padding: '1rem', backgroundColor: '#f8fafc', borderRadius: '0.5rem'}}>
              <FaPhone style={{marginRight: '1rem', color: '#3b82f6'}} />
              <div>
                <div style={{fontSize: '0.875rem', color: '#6b7280'}}>Telefone</div>
                <div style={{fontWeight: '600', color: '#1f2937'}}>{contactInfo.phone}</div>
              </div>
            </div>

            <div style={{display: 'flex', alignItems: 'center', padding: '1rem', backgroundColor: '#f8fafc', borderRadius: '0.5rem'}}>
              <FaEnvelope style={{marginRight: '1rem', color: '#8b5cf6'}} />
              <div>
                <div style={{fontSize: '0.875rem', color: '#6b7280'}}>Email</div>
                <div style={{fontWeight: '600', color: '#1f2937'}}>{contactInfo.email}</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Seção de Códigos de Acesso */}
      <div style={{backgroundColor: 'white', padding: '1.5rem', borderRadius: '0.5rem', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'}}>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem'}}>
          <h3 style={{fontSize: '1.25rem', fontWeight: '600', color: '#1f2937', display: 'flex', alignItems: 'center'}}>
            <FaKey style={{marginRight: '0.5rem', color: '#dc2626'}} />
            Códigos de Acesso
          </h3>
          {!editingCodes && (
            <button
              onClick={() => setEditingCodes(true)}
              className="btn"
              style={{fontSize: '0.875rem', padding: '0.5rem 1rem', background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)'}}
            >
              <FaEdit style={{marginRight: '0.5rem'}} />
              Alterar Códigos
            </button>
          )}
        </div>

        {editingCodes ? (
          <div style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
            <div style={{padding: '1rem', backgroundColor: '#fef3c7', borderRadius: '0.5rem', border: '1px solid #f59e0b'}}>
              <p style={{fontSize: '0.875rem', color: '#92400e', margin: 0}}>
                <strong>Atenção:</strong> Digite a senha mestra para confirmar a alteração dos códigos de acesso.
              </p>
            </div>

            <div>
              <label style={{display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem'}}>
                Senha Mestra
              </label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="form-input"
                placeholder="Digite a senha mestra"
              />
            </div>

            <div>
              <label style={{display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem'}}>
                Novo Código - Administrador
              </label>
              <input
                type="text"
                value={tempCodes.admin}
                onChange={(e) => setTempCodes({...tempCodes, admin: e.target.value})}
                className="form-input"
                placeholder="Novo código para administrador"
              />
            </div>

            <div>
              <label style={{display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem'}}>
                Novo Código - Dono da Empresa
              </label>
              <input
                type="text"
                value={tempCodes.owner}
                onChange={(e) => setTempCodes({...tempCodes, owner: e.target.value})}
                className="form-input"
                placeholder="Novo código para dono"
              />
            </div>

            {codeError && (
              <div style={{
                backgroundColor: '#fef2f2',
                color: '#dc2626',
                padding: '0.75rem',
                borderRadius: '0.5rem',
                fontSize: '0.875rem'
              }}>
                {codeError}
              </div>
            )}

            <div style={{display: 'flex', gap: '1rem', marginTop: '1rem'}}>
              <button onClick={handleSaveCodes} className="btn">
                <FaSave style={{marginRight: '0.5rem'}} />
                Salvar Códigos
              </button>
              <button
                onClick={() => {
                  setTempCodes(accessCodes);
                  setEditingCodes(false);
                  setCurrentPassword('');
                  setCodeError('');
                }}
                style={{
                  padding: '0.75rem 1.5rem',
                  border: '2px solid #d1d5db',
                  backgroundColor: 'white',
                  color: '#6b7280',
                  borderRadius: '0.5rem',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Cancelar
              </button>
            </div>
          </div>
        ) : (
          <div style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
            <div style={{padding: '1rem', backgroundColor: '#f8fafc', borderRadius: '0.5rem'}}>
              <div style={{fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem'}}>Código Administrador</div>
              <div style={{fontWeight: '600', color: '#1f2937', fontFamily: 'monospace'}}>●●●●●●●●</div>
            </div>

            <div style={{padding: '1rem', backgroundColor: '#f8fafc', borderRadius: '0.5rem'}}>
              <div style={{fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem'}}>Código Dono da Empresa</div>
              <div style={{fontWeight: '600', color: '#1f2937', fontFamily: 'monospace'}}>●●●●●●●●</div>
            </div>

            <div style={{padding: '1rem', backgroundColor: '#fef3c7', borderRadius: '0.5rem', border: '1px solid #f59e0b'}}>
              <p style={{fontSize: '0.875rem', color: '#92400e', margin: 0}}>
                <strong>Nota de Segurança:</strong> Os códigos são mascarados por segurança.
                Use a senha mestra para alterar os códigos de acesso.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Seção de Configurações de Leads */}
      <div style={{backgroundColor: 'white', padding: '1.5rem', borderRadius: '0.5rem', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'}}>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem'}}>
          <h3 style={{fontSize: '1.25rem', fontWeight: '600', color: '#1f2937', display: 'flex', alignItems: 'center'}}>
            <FaUser style={{marginRight: '0.5rem', color: '#8b5cf6'}} />
            Configurações de Leads
          </h3>
          {!editingLeads && (
            <button
              onClick={() => setEditingLeads(true)}
              className="btn"
              style={{fontSize: '0.875rem', padding: '0.5rem 1rem'}}
            >
              <FaEdit style={{marginRight: '0.5rem'}} />
              Configurar
            </button>
          )}
        </div>

        {editingLeads ? (
          <div style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
            <div>
              <label style={{display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem'}}>
                Dias padrão para follow-up
              </label>
              <input
                type="number"
                min="1"
                max="30"
                value={tempLeadsSettings.defaultFollowUpDays}
                onChange={(e) => setTempLeadsSettings({...tempLeadsSettings, defaultFollowUpDays: parseInt(e.target.value)})}
                className="form-input"
              />
            </div>

            <div>
              <label style={{display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem'}}>
                <input
                  type="checkbox"
                  checked={tempLeadsSettings.autoReminders}
                  onChange={(e) => setTempLeadsSettings({...tempLeadsSettings, autoReminders: e.target.checked})}
                  style={{marginRight: '0.5rem'}}
                />
                Lembretes automáticos
              </label>
            </div>

            {tempLeadsSettings.autoReminders && (
              <div>
                <label style={{display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem'}}>
                  Frequência de lembretes (dias)
                </label>
                <input
                  type="number"
                  min="1"
                  max="30"
                  value={tempLeadsSettings.reminderFrequency}
                  onChange={(e) => setTempLeadsSettings({...tempLeadsSettings, reminderFrequency: parseInt(e.target.value)})}
                  className="form-input"
                />
              </div>
            )}

            <div>
              <label style={{display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem'}}>
                <input
                  type="checkbox"
                  checked={tempLeadsSettings.emailNotifications}
                  onChange={(e) => setTempLeadsSettings({...tempLeadsSettings, emailNotifications: e.target.checked})}
                  style={{marginRight: '0.5rem'}}
                />
                Notificações por email
              </label>
            </div>

            <div style={{display: 'flex', gap: '1rem', marginTop: '1rem'}}>
              <button onClick={handleSaveLeadsSettings} className="btn">
                <FaSave style={{marginRight: '0.5rem'}} />
                Salvar Configurações
              </button>
              <button
                onClick={() => {
                  setTempLeadsSettings(leadsSettings);
                  setEditingLeads(false);
                }}
                style={{
                  padding: '0.75rem 1.5rem',
                  border: '2px solid #d1d5db',
                  backgroundColor: 'white',
                  color: '#6b7280',
                  borderRadius: '0.5rem',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Cancelar
              </button>
            </div>
          </div>
        ) : (
          <div style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
            <div style={{display: 'flex', alignItems: 'center', padding: '1rem', backgroundColor: '#f8fafc', borderRadius: '0.5rem'}}>
              <FaCalendarAlt style={{marginRight: '1rem', color: '#8b5cf6'}} />
              <div>
                <div style={{fontSize: '0.875rem', color: '#6b7280'}}>Follow-up padrão</div>
                <div style={{fontWeight: '600', color: '#1f2937'}}>{leadsSettings.defaultFollowUpDays} dias</div>
              </div>
            </div>

            <div style={{display: 'flex', alignItems: 'center', padding: '1rem', backgroundColor: '#f8fafc', borderRadius: '0.5rem'}}>
              <FaBell style={{marginRight: '1rem', color: '#f59e0b'}} />
              <div>
                <div style={{fontSize: '0.875rem', color: '#6b7280'}}>Lembretes automáticos</div>
                <div style={{fontWeight: '600', color: '#1f2937'}}>
                  {leadsSettings.autoReminders ? `Ativado (${leadsSettings.reminderFrequency} dias)` : 'Desativado'}
                </div>
              </div>
            </div>

            <div style={{display: 'flex', alignItems: 'center', padding: '1rem', backgroundColor: '#f8fafc', borderRadius: '0.5rem'}}>
              <FaEnvelope style={{marginRight: '1rem', color: '#10b981'}} />
              <div>
                <div style={{fontSize: '0.875rem', color: '#6b7280'}}>Notificações por email</div>
                <div style={{fontWeight: '600', color: '#1f2937'}}>
                  {leadsSettings.emailNotifications ? 'Ativado' : 'Desativado'}
                </div>
              </div>
            </div>

            <div style={{padding: '1rem', backgroundColor: '#f0f9ff', borderRadius: '0.5rem', border: '1px solid #0ea5e9'}}>
              <p style={{fontSize: '0.875rem', color: '#0c4a6e', margin: 0}}>
                <strong>Dica:</strong> Configure os lembretes automáticos para nunca perder um lead importante.
                Os follow-ups serão agendados automaticamente no calendário.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}