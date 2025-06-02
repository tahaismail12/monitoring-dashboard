import React, { useState } from 'react';
import LeadDashboard from './components/LeadDashboard';
import DealDashboard from './components/DealDashboard';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('leads');

  return (
    <div className="App">
      <h1>Monitoring Dashboard</h1>
      <div className="tab-buttons">
        <button onClick={() => setActiveTab('leads')} className={activeTab === 'leads' ? 'active' : ''}>
          Leads
        </button>
        <button onClick={() => setActiveTab('deals')} className={activeTab === 'deals' ? 'active' : ''}>
          Deals
        </button>
      </div>

      <div className="dashboard-content">
        {activeTab === 'leads' && <LeadDashboard />}
        {activeTab === 'deals' && <DealDashboard />}
      </div>
    </div>
  );
}

export default App;




