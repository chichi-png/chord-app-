import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../utils/api';

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
    maxWidth: '900px',
    margin: '0 auto',
  },
  pageTitle: {
    fontSize: '32px',
    color: '#f0c040',
    marginBottom: '30px',
    textAlign: 'center',
    fontFamily: 'Georgia, serif',
  },
  formContainer: {
    display: 'flex',
    justifyContent: 'center',
  },
  card: {
    backgroundColor: '#1a1f2e',
    padding: '30px',
    borderRadius: '12px',
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
    fontSize: '14px',
    color: '#f0c040',
    marginBottom: '8px',
    fontWeight: '600',
  },
  input: {
    width: '100%',
    padding: '12px',
    backgroundColor: '#0a0e1a',
    color: '#fff',
    border: '1px solid #444',
    borderRadius: '4px',
    fontSize: '16px',
    fontFamily: 'Georgia, serif',
    boxSizing: 'border-box',
  },
  select: {
    width: '100%',
    padding: '12px',
    backgroundColor: '#0a0e1a',
    color: '#fff',
    border: '1px solid #444',
    borderRadius: '4px',
    fontSize: '16px',
    fontFamily: 'Georgia, serif',
    boxSizing: 'border-box',
  },
  textarea: {
    width: '100%',
    padding: '12px',
    backgroundColor: '#0a0e1a',
    color: '#fff',
    border: '1px solid #444',
    borderRadius: '4px',
    fontSize: '16px',
    fontFamily: 'Georgia, serif',
    boxSizing: 'border-box',
    resize: 'vertical',
  },
  buttonGroup: {
    display: 'flex',
    gap: '15px',
    justifyContent: 'flex-end',
  },
  cancelButton: {
    padding: '14px 30px',
    backgroundColor: '#444',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  submitButton: {
    padding: '14px 30px',
    backgroundColor: '#f0c040',
    color: '#0a0e1a',
    border: 'none',
    borderRadius: '4px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  submitButtonDisabled: {
    backgroundColor: '#555',
    color: '#888',
    cursor: 'not-allowed',
  },
};

export default EditSongPage;
