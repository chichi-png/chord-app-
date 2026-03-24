import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../utils/api';
import { colors, typography, spacing, borderRadius, shadows, components } from '../styles/designSystem';

const EditSongPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, logout, isAdmin } = useAuth();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Form fields
  const [title, setTitle] = useState('');
  const [originalKey, setOriginalKey] = useState('C');
  const [language, setLanguage] = useState('Tagalog');
  const [category, setCategory] = useState('Praise');
  const [chords, setChords] = useState('');

  const KEYS = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B',
                'Db', 'Eb', 'Gb', 'Ab', 'Bb'];

  useEffect(() => {
    // Redirect non-admins
    if (!isAdmin()) {
      navigate('/');
      return;
    }
    fetchSong();
  }, [id, isAdmin, navigate]);

  const fetchSong = async () => {
    try {
      const response = await api.get(`/songs/${id}`);
      const song = response.data;

      setTitle(song.title);
      setOriginalKey(song.original_key);
      setLanguage(song.language);
      setCategory(song.category);
      setChords(song.chords);
      setLoading(false);
    } catch (err) {
      alert('Failed to load song: ' + (err.response?.data?.detail || 'Unknown error'));
      navigate('/');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      alert('Please enter a song title');
      return;
    }

    if (!chords.trim()) {
      alert('Please enter chords');
      return;
    }

    setSubmitting(true);

    try {
      await api.put(`/songs/${id}`, {
        title: title.trim(),
        original_key: originalKey,
        language,
        category,
        chords: chords.trim(),
      });

      alert('Song updated successfully!');
      navigate(`/songs/${id}`);
    } catch (err) {
      alert('Failed to update song: ' + (err.response?.data?.detail || 'Unknown error'));
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (window.confirm('Discard changes?')) {
      navigate(`/songs/${id}`);
    }
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loading}>Loading song...</div>
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
        <h1 style={styles.pageTitle}>Edit Song</h1>

        <div style={styles.formContainer}>
          <form onSubmit={handleSubmit} style={styles.card}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Song Title *</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter song title"
                required
                style={styles.input}
              />
            </div>

            <div style={styles.formRow}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Original Key *</label>
                <select
                  value={originalKey}
                  onChange={(e) => setOriginalKey(e.target.value)}
                  required
                  style={styles.select}
                >
                  {KEYS.map(key => (
                    <option key={key} value={key}>{key}</option>
                  ))}
                </select>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Language *</label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  required
                  style={styles.select}
                >
                  <option value="Tagalog">🇵🇭 Tagalog</option>
                  <option value="English">🌐 English</option>
                </select>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Category *</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                  style={styles.select}
                >
                  <option value="Praise">Praise</option>
                  <option value="Worship">Worship</option>
                </select>
              </div>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Chords *</label>
              <textarea
                value={chords}
                onChange={(e) => setChords(e.target.value)}
                placeholder="Enter chords"
                required
                rows={20}
                style={styles.textarea}
              />
            </div>

            <div style={styles.buttonGroup}>
              <button
                type="button"
                onClick={handleCancel}
                style={styles.cancelButton}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                style={{
                  ...styles.submitButton,
                  ...(submitting ? styles.submitButtonDisabled : {})
                }}
              >
                {submitting ? 'Saving...' : '✓ Save Changes'}
              </button>
            </div>
          </form>
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
    fontWeight: typography.medium,
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
    maxWidth: '900px',
    margin: '0 auto',
    padding: spacing.containerPadding,
  },
  pageTitle: {
    fontSize: '28px',
    color: colors.darkText,
    marginBottom: spacing.sectionGap,
    textAlign: 'center',
    fontWeight: typography.medium,
  },
  formContainer: {
    display: 'flex',
    justifyContent: 'center',
  },
  card: {
    ...components.card,
    padding: '30px',
    width: '100%',
  },
  formGroup: {
    marginBottom: '20px',
  },
  formRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '15px',
    marginBottom: '20px',
  },
  label: {
    display: 'block',
    fontSize: typography.metadata,
    color: colors.darkText,
    marginBottom: '8px',
    fontWeight: typography.medium,
  },
  input: {
    ...components.input,
    width: '100%',
    boxSizing: 'border-box',
    fontFamily: typography.fontFamily,
  },
  select: {
    ...components.input,
    width: '100%',
    boxSizing: 'border-box',
    fontFamily: typography.fontFamily,
  },
  textarea: {
    ...components.input,
    width: '100%',
    boxSizing: 'border-box',
    fontFamily: typography.fontFamilyMono,
    resize: 'vertical',
  },
  buttonGroup: {
    display: 'flex',
    gap: '15px',
    justifyContent: 'flex-end',
  },
  cancelButton: {
    ...components.buttonSecondary,
    padding: '14px 30px',
  },
  submitButton: {
    ...components.buttonPrimary,
    padding: '14px 30px',
  },
  submitButtonDisabled: {
    backgroundColor: colors.secondaryText,
    color: colors.background,
    cursor: 'not-allowed',
    opacity: 0.5,
  },
};

export default EditSongPage;
