import React, { useState, useEffect } from 'react';
import './App.css';

const App = () => {
  const [theme, setTheme] = useState('stellar'); 
  const [samples, setSamples] = useState([]); 
  const [newSample, setNewSample] = useState({ name: '', status: 'Pending' });

  // FETCH DATA ON LOAD - Make sure this matches your devtunnels URL!
  useEffect(() => {
    fetch('https://lk98mgln-8081.inc1.devtunnels.ms/api/samples')
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
      const response = await fetch('https://lk98mgln-8081.inc1.devtunnels.ms/api/samples', {
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
      await fetch(`https://lk98mgln-8081.inc1.devtunnels.ms/api/samples/${id}`, {
        method: 'DELETE',
      });
      
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
      <div className="app-window">
        
        <header className="header">
          <h1>{theme === 'classic' ? 'LabVantage - Sample Management v4.0' : 'LIMS Stellar Edition'}</h1>
          <div className="header-btns">
            <button onClick={toggleTheme}>
              {theme === 'classic' ? 'Switch to Stellar UI' : 'Switch to Classic UI'}
            </button>
            {theme === 'classic' && (
              <>
                <button>_</button>
                <button>☐</button>
                <button>X</button>
              </>
            )}
          </div>
        </header>

        <div className="menu-bar">
          <span className="menu-item"><u>F</u>ile</span>
          <span className="menu-item"><u>E</u>dit</span>
          <span className="menu-item"><u>V</u>iew</span>
          <span className="menu-item"><u>T</u>ools</span>
          <span className="menu-item"><u>H</u>elp</span>
        </div>

        <div className="content-area">
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

          {/* New responsive wrapper for the table */}
          <div className="table-responsive">
            <table>
              <thead>
                <tr>
                  <th>Sample ID</th>
                  <th>Name</th>
                  <th>Registration Date</th>
                  <th>Status</th>
                  <th>Actions</th>
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
                      <button 
                        onClick={() => handleDeleteSample(sample.id)}
                        style={{ background: '#ef4444', color: '#fff', padding: '0.3rem 0.8rem', fontSize: '0.8rem', width: 'auto' }}
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
        </div>

        <div className="status-bar">
          <span>Ready. Connected to PostgreSQL.</span>
          <span>Date: {new Date().toISOString().split('T')[0]}</span>
        </div>

      </div>
    </div>
  );
};

export default App;