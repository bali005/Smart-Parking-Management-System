import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import BookingPage from './pages/BookingPage';
import BookingHistory from './pages/BookingHistory';
import AdminSlots from './pages/AdminSlots';
import { getUser, logout } from './utils';
import './App.css';

const ProtectedRoute = ({ children, requiredRole }) => {
  const user = getUser();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user.role !== `ROLE_${requiredRole}`) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <>
      <Navbar user={user} />
      <main className="container">{children}</main>
    </>
  );
};

const Navbar = ({ user }) => (
  <nav className="navbar">
    <div className="navbar-brand">ParkEase PMS</div>
    <div className="nav-links">
      <Link to="/dashboard" className="nav-link">Dashboard</Link>
      <Link to="/booking" className="nav-link">Book Slot</Link>
      <Link to="/history" className="nav-link">
        {user.role === 'ROLE_ADMIN' ? 'All Bookings' : 'Booking History'}
      </Link>
      {user.role === 'ROLE_ADMIN' && (
        <Link to="/admin/slots" className="nav-link">Manage Slots</Link>
      )}
      <span className="nav-user">{user.name || user.email}</span>
      <button onClick={logout} className="btn btn-danger">Logout</button>
    </div>
  </nav>
);

function App() {
  const user = getUser();

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to={user ? '/dashboard' : '/login'} replace />} />
        <Route path="/login" element={user ? <Navigate to="/dashboard" replace /> : <Login />} />
        <Route path="/register" element={user ? <Navigate to="/dashboard" replace /> : <Register />} />
        <Route
          path="/dashboard"
          element={(
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          )}
        />
        <Route
          path="/booking"
          element={(
            <ProtectedRoute>
              <BookingPage />
            </ProtectedRoute>
          )}
        />
        <Route
          path="/history"
          element={(
            <ProtectedRoute>
              <BookingHistory />
            </ProtectedRoute>
          )}
        />
        <Route
          path="/admin/slots"
          element={(
            <ProtectedRoute requiredRole="ADMIN">
              <AdminSlots />
            </ProtectedRoute>
          )}
        />
        <Route path="*" element={<Navigate to={user ? '/dashboard' : '/login'} replace />} />
      </Routes>
    </Router>
  );
}

export default App;
