import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const BookingPage = () => {
  const navigate = useNavigate();
  const [slots, setSlots] = useState([]);
  const [slotId, setSlotId] = useState('');
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    const loadSlots = async () => {
      try {
        const response = await api.get('/slots');
        const availableSlots = response.data.filter((slot) => slot.status === 'AVAILABLE');
        setSlots(availableSlots);
        if (availableSlots.length > 0) {
          setSlotId(String(availableSlots[0].id));
        }
      } catch {
        setMessage({ type: 'danger', text: 'Failed to load parking slots.' });
      } finally {
        setLoading(false);
      }
    };

    loadSlots();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      await api.post('/bookings', {
        slotId: Number(slotId),
        vehicleNumber,
      });
      setMessage({ type: 'success', text: 'Parking slot booked successfully.' });
      setTimeout(() => navigate('/history'), 1200);
    } catch (err) {
      setMessage({ type: 'danger', text: err.response?.data?.message || 'Booking failed.' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="page-grid">
      <div className="card">
        <h2 className="card-title">Book Parking Slot</h2>
        <p className="card-subtitle">Choose an available slot and assign your vehicle.</p>

        {message && <div className={`alert alert-${message.type}`}>{message.text}</div>}

        {loading ? (
          <p>Loading available slots...</p>
        ) : slots.length === 0 ? (
          <div className="empty-state">No slots are available right now.</div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Available Slot</label>
              <select className="form-select" value={slotId} onChange={(e) => setSlotId(e.target.value)} required>
                {slots.map((slot) => (
                  <option key={slot.id} value={slot.id}>
                    {slot.slotNumber} - {slot.type}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Vehicle Number</label>
              <input
                type="text"
                className="form-control"
                value={vehicleNumber}
                onChange={(e) => setVehicleNumber(e.target.value.toUpperCase())}
                placeholder="MH12AB1234"
                required
              />
            </div>

            <button type="submit" className="btn btn-primary full-width" disabled={saving}>
              {saving ? 'Booking...' : 'Confirm Booking'}
            </button>
          </form>
        )}
      </div>

      <div className="card">
        <h3 className="card-title">Parking Rates</h3>
        <div className="rate-list">
          <div className="rate-item">
            <span>Car</span>
            <strong>Rs. 20 / hour</strong>
          </div>
          <div className="rate-item">
            <span>Bike</span>
            <strong>Rs. 10 / hour</strong>
          </div>
        </div>
        <p className="helper-text">
          Use the booking history page to exit a parking session and calculate the amount automatically.
        </p>
      </div>
    </div>
  );
};

export default BookingPage;
