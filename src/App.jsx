import React, { useState, useEffect } from 'react';
import './App.css';

const App = () => {
  const [theme, setTheme] = useState('stellar'); 
  const [samples, setSamples] = useState([]); 
  const [newSample, setNewSample] = useState({ name: '', status: 'Pending' });

  // FETCH DATA ON LOAD
  useEffect(() => {
    fetch('http://localhost:8081/api/samples')
      .then(res => res.json())
      .then(data => setSamples(data))
      .catch(err => console.error("Failed to fetch samples:", err));
  }, []);

  const toggleTheme = () => {
    setTheme(theme === 'classic' ? 'stellar' : 'classic');
  };

  // ADD SAMPLE
  const handleAddSample = async () => {
    if (!newSample.name) return;
    
    const newId = `SMP-${Math.floor(Math.random() * 10000)}`;
    const sample = {
      id: newId,
      name: newSample.name,
      status: newSample.status,
      date: new Date().toISOString().split('T')[0]
    };

    try {
      const response = await fetch('http://localhost:8081/api/samples', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sample)
      });
      
      const savedSample = await response.json();
      setSamples([...samples, savedSample]);
      setNewSample({ name: '', status: 'Pending' });
    } catch (err) {
      console.error("Failed to save sample:", err);
    }
  };

  // DELETE SAMPLE
  const handleDeleteSample = async (id) => {
    try {
      await fetch(`http://localhost:8081/api/samples/${id}`, {
        method: 'DELETE',
      });
      
      // Update UI by filtering out the deleted sample
      setSamples(samples.filter(sample => sample.id !== id));
    } catch (err) {
      console.error("Failed to delete sample:", err);
    }
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

      <table>
        <thead>
          <tr>
            <th>Sample ID</th>
            <th>Name</th>
            <th>Registration Date</th>
            <th>Status</th>
            <th>Actions</th> {/* New Column Header */}
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
              <td>
                {/* Delete Button */}
                <button 
                  onClick={() => handleDeleteSample(sample.id)}
                  style={{ background: '#ef4444', color: '#fff', padding: '0.3rem 0.8rem', fontSize: '0.8rem' }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
          {samples.length === 0 && (
            <tr>
              <td colSpan="5" style={{ textAlign: 'center' }}>No samples found or loading...</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default App;