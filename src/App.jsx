import React, { useState } from 'react';
import './App.css'; // Assuming you have some basic styles for the app

const App = () => {
  const [theme, setTheme] = useState('stellar'); // 'classic' or 'stellar'
  const [samples, setSamples] = useState([
    { id: 'SMP-1001', name: 'Blood Serum Alpha', status: 'Completed', date: '2026-09-28' },
    { id: 'SMP-1002', name: 'Water Quality Test B', status: 'Processing', date: '2026-09-28' },
    { id: 'SMP-1003', name: 'Soil Extract Gamma', status: 'Pending', date: '2026-09-29' },
  ]);

  const [newSample, setNewSample] = useState({ name: '', status: 'Pending' });

  const toggleTheme = () => {
    setTheme(theme === 'classic' ? 'stellar' : 'classic');
  };

  const handleAddSample = () => {
    if (!newSample.name) return;
    const sample = {
      id: `SMP-${1004 + samples.length}`,
      name: newSample.name,
      status: newSample.status,
      date: new Date().toISOString().split('T')[0]
    };
    setSamples([...samples, sample]);
    setNewSample({ name: '', status: 'Pending' });
  };

  const getStatusClass = (status) => {
    return `status-badge status-${status.toLowerCase()}`;
  };

  return (
    <div className={`app-container ${theme}-mode`}>
      <header className="header">
        <h1>{theme === 'classic' ? 'LIMS v4.0 - LabVantage Clone' : 'LIMS Stellar Edition'}</h1>
        <button onClick={toggleTheme}>
          Switch to {theme === 'classic' ? 'Stellar' : 'Classic'} Mode
        </button>
      </header>

      {/* Dashboard Metrics */}
      <div className="dashboard">
        <div className="stat-card">
          <p>Total Samples</p>
          <h3>{samples.length}</h3>
        </div>
        <div className="stat-card">
          <p>Pending</p>
          <h3>{samples.filter(s => s.status === 'Pending').length}</h3>
        </div>
        <div className="stat-card">
          <p>Completed</p>
          <h3>{samples.filter(s => s.status === 'Completed').length}</h3>
        </div>
      </div>

      {/* Action / Input Form */}
      <div className="form-container">
        <input 
          type="text" 
          placeholder="Sample Name" 
          value={newSample.name}
          onChange={(e) => setNewSample({...newSample, name: e.target.value})}
        />
        <select 
          value={newSample.status} 
          onChange={(e) => setNewSample({...newSample, status: e.target.value})}
        >
          <option value="Pending">Pending</option>
          <option value="Processing">Processing</option>
          <option value="Completed">Completed</option>
        </select>
        <button onClick={handleAddSample}>Register Sample</button>
      </div>

      {/* Data Table */}
      <table>
        <thead>
          <tr>
            <th>Sample ID</th>
            <th>Name</th>
            <th>Registration Date</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {samples.map((sample) => (
            <tr key={sample.id}>
              <td>{sample.id}</td>
              <td>{sample.name}</td>
              <td>{sample.date}</td>
              <td>
                <span className={theme === 'stellar' ? getStatusClass(sample.status) : ''}>
                  {sample.status}
                </span>
              </td>
            </tr>
          ))}
          {samples.length === 0 && (
            <tr>
              <td colSpan="4" style={{ textAlign: 'center' }}>No samples found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default App;