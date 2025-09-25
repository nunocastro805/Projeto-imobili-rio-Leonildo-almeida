import React, { useState, useEffect } from 'react';
import { FaMoneyBillWave, FaPlus, FaEdit, FaTrash, FaFileAlt, FaCalculator, FaUpload, FaDownload, FaEye } from 'react-icons/fa';

export default function FinancialManagement() {
  const [activeTab, setActiveTab] = useState('expenses');
  const [expenses, setExpenses] = useState(() => {
    const savedExpenses = localStorage.getItem('financialExpenses');
    return savedExpenses ? JSON.parse(savedExpenses) : [];
  });
  const [revenues, setRevenues] = useState(() => {
    const savedRevenues = localStorage.getItem('financialRevenues');
    return savedRevenues ? JSON.parse(savedRevenues) : [];
  });
  const [documents, setDocuments] = useState(() => {
    const savedDocuments = localStorage.getItem('financialDocuments');
    return savedDocuments ? JSON.parse(savedDocuments) : [];
  });

  // Form states
  const [newExpense, setNewExpense] = useState({
    description: '',
    amount: '',
    category: 'Operacionais',
    date: new Date().toISOString().split('T')[0]
  });
  const [newRevenue, setNewRevenue] = useState({
    description: '',
    amount: '',
    category: 'Vendas',
    date: new Date().toISOString().split('T')[0]
  });

  // Editing states
  const [editingExpenseId, setEditingExpenseId] = useState(null);
  const [editingRevenueId, setEditingRevenueId] = useState(null);
  const [editExpenseData, setEditExpenseData] = useState({});
  const [editRevenueData, setEditRevenueData] = useState({});

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem('financialExpenses', JSON.stringify(expenses));
  }, [expenses]);

  useEffect(() => {
    localStorage.setItem('financialRevenues', JSON.stringify(revenues));
  }, [revenues]);

  useEffect(() => {
    localStorage.setItem('financialDocuments', JSON.stringify(documents));
  }, [documents]);

  // Calculate totals
  const totalExpenses = expenses.reduce((sum, expense) => sum + parseFloat(expense.amount || 0), 0);
  const totalRevenues = revenues.reduce((sum, revenue) => sum + parseFloat(revenue.amount || 0), 0);
  const totalProfit = totalRevenues - totalExpenses;

  // Add expense
  const addExpense = () => {
    if (newExpense.description.trim() && newExpense.amount) {
      const expense = {
        id: Date.now(),
        ...newExpense,
        amount: parseFloat(newExpense.amount),
        createdAt: new Date().toISOString()
      };
      setExpenses([expense, ...expenses]);
      setNewExpense({
        description: '',
        amount: '',
        category: 'Operacionais',
        date: new Date().toISOString().split('T')[0]
      });
    }
  };

  // Add revenue
  const addRevenue = () => {
    if (newRevenue.description.trim() && newRevenue.amount) {
      const revenue = {
        id: Date.now(),
        ...newRevenue,
        amount: parseFloat(newRevenue.amount),
        createdAt: new Date().toISOString()
      };
      setRevenues([revenue, ...revenues]);
      setNewRevenue({
        description: '',
        amount: '',
        category: 'Vendas',
        date: new Date().toISOString().split('T')[0]
      });
    }
  };

  // Edit functions
  const startEditingExpense = (expense) => {
    setEditingExpenseId(expense.id);
    setEditExpenseData({
      description: expense.description,
      amount: expense.amount,
      category: expense.category,
      date: expense.date
    });
  };

  const saveEditedExpense = () => {
    const updatedExpenses = expenses.map(expense =>
      expense.id === editingExpenseId
        ? {
            ...expense,
            ...editExpenseData,
            amount: parseFloat(editExpenseData.amount)
          }
        : expense
    );
    setExpenses(updatedExpenses);
    setEditingExpenseId(null);
    setEditExpenseData({});
  };

  const startEditingRevenue = (revenue) => {
    setEditingRevenueId(revenue.id);
    setEditRevenueData({
      description: revenue.description,
      amount: revenue.amount,
      category: revenue.category,
      date: revenue.date
    });
  };

  const saveEditedRevenue = () => {
    const updatedRevenues = revenues.map(revenue =>
      revenue.id === editingRevenueId
        ? {
            ...revenue,
            ...editRevenueData,
            amount: parseFloat(editRevenueData.amount)
          }
        : revenue
    );
    setRevenues(updatedRevenues);
    setEditingRevenueId(null);
    setEditRevenueData({});
  };

  // Delete functions
  const deleteExpense = (id) => {
    if (window.confirm('Tem certeza que deseja eliminar esta despesa?')) {
      setExpenses(expenses.filter(expense => expense.id !== id));
    }
  };

  const deleteRevenue = (id) => {
    if (window.confirm('Tem certeza que deseja eliminar esta receita?')) {
      setRevenues(revenues.filter(revenue => revenue.id !== id));
    }
  };

  // Document functions
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const document = {
          id: Date.now(),
          name: file.name,
          type: file.type,
          size: file.size,
          data: e.target.result,
          uploadedAt: new Date().toISOString()
        };
        setDocuments([document, ...documents]);
      };
      reader.readAsDataURL(file);
    }
  };

  const deleteDocument = (id) => {
    if (window.confirm('Tem certeza que deseja eliminar este documento?')) {
      setDocuments(documents.filter(doc => doc.id !== id));
    }
  };

  const downloadDocument = (document) => {
    const link = document.createElement('a');
    link.href = document.data;
    link.download = document.name;
    link.click();
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('pt-PT', {
      style: 'currency',
      currency: 'CVE'
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Navigation Tabs */}
      <div style={{backgroundColor: 'white', padding: '1rem', borderRadius: '0.5rem', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'}}>
        <div style={{display: 'flex', gap: '1rem', marginBottom: '1.5rem', borderBottom: '1px solid #e5e7eb'}}>
          <button
            onClick={() => setActiveTab('expenses')}
            style={{
              padding: '0.5rem 1rem',
              border: 'none',
              backgroundColor: activeTab === 'expenses' ? '#dc2626' : 'transparent',
              color: activeTab === 'expenses' ? 'white' : '#6b7280',
              borderRadius: '0.375rem',
              fontWeight: '500',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <FaMoneyBillWave />
            Despesas
          </button>
          <button
            onClick={() => setActiveTab('revenues')}
            style={{
              padding: '0.5rem 1rem',
              border: 'none',
              backgroundColor: activeTab === 'revenues' ? '#059669' : 'transparent',
              color: activeTab === 'revenues' ? 'white' : '#6b7280',
              borderRadius: '0.375rem',
              fontWeight: '500',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <FaMoneyBillWave />
            Receitas
          </button>
          <button
            onClick={() => setActiveTab('profits')}
            style={{
              padding: '0.5rem 1rem',
              border: 'none',
              backgroundColor: activeTab === 'profits' ? '#7c3aed' : 'transparent',
              color: activeTab === 'profits' ? 'white' : '#6b7280',
              borderRadius: '0.375rem',
              fontWeight: '500',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <FaCalculator />
            Lucros
          </button>
          <button
            onClick={() => setActiveTab('documents')}
            style={{
              padding: '0.5rem 1rem',
              border: 'none',
              backgroundColor: activeTab === 'documents' ? '#2563eb' : 'transparent',
              color: activeTab === 'documents' ? 'white' : '#6b7280',
              borderRadius: '0.375rem',
              fontWeight: '500',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <FaFileAlt />
            Documentos
          </button>
        </div>

        {/* Summary Cards */}
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1rem'}}>
          <div style={{backgroundColor: '#fef2f2', padding: '1rem', borderRadius: '0.5rem', border: '1px solid #fecaca'}}>
            <div style={{fontSize: '0.875rem', color: '#dc2626', fontWeight: '500'}}>Total Despesas</div>
            <div style={{fontSize: '1.5rem', fontWeight: 'bold', color: '#dc2626'}}>{formatCurrency(totalExpenses)}</div>
          </div>
          <div style={{backgroundColor: '#f0fdf4', padding: '1rem', borderRadius: '0.5rem', border: '1px solid #bbf7d0'}}>
            <div style={{fontSize: '0.875rem', color: '#059669', fontWeight: '500'}}>Total Receitas</div>
            <div style={{fontSize: '1.5rem', fontWeight: 'bold', color: '#059669'}}>{formatCurrency(totalRevenues)}</div>
          </div>
          <div style={{backgroundColor: totalProfit >= 0 ? '#faf5ff' : '#fef2f2', padding: '1rem', borderRadius: '0.5rem', border: `1px solid ${totalProfit >= 0 ? '#c4b5fd' : '#fecaca'}`}}>
            <div style={{fontSize: '0.875rem', color: totalProfit >= 0 ? '#7c3aed' : '#dc2626', fontWeight: '500'}}>Lucro Líquido</div>
            <div style={{fontSize: '1.5rem', fontWeight: 'bold', color: totalProfit >= 0 ? '#7c3aed' : '#dc2626'}}>{formatCurrency(totalProfit)}</div>
          </div>
        </div>
      </div>

      {/* Expenses Tab */}
      {activeTab === 'expenses' && (
        <>
          <h2 style={{fontSize: '1.25rem', fontWeight: '600', color: '#1f2937', marginBottom: '1rem', display: 'flex', alignItems: 'center'}}>
            <FaMoneyBillWave style={{marginRight: '0.5rem', color: '#dc2626'}} />
            Gestão de Despesas
          </h2>

          {/* Add Expense Form */}
          <div style={{backgroundColor: 'white', padding: '1.5rem', borderRadius: '0.5rem', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', marginBottom: '2rem'}}>
            <h3 style={{fontSize: '1.125rem', fontWeight: '500', color: '#374151', marginBottom: '1rem'}}>Adicionar Nova Despesa</h3>
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem'}}>
              <input
                type="text"
                placeholder="Descrição"
                value={newExpense.description}
                onChange={(e) => setNewExpense({...newExpense, description: e.target.value})}
                style={{
                  padding: '0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.375rem',
                  fontSize: '0.875rem'
                }}
              />
              <input
                type="number"
                placeholder="Valor (€)"
                value={newExpense.amount}
                onChange={(e) => setNewExpense({...newExpense, amount: e.target.value})}
                style={{
                  padding: '0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.375rem',
                  fontSize: '0.875rem'
                }}
              />
              <select
                value={newExpense.category}
                onChange={(e) => setNewExpense({...newExpense, category: e.target.value})}
                style={{
                  padding: '0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.375rem',
                  fontSize: '0.875rem'
                }}
              >
                <option value="Operacionais">Operacionais</option>
                <option value="Marketing">Marketing</option>
                <option value="Manutenção">Manutenção</option>
                <option value="Salários">Salários</option>
                <option value="Impostos">Impostos</option>
                <option value="Outros">Outros</option>
              </select>
              <input
                type="date"
                value={newExpense.date}
                onChange={(e) => setNewExpense({...newExpense, date: e.target.value})}
                style={{
                  padding: '0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.375rem',
                  fontSize: '0.875rem'
                }}
              />
              <button
                onClick={addExpense}
                disabled={!newExpense.description.trim() || !newExpense.amount}
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: (newExpense.description.trim() && newExpense.amount) ? '#dc2626' : '#d1d5db',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.375rem',
                  cursor: (newExpense.description.trim() && newExpense.amount) ? 'pointer' : 'not-allowed',
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

          {/* Expenses List */}
          <div className="space-y-3">
            {expenses.map(expense => (
              <div key={expense.id} style={{
                backgroundColor: '#f9fafb',
                borderRadius: '0.5rem',
                border: '1px solid #e5e7eb',
                padding: '1rem'
              }}>
                {editingExpenseId === expense.id ? (
                  <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', alignItems: 'center'}}>
                    <input
                      type="text"
                      value={editExpenseData.description}
                      onChange={(e) => setEditExpenseData({...editExpenseData, description: e.target.value})}
                      style={{
                        padding: '0.5rem',
                        border: '1px solid #d1d5db',
                        borderRadius: '0.375rem',
                        fontSize: '0.875rem'
                      }}
                    />
                    <input
                      type="number"
                      value={editExpenseData.amount}
                      onChange={(e) => setEditExpenseData({...editExpenseData, amount: e.target.value})}
                      style={{
                        padding: '0.5rem',
                        border: '1px solid #d1d5db',
                        borderRadius: '0.375rem',
                        fontSize: '0.875rem'
                      }}
                    />
                    <select
                      value={editExpenseData.category}
                      onChange={(e) => setEditExpenseData({...editExpenseData, category: e.target.value})}
                      style={{
                        padding: '0.5rem',
                        border: '1px solid #d1d5db',
                        borderRadius: '0.375rem',
                        fontSize: '0.875rem'
                      }}
                    >
                      <option value="Operacionais">Operacionais</option>
                      <option value="Marketing">Marketing</option>
                      <option value="Manutenção">Manutenção</option>
                      <option value="Salários">Salários</option>
                      <option value="Impostos">Impostos</option>
                      <option value="Outros">Outros</option>
                    </select>
                    <input
                      type="date"
                      value={editExpenseData.date}
                      onChange={(e) => setEditExpenseData({...editExpenseData, date: e.target.value})}
                      style={{
                        padding: '0.5rem',
                        border: '1px solid #d1d5db',
                        borderRadius: '0.375rem',
                        fontSize: '0.875rem'
                      }}
                    />
                    <div style={{display: 'flex', gap: '0.5rem'}}>
                      <button
                        onClick={saveEditedExpense}
                        style={{
                          padding: '0.5rem',
                          backgroundColor: '#10b981',
                          color: 'white',
                          border: 'none',
                          borderRadius: '0.25rem',
                          cursor: 'pointer'
                        }}
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => setEditingExpenseId(null)}
                        style={{
                          padding: '0.5rem',
                          backgroundColor: '#6b7280',
                          color: 'white',
                          border: 'none',
                          borderRadius: '0.25rem',
                          cursor: 'pointer'
                        }}
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                ) : (
                  <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                    <div style={{flex: 1}}>
                      <div style={{display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem'}}>
                        <h4 style={{fontWeight: '600', color: '#1f2937'}}>{expense.description}</h4>
                        <span style={{
                          backgroundColor: '#fee2e2',
                          color: '#dc2626',
                          padding: '0.25rem 0.5rem',
                          borderRadius: '0.25rem',
                          fontSize: '0.75rem',
                          fontWeight: '500'
                        }}>
                          {expense.category}
                        </span>
                      </div>
                      <div style={{display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.875rem', color: '#6b7280'}}>
                        <span style={{fontWeight: '600', color: '#dc2626'}}>{formatCurrency(expense.amount)}</span>
                        <span>{new Date(expense.date).toLocaleDateString('pt-PT')}</span>
                      </div>
                    </div>
                    <div style={{display: 'flex', gap: '0.5rem'}}>
                      <button
                        onClick={() => startEditingExpense(expense)}
                        style={{
                          color: '#2563eb',
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          padding: '0.5rem',
                          borderRadius: '0.25rem'
                        }}
                        onMouseOver={(e) => e.target.style.backgroundColor = '#eff6ff'}
                        onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => deleteExpense(expense.id)}
                        style={{
                          color: '#dc2626',
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          padding: '0.5rem',
                          borderRadius: '0.25rem'
                        }}
                        onMouseOver={(e) => e.target.style.backgroundColor = '#fef2f2'}
                        onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {expenses.length === 0 && (
            <div style={{textAlign: 'center', padding: '2rem', color: '#6b7280'}}>
              <FaMoneyBillWave style={{fontSize: '3rem', marginBottom: '1rem', opacity: 0.5}} />
              <p>Nenhuma despesa registrada ainda.</p>
            </div>
          )}
        </>
      )}

      {/* Revenues Tab */}
      {activeTab === 'revenues' && (
        <>
          <h2 style={{fontSize: '1.25rem', fontWeight: '600', color: '#1f2937', marginBottom: '1rem', display: 'flex', alignItems: 'center'}}>
            <FaMoneyBillWave style={{marginRight: '0.5rem', color: '#059669'}} />
            Gestão de Receitas
          </h2>

          {/* Add Revenue Form */}
          <div style={{backgroundColor: 'white', padding: '1.5rem', borderRadius: '0.5rem', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', marginBottom: '2rem'}}>
            <h3 style={{fontSize: '1.125rem', fontWeight: '500', color: '#374151', marginBottom: '1rem'}}>Adicionar Nova Receita</h3>
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem'}}>
              <input
                type="text"
                placeholder="Descrição"
                value={newRevenue.description}
                onChange={(e) => setNewRevenue({...newRevenue, description: e.target.value})}
                style={{
                  padding: '0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.375rem',
                  fontSize: '0.875rem'
                }}
              />
              <input
                type="number"
                placeholder="Valor (€)"
                value={newRevenue.amount}
                onChange={(e) => setNewRevenue({...newRevenue, amount: e.target.value})}
                style={{
                  padding: '0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.375rem',
                  fontSize: '0.875rem'
                }}
              />
              <select
                value={newRevenue.category}
                onChange={(e) => setNewRevenue({...newRevenue, category: e.target.value})}
                style={{
                  padding: '0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.375rem',
                  fontSize: '0.875rem'
                }}
              >
                <option value="Vendas">Vendas</option>
                <option value="Arrendamento">Arrendamento</option>
                <option value="Comissões">Comissões</option>
                <option value="Serviços">Serviços</option>
                <option value="Outros">Outros</option>
              </select>
              <input
                type="date"
                value={newRevenue.date}
                onChange={(e) => setNewRevenue({...newRevenue, date: e.target.value})}
                style={{
                  padding: '0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.375rem',
                  fontSize: '0.875rem'
                }}
              />
              <button
                onClick={addRevenue}
                disabled={!newRevenue.description.trim() || !newRevenue.amount}
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: (newRevenue.description.trim() && newRevenue.amount) ? '#059669' : '#d1d5db',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.375rem',
                  cursor: (newRevenue.description.trim() && newRevenue.amount) ? 'pointer' : 'not-allowed',
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

          {/* Revenues List */}
          <div className="space-y-3">
            {revenues.map(revenue => (
              <div key={revenue.id} style={{
                backgroundColor: '#f9fafb',
                borderRadius: '0.5rem',
                border: '1px solid #e5e7eb',
                padding: '1rem'
              }}>
                {editingRevenueId === revenue.id ? (
                  <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', alignItems: 'center'}}>
                    <input
                      type="text"
                      value={editRevenueData.description}
                      onChange={(e) => setEditRevenueData({...editRevenueData, description: e.target.value})}
                      style={{
                        padding: '0.5rem',
                        border: '1px solid #d1d5db',
                        borderRadius: '0.375rem',
                        fontSize: '0.875rem'
                      }}
                    />
                    <input
                      type="number"
                      value={editRevenueData.amount}
                      onChange={(e) => setEditRevenueData({...editRevenueData, amount: e.target.value})}
                      style={{
                        padding: '0.5rem',
                        border: '1px solid #d1d5db',
                        borderRadius: '0.375rem',
                        fontSize: '0.875rem'
                      }}
                    />
                    <select
                      value={editRevenueData.category}
                      onChange={(e) => setEditRevenueData({...editRevenueData, category: e.target.value})}
                      style={{
                        padding: '0.5rem',
                        border: '1px solid #d1d5db',
                        borderRadius: '0.375rem',
                        fontSize: '0.875rem'
                      }}
                    >
                      <option value="Vendas">Vendas</option>
                      <option value="Arrendamento">Arrendamento</option>
                      <option value="Comissões">Comissões</option>
                      <option value="Serviços">Serviços</option>
                      <option value="Outros">Outros</option>
                    </select>
                    <input
                      type="date"
                      value={editRevenueData.date}
                      onChange={(e) => setEditRevenueData({...editRevenueData, date: e.target.value})}
                      style={{
                        padding: '0.5rem',
                        border: '1px solid #d1d5db',
                        borderRadius: '0.375rem',
                        fontSize: '0.875rem'
                      }}
                    />
                    <div style={{display: 'flex', gap: '0.5rem'}}>
                      <button
                        onClick={saveEditedRevenue}
                        style={{
                          padding: '0.5rem',
                          backgroundColor: '#10b981',
                          color: 'white',
                          border: 'none',
                          borderRadius: '0.25rem',
                          cursor: 'pointer'
                        }}
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => setEditingRevenueId(null)}
                        style={{
                          padding: '0.5rem',
                          backgroundColor: '#6b7280',
                          color: 'white',
                          border: 'none',
                          borderRadius: '0.25rem',
                          cursor: 'pointer'
                        }}
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                ) : (
                  <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                    <div style={{flex: 1}}>
                      <div style={{display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem'}}>
                        <h4 style={{fontWeight: '600', color: '#1f2937'}}>{revenue.description}</h4>
                        <span style={{
                          backgroundColor: '#d1fae5',
                          color: '#059669',
                          padding: '0.25rem 0.5rem',
                          borderRadius: '0.25rem',
                          fontSize: '0.75rem',
                          fontWeight: '500'
                        }}>
                          {revenue.category}
                        </span>
                      </div>
                      <div style={{display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.875rem', color: '#6b7280'}}>
                        <span style={{fontWeight: '600', color: '#059669'}}>{formatCurrency(revenue.amount)}</span>
                        <span>{new Date(revenue.date).toLocaleDateString('pt-PT')}</span>
                      </div>
                    </div>
                    <div style={{display: 'flex', gap: '0.5rem'}}>
                      <button
                        onClick={() => startEditingRevenue(revenue)}
                        style={{
                          color: '#2563eb',
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          padding: '0.5rem',
                          borderRadius: '0.25rem'
                        }}
                        onMouseOver={(e) => e.target.style.backgroundColor = '#eff6ff'}
                        onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => deleteRevenue(revenue.id)}
                        style={{
                          color: '#dc2626',
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          padding: '0.5rem',
                          borderRadius: '0.25rem'
                        }}
                        onMouseOver={(e) => e.target.style.backgroundColor = '#fef2f2'}
                        onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {revenues.length === 0 && (
            <div style={{textAlign: 'center', padding: '2rem', color: '#6b7280'}}>
              <FaMoneyBillWave style={{fontSize: '3rem', marginBottom: '1rem', opacity: 0.5}} />
              <p>Nenhuma receita registrada ainda.</p>
            </div>
          )}
        </>
      )}

      {/* Profits Tab */}
      {activeTab === 'profits' && (
        <>
          <h2 style={{fontSize: '1.25rem', fontWeight: '600', color: '#1f2937', marginBottom: '1rem', display: 'flex', alignItems: 'center'}}>
            <FaCalculator style={{marginRight: '0.5rem', color: '#7c3aed'}} />
            Análise de Lucros
          </h2>

          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem'}}>
            {/* Profit Summary */}
            <div style={{backgroundColor: 'white', padding: '2rem', borderRadius: '0.5rem', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'}}>
              <h3 style={{fontSize: '1.125rem', fontWeight: '600', color: '#1f2937', marginBottom: '1.5rem'}}>Resumo Financeiro</h3>
              <div className="space-y-4">
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', backgroundColor: '#fef2f2', borderRadius: '0.375rem'}}>
                  <span style={{fontWeight: '500', color: '#dc2626'}}>Total de Despesas</span>
                  <span style={{fontSize: '1.25rem', fontWeight: 'bold', color: '#dc2626'}}>{formatCurrency(totalExpenses)}</span>
                </div>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', backgroundColor: '#f0fdf4', borderRadius: '0.375rem'}}>
                  <span style={{fontWeight: '500', color: '#059669'}}>Total de Receitas</span>
                  <span style={{fontSize: '1.25rem', fontWeight: 'bold', color: '#059669'}}>{formatCurrency(totalRevenues)}</span>
                </div>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', backgroundColor: totalProfit >= 0 ? '#faf5ff' : '#fef2f2', borderRadius: '0.375rem', border: `2px solid ${totalProfit >= 0 ? '#c4b5fd' : '#fecaca'}`}}>
                  <span style={{fontWeight: '600', color: totalProfit >= 0 ? '#7c3aed' : '#dc2626'}}>Lucro Líquido</span>
                  <span style={{fontSize: '1.5rem', fontWeight: 'bold', color: totalProfit >= 0 ? '#7c3aed' : '#dc2626'}}>{formatCurrency(totalProfit)}</span>
                </div>
              </div>
            </div>

            {/* Profit Margin */}
            <div style={{backgroundColor: 'white', padding: '2rem', borderRadius: '0.5rem', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'}}>
              <h3 style={{fontSize: '1.125rem', fontWeight: '600', color: '#1f2937', marginBottom: '1.5rem'}}>Margem de Lucro</h3>
              <div style={{textAlign: 'center'}}>
                <div style={{fontSize: '3rem', fontWeight: 'bold', color: totalProfit >= 0 ? '#7c3aed' : '#dc2626', marginBottom: '0.5rem'}}>
                  {totalRevenues > 0 ? ((totalProfit / totalRevenues) * 100).toFixed(1) : 0}%
                </div>
                <p style={{color: '#6b7280'}}>Margem de lucro sobre receitas</p>
              </div>
            </div>
          </div>

          {/* Recent Transactions */}
          <div style={{backgroundColor: 'white', padding: '2rem', borderRadius: '0.5rem', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', marginTop: '2rem'}}>
            <h3 style={{fontSize: '1.125rem', fontWeight: '600', color: '#1f2937', marginBottom: '1.5rem'}}>Transações Recentes</h3>
            <div className="space-y-3">
              {[...expenses, ...revenues]
                .sort((a, b) => new Date(b.date || b.createdAt) - new Date(a.date || a.createdAt))
                .slice(0, 10)
                .map(item => (
                  <div key={`${item.id}-${'amount' in item ? 'expense' : 'revenue'}`} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '1rem',
                    backgroundColor: 'amount' in item ? '#fef2f2' : '#f0fdf4',
                    borderRadius: '0.375rem',
                    border: '1px solid #e5e7eb'
                  }}>
                    <div>
                      <div style={{fontWeight: '600', color: '#1f2937'}}>{item.description}</div>
                      <div style={{fontSize: '0.875rem', color: '#6b7280'}}>
                        {item.category} • {new Date(item.date || item.createdAt).toLocaleDateString('pt-PT')}
                      </div>
                    </div>
                    <div style={{
                      fontSize: '1.125rem',
                      fontWeight: 'bold',
                      color: 'amount' in item ? '#dc2626' : '#059669'
                    }}>
                      {'amount' in item ? '-' : '+'}{formatCurrency(item.amount)}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </>
      )}

      {/* Documents Tab */}
      {activeTab === 'documents' && (
        <>
          <h2 style={{fontSize: '1.25rem', fontWeight: '600', color: '#1f2937', marginBottom: '1rem', display: 'flex', alignItems: 'center'}}>
            <FaFileAlt style={{marginRight: '0.5rem', color: '#2563eb'}} />
            Gestão de Documentos
          </h2>

          {/* Upload Document */}
          <div style={{backgroundColor: 'white', padding: '2rem', borderRadius: '0.5rem', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', marginBottom: '2rem'}}>
            <h3 style={{fontSize: '1.125rem', fontWeight: '500', color: '#374151', marginBottom: '1rem'}}>Upload de Documento</h3>
            <div style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
              <input
                type="file"
                onChange={handleFileUpload}
                accept=".pdf,.doc,.docx,.xls,.xlsx,.txt,.jpg,.jpeg,.png"
                style={{display: 'none'}}
                id="document-upload"
              />
              <label
                htmlFor="document-upload"
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: '#2563eb',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.375rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                <FaUpload />
                Escolher Arquivo
              </label>
              <span style={{color: '#6b7280', fontSize: '0.875rem'}}>
                Tipos aceitos: PDF, DOC, XLS, TXT, JPG, PNG (máx. 10MB)
              </span>
            </div>
          </div>

          {/* Documents List */}
          <div className="space-y-3">
            {documents.map(document => (
              <div key={document.id} style={{
                backgroundColor: '#f9fafb',
                borderRadius: '0.5rem',
                border: '1px solid #e5e7eb',
                padding: '1rem'
              }}>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                  <div style={{flex: 1}}>
                    <div style={{display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem'}}>
                      <FaFileAlt style={{color: '#2563eb', fontSize: '1.25rem'}} />
                      <div>
                        <h4 style={{fontWeight: '600', color: '#1f2937'}}>{document.name}</h4>
                        <div style={{fontSize: '0.875rem', color: '#6b7280'}}>
                          {(document.size / 1024).toFixed(1)} KB • {new Date(document.uploadedAt).toLocaleDateString('pt-PT')}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div style={{display: 'flex', gap: '0.5rem'}}>
                    <button
                      onClick={() => downloadDocument(document)}
                      style={{
                        color: '#2563eb',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        padding: '0.5rem',
                        borderRadius: '0.25rem'
                      }}
                      onMouseOver={(e) => e.target.style.backgroundColor = '#eff6ff'}
                      onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
                      title="Download"
                    >
                      <FaDownload />
                    </button>
                    <button
                      onClick={() => deleteDocument(document.id)}
                      style={{
                        color: '#dc2626',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        padding: '0.5rem',
                        borderRadius: '0.25rem'
                      }}
                      onMouseOver={(e) => e.target.style.backgroundColor = '#fef2f2'}
                      onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
                      title="Eliminar"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {documents.length === 0 && (
            <div style={{textAlign: 'center', padding: '2rem', color: '#6b7280'}}>
              <FaFileAlt style={{fontSize: '3rem', marginBottom: '1rem', opacity: 0.5}} />
              <p>Nenhum documento enviado ainda.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}