import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../utils/api';
import { colors, typography, spacing, borderRadius, shadows, components } from '../styles/designSystem';

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
        return { ...styles.badge, backgroundColor: colors.roleAdmin, color: colors.roleAdminText };
      case 'viewer':
        return { ...styles.badge, backgroundColor: colors.roleViewer, color: colors.roleViewerText };
      case 'pending':
        return { ...styles.badge, backgroundColor: colors.rolePending, color: colors.rolePendingText };
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
    backgroundColor: colors.background,
    color: colors.darkText,
    fontFamily: typography.fontFamily,
  },
  loading: {
    textAlign: 'center',
    padding: '50px',
    fontSize: typography.body,
    color: colors.secondaryText,
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.containerPadding,
    borderBottom: `2px solid ${colors.borderDark}`,
    backgroundColor: colors.background,
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
  },
  headerRight: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing.headerGap,
  },
  backButton: {
    padding: '8px 16px',
    backgroundColor: 'transparent',
    color: colors.primaryAccent,
    border: `1px solid ${colors.primaryAccent}`,
    borderRadius: borderRadius.button,
    fontSize: typography.body,
    fontWeight: typography.weightMedium,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
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
    border: `1px solid ${colors.border}`,
  },
  userName: {
    fontSize: typography.metadata,
    color: colors.secondaryText,
  },
  logoutButton: {
    ...components.buttonSecondary,
  },
  content: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: spacing.containerPadding,
  },
  pageTitle: {
    fontSize: '28px',
    color: colors.darkText,
    marginBottom: spacing.sectionGap,
    textAlign: 'center',
    fontWeight: typography.weightMedium,
  },
  error: {
    padding: spacing.cardPadding,
    backgroundColor: colors.errorBg,
    color: colors.error,
    borderRadius: borderRadius.card,
    marginBottom: spacing.sectionGap,
    textAlign: 'center',
    border: `1px solid ${colors.errorBorder}`,
  },
  tableContainer: {
    ...components.card,
    overflow: 'hidden',
    marginBottom: spacing.sectionGap,
    padding: 0,
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  tableHeaderRow: {
    backgroundColor: colors.background,
    borderBottom: `2px solid ${colors.borderDark}`,
  },
  tableHeader: {
    padding: '15px',
    textAlign: 'left',
    fontSize: typography.metadata,
    fontWeight: typography.weightSemibold,
    color: colors.darkText,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  tableRow: {
    borderBottom: `1px solid ${colors.border}`,
  },
  tableCell: {
    padding: '15px',
    fontSize: typography.metadata,
    color: colors.darkText,
  },
  tableAvatar: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    border: `1px solid ${colors.border}`,
  },
  noAvatar: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    backgroundColor: colors.primaryAccent,
    color: colors.darkText,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
    fontSize: '18px',
  },
  provider: {
    fontSize: typography.metadata,
  },
  badge: {
    display: 'inline-block',
    padding: '6px 12px',
    borderRadius: borderRadius.badge,
    fontSize: typography.small,
    fontWeight: typography.weightSemibold,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  roleSelect: {
    ...components.input,
    padding: '8px 12px',
    fontSize: typography.metadata,
    cursor: 'pointer',
  },
  emptyState: {
    textAlign: 'center',
    padding: '50px',
    color: colors.secondaryText,
    fontSize: typography.body,
  },
  stats: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '20px',
  },
  statCard: {
    ...components.card,
    padding: '25px',
    textAlign: 'center',
  },
  statValue: {
    fontSize: '36px',
    fontWeight: typography.weightSemibold,
    color: colors.primaryAccent,
    marginBottom: '10px',
  },
  statLabel: {
    fontSize: typography.metadata,
    color: colors.secondaryText,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
};

export default AdminPage;
