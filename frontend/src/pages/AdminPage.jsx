import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../utils/api';

const AdminPage = () => {
  const navigate = useNavigate();
  const { user, logout, isAdmin } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Redirect non-admins
    if (!isAdmin()) {
      navigate('/');
      return;
    }
    fetchUsers();
  }, [isAdmin, navigate]);

  const fetchUsers = async () => {
    try {
      const response = await api.get('/users');
      setUsers(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load users');
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await api.put(`/users/${userId}/role`, { role: newRole });

      // Update local state
      setUsers(users.map(u =>
        u.id === userId ? { ...u, role: newRole } : u
      ));

      alert('User role updated successfully');
    } catch (err) {
      alert('Failed to update role: ' + (err.response?.data?.detail || 'Unknown error'));
      // Revert on error
      fetchUsers();
    }
  };

  const getRoleBadgeStyle = (role) => {
    switch (role) {
      case 'admin':
        return { ...styles.badge, backgroundColor: '#f0c040', color: '#0a0e1a' };
      case 'viewer':
        return { ...styles.badge, backgroundColor: '#4caf50', color: '#fff' };
      case 'pending':
        return { ...styles.badge, backgroundColor: '#ff9800', color: '#fff' };
      default:
        return styles.badge;
    }
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loading}>Loading users...</div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.headerLeft}>
          <button onClick={() => navigate('/')} style={styles.backButton}>
            ← Back to Library
          </button>
        </div>
        <div style={styles.headerRight}>
          {user && (
            <div style={styles.userInfo}>
              {user.avatar_url && (
                <img src={user.avatar_url} alt={user.name} style={styles.avatar} />
              )}
              <span style={styles.userName}>{user.name}</span>
            </div>
          )}
          <button onClick={logout} style={styles.logoutButton}>
            Logout
          </button>
        </div>
      </header>

      <div style={styles.content}>
        <h1 style={styles.pageTitle}>User Management</h1>

        {error && <div style={styles.error}>{error}</div>}

        <div style={styles.tableContainer}>
          <table style={styles.table}>
            <thead>
              <tr style={styles.tableHeaderRow}>
                <th style={styles.tableHeader}>Avatar</th>
                <th style={styles.tableHeader}>Name</th>
                <th style={styles.tableHeader}>Email</th>
                <th style={styles.tableHeader}>Provider</th>
                <th style={styles.tableHeader}>Role</th>
                <th style={styles.tableHeader}>Created</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id} style={styles.tableRow}>
                  <td style={styles.tableCell}>
                    {u.avatar_url ? (
                      <img src={u.avatar_url} alt={u.name} style={styles.tableAvatar} />
                    ) : (
                      <div style={styles.noAvatar}>
                        {u.name ? u.name.charAt(0).toUpperCase() : '?'}
                      </div>
                    )}
                  </td>
                  <td style={styles.tableCell}>{u.name}</td>
                  <td style={styles.tableCell}>{u.email}</td>
                  <td style={styles.tableCell}>
                    <span style={styles.provider}>
                      {u.oauth_provider === 'google' ? '🟢 Google' : '🔵 Facebook'}
                    </span>
                  </td>
                  <td style={styles.tableCell}>
                    {u.id === user.id ? (
                      <span style={getRoleBadgeStyle(u.role)}>
                        {u.role} (You)
                      </span>
                    ) : (
                      <select
                        value={u.role}
                        onChange={(e) => handleRoleChange(u.id, e.target.value)}
                        style={styles.roleSelect}
                      >
                        <option value="pending">Pending</option>
                        <option value="viewer">Viewer</option>
                        <option value="admin">Admin</option>
                      </select>
                    )}
                  </td>
                  <td style={styles.tableCell}>
                    {new Date(u.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {users.length === 0 && (
            <div style={styles.emptyState}>No users found</div>
          )}
        </div>

        {/* Stats */}
        <div style={styles.stats}>
          <div style={styles.statCard}>
            <div style={styles.statValue}>{users.length}</div>
            <div style={styles.statLabel}>Total Users</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statValue}>
              {users.filter(u => u.role === 'pending').length}
            </div>
            <div style={styles.statLabel}>Pending Approval</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statValue}>
              {users.filter(u => u.role === 'viewer').length}
            </div>
            <div style={styles.statLabel}>Viewers</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statValue}>
              {users.filter(u => u.role === 'admin').length}
            </div>
            <div style={styles.statLabel}>Admins</div>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#0a0e1a',
    color: '#ffffff',
    padding: '20px',
  },
  loading: {
    textAlign: 'center',
    padding: '50px',
    fontSize: '18px',
    color: '#aaa',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '30px',
    paddingBottom: '20px',
    borderBottom: '1px solid #333',
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
  },
  headerRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
  },
  backButton: {
    padding: '10px 20px',
    backgroundColor: '#333',
    color: '#f0c040',
    border: '1px solid #f0c040',
    borderRadius: '4px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  userInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  avatar: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
  },
  userName: {
    fontSize: '14px',
    color: '#aaa',
  },
  logoutButton: {
    padding: '10px 20px',
    backgroundColor: '#444',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    fontSize: '14px',
    cursor: 'pointer',
  },
  content: {
    maxWidth: '1400px',
    margin: '0 auto',
  },
  pageTitle: {
    fontSize: '32px',
    color: '#f0c040',
    marginBottom: '30px',
    textAlign: 'center',
    fontFamily: 'Georgia, serif',
  },
  error: {
    padding: '15px',
    backgroundColor: '#ff4444',
    color: 'white',
    borderRadius: '4px',
    marginBottom: '20px',
    textAlign: 'center',
  },
  tableContainer: {
    backgroundColor: '#1a1f2e',
    borderRadius: '12px',
    overflow: 'hidden',
    marginBottom: '30px',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  tableHeaderRow: {
    backgroundColor: '#0a0e1a',
    borderBottom: '2px solid #333',
  },
  tableHeader: {
    padding: '15px',
    textAlign: 'left',
    fontSize: '14px',
    fontWeight: '600',
    color: '#f0c040',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  tableRow: {
    borderBottom: '1px solid #333',
  },
  tableCell: {
    padding: '15px',
    fontSize: '14px',
    color: '#fff',
  },
  tableAvatar: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
  },
  noAvatar: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    backgroundColor: '#f0c040',
    color: '#0a0e1a',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
    fontSize: '18px',
  },
  provider: {
    fontSize: '14px',
  },
  badge: {
    display: 'inline-block',
    padding: '4px 12px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  roleSelect: {
    padding: '8px 12px',
    backgroundColor: '#0a0e1a',
    color: '#fff',
    border: '1px solid #444',
    borderRadius: '4px',
    fontSize: '14px',
    cursor: 'pointer',
    fontFamily: 'Georgia, serif',
  },
  emptyState: {
    textAlign: 'center',
    padding: '50px',
    color: '#aaa',
    fontSize: '16px',
  },
  stats: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '20px',
  },
  statCard: {
    backgroundColor: '#1a1f2e',
    padding: '25px',
    borderRadius: '12px',
    textAlign: 'center',
  },
  statValue: {
    fontSize: '36px',
    fontWeight: 'bold',
    color: '#f0c040',
    marginBottom: '10px',
  },
  statLabel: {
    fontSize: '14px',
    color: '#aaa',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
};

export default AdminPage;
