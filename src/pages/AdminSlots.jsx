import React, { useState, useEffect } from 'react';
import api from '../api';

const AdminSlots = () => {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [slotNumber, setSlotNumber] = useState('');
  const [vehicleType, setVehicleType] = useState('CAR');
  const [message, setMessage] = useState('');

  const fetchSlots = async () => {
    try {
      const response = await api.get('/slots');
      setSlots(response.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSlots();
  }, []);

  const handleAddSlot = async (e) => {
    e.preventDefault();
    try {
      await api.post('/slots', { slotNumber, type: vehicleType });
      setMessage({ text: 'Slot created successfully!', type: 'success' });
      setSlotNumber('');
      fetchSlots();
    } catch (err) {
      setMessage({ text: err.response?.data?.message || 'Failed to create slot.', type: 'danger' });
    }
    setTimeout(() => setMessage(''), 3000);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this slot?')) return;
    try {
      await api.delete(`/slots/${id}`);
      fetchSlots();
    } catch (err) {
      alert('Cannot delete slot. It might have active bookings.');
    }
  };

  return (
    <div>
      <h2 style={{ marginBottom: '2rem' }}>Slot Management</h2>

      {message && <div className={`alert alert-${message.type}`}>{message.text}</div>}

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) 2fr', gap: '2rem', alignItems: 'start' }}>
        <div className="card">
          <h3 style={{ marginBottom: '1.5rem' }}>Add New Slot</h3>
          <form onSubmit={handleAddSlot}>
            <div className="form-group">
              <label className="form-label">Slot Number (e.g., A1)</label>
              <input
                type="text"
                className="form-control"
                value={slotNumber}
                onChange={e => setSlotNumber(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Vehicle Type</label>
              <select 
                className="form-select"
                value={vehicleType}
                onChange={e => setVehicleType(e.target.value)}
              >
                <option value="CAR">CAR</option>
                <option value="BIKE">BIKE</option>
              </select>
            </div>
            <button type="submit" className="btn btn-success" style={{ width: '100%' }}>
              Save Slot
            </button>
          </form>
        </div>

        <div className="table-container">
          {loading ? (
            <div style={{ padding: '2rem', textAlign: 'center' }}>Loading slots...</div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Slot Label</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {slots.map(slot => (
                  <tr key={slot.id}>
                    <td>{slot.id}</td>
                    <td>{slot.slotNumber}</td>
                    <td>{slot.type}</td>
                    <td>
                      <span className={`badge ${slot.status === 'AVAILABLE' ? 'active' : 'completed'}`}>
                        {slot.status}
                      </span>
                    </td>
                    <td>
                      <button 
                        className="btn btn-danger"
                        style={{ padding: '0.25rem 0.75rem', fontSize: '0.875rem' }}
                        onClick={() => handleDelete(slot.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminSlots;
