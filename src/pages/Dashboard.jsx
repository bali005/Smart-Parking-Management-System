import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import { getUser } from '../utils';

const Dashboard = () => {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);

  const user = getUser();
  const userName = user?.name || 'User';

  const fetchSlots = async () => {
    try {
      const response = await api.get('/slots');
      setSlots(response.data);
    } catch (err) {
      console.error('Failed to fetch slots', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSlots();
    const interval = setInterval(fetchSlots, 10000);
    return () => clearInterval(interval);
  }, []);

  const totalSlots = slots.length;
  const occupiedSlots = slots.filter(s => s.status === 'OCCUPIED').length;
  const availableSlots = totalSlots - occupiedSlots;

  return (
    <div>
      <div className="dashboard-header" style={{ alignItems: 'flex-start' }}>
        <div>
          <h2 style={{ marginBottom: '0.5rem', color: 'var(--primary)', fontSize: '1.8rem' }}>
            Welcome {userName} to PMS
          </h2>
          <p className="card-subtitle">Monitor all parking slots in real time.</p>
        </div>
        <Link to="/booking" className="btn btn-primary">Book a Slot</Link>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">{totalSlots}</div>
          <div className="stat-label">Total Slots</div>
        </div>
        <div className="stat-card">
          <div className="stat-value available">{availableSlots}</div>
          <div className="stat-label">Available</div>
        </div>
        <div className="stat-card">
          <div className="stat-value occupied">{occupiedSlots}</div>
          <div className="stat-label">Occupied</div>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '2rem' }}>Loading slots...</div>
      ) : (
        <div className="grid-slots">
          {slots.map(slot => (
            <div 
              key={slot.id} 
              className={`slot-card ${slot.status.toLowerCase()}`}
            >
              <div className="slot-number">{slot.slotNumber}</div>
              <div className="slot-type">{slot.type}</div>
              <div className="slot-status">{slot.status}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
