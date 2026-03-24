import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { colors, typography } from './styles/designSystem';

// Pages
import LoginPage from './pages/LoginPage';
import LibraryPage from './pages/LibraryPage';
import SongPage from './pages/SongPage';
import UploadPage from './pages/UploadPage';
import EditSongPage from './pages/EditSongPage';
import AdminPage from './pages/AdminPage';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user, loading, isPending } = useAuth();

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loadingSpinner}>Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (isPending()) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// Admin Route Component
const AdminRoute = ({ children }) => {
  const { user, loading, isAdmin } = useAuth();

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loadingSpinner}>Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin()) {
    return <Navigate to="/" replace />;
  }

  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage />} />

          {/* Protected Routes (require viewer or admin) */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <LibraryPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/songs/:id"
            element={
              <ProtectedRoute>
                <SongPage />
              </ProtectedRoute>
            }
          />

          {/* Admin-Only Routes */}
          <Route
            path="/upload"
            element={
              <AdminRoute>
                <UploadPage />
              </AdminRoute>
            }
          />

          <Route
            path="/songs/:id/edit"
            element={
              <AdminRoute>
                <EditSongPage />
              </AdminRoute>
            }
          />

          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminPage />
              </AdminRoute>
            }
          />

          {/* Fallback: redirect to login or home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

const styles = {
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: colors.background,
  },
  loadingSpinner: {
    fontSize: '24px',
    color: colors.primaryAccent,
    fontFamily: typography.fontFamily,
  },
};

export default App;
