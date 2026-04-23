import React, { useEffect, useState } from 'react';
import api from '../api';
import { getUser } from '../utils';

const BookingHistory = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [exitData, setExitData] = useState(null);

  // Modal states
  const [paymentModal, setPaymentModal] = useState({ show: false, booking: null, amount: 0 });
  const [receiptModal, setReceiptModal] = useState({ show: false, data: null });
  const [isProcessing, setIsProcessing] = useState(false);

  const user = getUser();
  const isAdmin = user?.role === 'ROLE_ADMIN';

  const fetchBookings = async () => {
    try {
      const endpoint = isAdmin ? '/bookings/all' : '/bookings';
      const response = await api.get(endpoint);
      setBookings(response.data);
    } catch (err) {
      console.error('Failed to fetch bookings', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const calculateAmount = (booking) => {
    const entry = new Date(booking.entryTime);
    const exit = new Date();
    let minutes = Math.floor((exit - entry) / 60000);
    minutes = Math.max(1, minutes);
    const billableHours = Math.ceil(minutes / 60.0);
    const ratePerHour = booking.slot?.type === 'CAR' ? 20.0 : 10.0;
    return billableHours * ratePerHour;
  };

  const handleInitiateExit = (booking) => {
    setPaymentModal({ show: true, booking, amount: calculateAmount(booking) });
  };

  const processPaymentAndExit = async () => {
    if (!paymentModal.booking) return;
    setIsProcessing(true);
    
    // Simulate payment processing delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    try {
      const response = await api.post(`/bookings/exit/${paymentModal.booking.id}`);
      setExitData(response.data);
      setPaymentModal({ show: false, booking: null, amount: 0 });
      setReceiptModal({ show: true, data: response.data.booking });
      fetchBookings();
    } catch (err) {
      alert(err.response?.data?.message || 'Exit operation failed');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div>
      <h2 style={{ marginBottom: '1.5rem' }}>{isAdmin ? 'All Bookings' : 'My Bookings'}</h2>

      {exitData && (
        <div className="alert alert-success">
          <strong>{exitData.message}</strong>
          <br />
          Parking Fee: Rs. {exitData.booking.amount}
        </div>
      )}

      <div className="table-container">
        {loading ? (
          <div style={{ padding: '2rem', textAlign: 'center' }}>Loading history...</div>
        ) : bookings.length === 0 ? (
          <div className="empty-state">No bookings found.</div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Booking ID</th>
                <th>Slot</th>
                <th>Vehicle</th>
                {isAdmin && <th>User</th>}
                <th>Entry Time</th>
                <th>Exit Time</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((row) => (
                <tr key={row.id}>
                  <td>#{row.id}</td>
                  <td>{row.slot.slotNumber} ({row.slot.type})</td>
                  <td>{row.vehicleNumber}</td>
                  {isAdmin && <td>{row.user.name}</td>}
                  <td>{new Date(row.entryTime).toLocaleString()}</td>
                  <td>{row.exitTime ? new Date(row.exitTime).toLocaleString() : '-'}</td>
                  <td>{row.amount > 0 ? `Rs. ${row.amount}` : '-'}</td>
                  <td>
                    <span className={`badge ${row.status.toLowerCase()}`}>{row.status}</span>
                  </td>
                  <td>
                    {row.status === 'ACTIVE' && (
                      <button
                        className="btn btn-primary"
                        style={{ padding: '0.4rem 0.8rem' }}
                        onClick={() => handleInitiateExit(row)}
                      >
                        Exit & Pay
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {paymentModal.show && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2 style={{marginTop: 0}}>Complete Payment</h2>
            <p className="card-subtitle">Please enter payment details to finalize your parking exit.</p>
            
            <div style={{ margin: '1.5rem 0', padding: '1rem', background: 'rgba(30,95,78,0.06)', borderRadius: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span>Vehicle:</span>
                <strong>{paymentModal.booking?.vehicleNumber}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span>Slot:</span>
                <strong>{paymentModal.booking?.slot?.slotNumber}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', color: 'var(--primary-dark)', marginTop: '1rem', borderTop: '1px solid #ccc', paddingTop: '1rem' }}>
                <strong>Total Amount:</strong>
                <strong>Rs. {paymentModal.amount}</strong>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Card Details (Simulated)</label>
              <div className="fake-card-input">
                <input type="text" className="form-control" placeholder="•••• •••• •••• ••••" defaultValue="4242 4242 4242 4242" />
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <input type="text" className="form-control" placeholder="MM/YY" defaultValue="12/26" />
                <input type="password" className="form-control" placeholder="CVV" defaultValue="123" />
              </div>
            </div>

            <div className="modal-actions">
              <button 
                className="btn btn-secondary full-width" 
                onClick={() => setPaymentModal({ show: false, booking: null, amount: 0 })}
                disabled={isProcessing}
              >
                Cancel
              </button>
              <button 
                className="btn btn-success full-width" 
                onClick={processPaymentAndExit}
                disabled={isProcessing}
              >
                {isProcessing ? 'Processing...' : `Pay Rs. ${paymentModal.amount}`}
              </button>
            </div>
          </div>
        </div>
      )}

      {receiptModal.show && receiptModal.data && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ padding: '0', background: 'transparent', boxShadow: 'none' }}>
            <div className="receipt-card">
              <div className="receipt-header">
                <h3>Parking Receipt</h3>
                <p style={{ margin: '5px 0 0', fontSize: '0.9rem', color: '#666' }}>
                  Transaction #{Math.floor(Math.random() * 10000000)}
                </p>
              </div>
              
              <div className="receipt-row">
                <span>Vehicle No:</span>
                <span>{receiptModal.data.vehicleNumber}</span>
              </div>
              <div className="receipt-row">
                <span>Parking Slot:</span>
                <span>{receiptModal.data.slot?.slotNumber} ({receiptModal.data.slot?.type})</span>
              </div>
              <div className="receipt-row">
                <span>Entry Time:</span>
                <span>{new Date(receiptModal.data.entryTime).toLocaleString()}</span>
              </div>
              <div className="receipt-row">
                <span>Exit Time:</span>
                <span>{new Date(receiptModal.data.exitTime).toLocaleString()}</span>
              </div>
              
              <div className="receipt-total">
                <span>PAID:</span>
                <span>Rs. {receiptModal.data.amount}</span>
              </div>

              <div className="modal-actions" style={{ marginTop: '2.5rem' }}>
                <button 
                  className="btn btn-primary full-width print-btn" 
                  onClick={() => window.print()}
                >
                  Print / Download PDF
                </button>
                <button 
                  className="btn btn-secondary full-width" 
                  onClick={() => {
                    setReceiptModal({ show: false, data: null });
                    setExitData(null);
                  }}
                  style={{ borderColor: '#ccc', color: '#333' }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingHistory;
