import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../utils/api';
import { colors, typography, spacing, borderRadius, shadows, components } from '../styles/designSystem';

const SongPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [song, setSong] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedKey, setSelectedKey] = useState('');
  const [transposedChords, setTransposedChords] = useState('');
  const [transposing, setTransposing] = useState(false);

  const KEYS = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B',
                'Db', 'Eb', 'Gb', 'Ab', 'Bb'];

  useEffect(() => {
    fetchSong();
  }, [id]);

  const fetchSong = async () => {
    try {
      const response = await api.get(`/songs/${id}`);
      setSong(response.data);
      setSelectedKey(response.data.original_key);
      setTransposedChords(response.data.chords);
      setLoading(false);
    } catch (err) {
      setError('Failed to load song');
      setLoading(false);
    }
  };

  const handleTranspose = async (newKey) => {
    if (!song) return;

    setSelectedKey(newKey);
    setTransposing(true);

    if (newKey === song.original_key) {
      setTransposedChords(song.chords);
      setTransposing(false);
      return;
    }

    try {
      const response = await api.post('/transpose', {
        chords: song.chords,
        from_key: song.original_key,
        to_key: newKey
      });
      setTransposedChords(response.data.transposed);
    } catch (err) {
      alert('Transpose failed: ' + (err.response?.data?.detail || 'Unknown error'));
      setSelectedKey(song.original_key);
      setTransposedChords(song.chords);
    } finally {
      setTransposing(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = async () => {
    try {
      const response = await api.post(`/songs/${id}/pdf`, {
        target_key: selectedKey
      }, {
        responseType: 'blob'
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${song.title} - ${selectedKey}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert('PDF download failed: ' + (err.response?.data?.detail || 'Unknown error'));
    }
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loading}>Loading song...</div>
      </div>
    );
  }

  if (error || !song) {
    return (
      <div style={styles.container}>
        <div style={styles.error}>{error || 'Song not found'}</div>
        <button onClick={() => navigate('/')} style={styles.backButton}>
          Back to Library
        </button>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Header - hidden on print */}
      <header style={styles.header} className="no-print">
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

      {/* Main Content */}
      <div style={styles.content}>
        {/* Song Title */}
        <h1 style={styles.songTitle}>{song.title}</h1>
        <div style={styles.metadata}>
          <span style={styles.metadataItem}>{song.language}</span>
          <span style={styles.metadataItem}>{song.category}</span>
          <span style={styles.metadataItem}>Original Key: {song.original_key}</span>
        </div>

        {/* Key Selector - hidden on print */}
        <div style={styles.keySelector} className="no-print">
          <label style={styles.keySelectorLabel}>Transpose to:</label>
          <div style={styles.keyButtons}>
            {KEYS.map(key => (
              <button
                key={key}
                onClick={() => handleTranspose(key)}
                disabled={transposing}
                style={{
                  ...styles.keyButton,
                  ...(selectedKey === key ? styles.keyButtonActive : {})
                }}
              >
                {key}
              </button>
            ))}
          </div>
          {transposing && <div style={styles.transposingMessage}>Transposing...</div>}
        </div>

        {/* Action Buttons - hidden on print */}
        <div style={styles.actions} className="no-print">
          <button onClick={handlePrint} style={styles.printButton}>
            🖨️ Print
          </button>
          <button onClick={handleDownloadPDF} style={styles.pdfButton}>
            📄 Download PDF
          </button>
        </div>

        {/* Chords Display */}
        <div style={styles.chordsContainer}>
          <pre style={styles.chordsText}>{transposedChords}</pre>
        </div>
      </div>

      {/* Print-only header */}
      <div className="print-only" style={styles.printHeader}>
        <h1 style={styles.printTitle}>{song.title}</h1>
        <div style={styles.printMetadata}>
          Key: {selectedKey} | {song.language} | {song.category}
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
  error: {
    textAlign: 'center',
    padding: '50px',
    fontSize: typography.body,
    color: colors.error,
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
  songTitle: {
    fontSize: '28px',
    color: colors.darkText,
    marginBottom: '10px',
    textAlign: 'center',
    fontWeight: typography.medium,
    fontFamily: typography.fontFamily,
  },
  metadata: {
    display: 'flex',
    justifyContent: 'center',
    gap: '20px',
    marginBottom: spacing.sectionGap,
    fontSize: typography.metadata,
    color: colors.secondaryText,
  },
  metadataItem: {
    padding: '6px 12px',
    backgroundColor: colors.cardBg,
    border: `1px solid ${colors.border}`,
    borderRadius: borderRadius.badge,
  },
  keySelector: {
    marginBottom: spacing.sectionGap,
    padding: '20px',
    backgroundColor: colors.cardBg,
    border: `1px solid ${colors.border}`,
    borderRadius: borderRadius.card,
    boxShadow: shadows.card,
  },
  keySelectorLabel: {
    display: 'block',
    fontSize: typography.body,
    color: colors.darkText,
    marginBottom: '15px',
    fontWeight: typography.medium,
  },
  keyButtons: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '10px',
  },
  keyButton: {
    padding: '10px 16px',
    backgroundColor: colors.cardBg,
    color: colors.darkText,
    border: `1px solid ${colors.borderDark}`,
    borderRadius: borderRadius.button,
    fontSize: typography.body,
    fontWeight: typography.medium,
    cursor: 'pointer',
    minWidth: '50px',
    transition: 'all 0.2s ease',
  },
  keyButtonActive: {
    backgroundColor: colors.primaryAccent,
    color: colors.darkText,
    borderColor: colors.primaryAccent,
    boxShadow: shadows.button,
  },
  transposingMessage: {
    marginTop: '15px',
    color: colors.primaryAccent,
    fontSize: typography.metadata,
  },
  actions: {
    display: 'flex',
    gap: '15px',
    marginBottom: spacing.sectionGap,
    justifyContent: 'center',
  },
  printButton: {
    ...components.buttonSecondary,
    padding: spacing.buttonPaddingMedium,
    fontSize: typography.body,
  },
  pdfButton: {
    ...components.buttonPrimary,
    padding: spacing.buttonPaddingMedium,
    fontSize: typography.body,
  },
  chordsContainer: {
    backgroundColor: colors.cardBg,
    border: `1px solid ${colors.border}`,
    padding: '30px',
    borderRadius: borderRadius.card,
    marginBottom: spacing.sectionGap,
    boxShadow: shadows.card,
  },
  chordsText: {
    fontSize: '15px',
    lineHeight: '1.8',
    color: colors.darkText,
    fontFamily: typography.fontFamilyMono,
    whiteSpace: 'pre-wrap',
    margin: 0,
  },
  printHeader: {
    textAlign: 'center',
    marginBottom: '30px',
  },
  printTitle: {
    fontSize: '32px',
    marginBottom: '10px',
    fontFamily: typography.fontFamily,
    color: colors.darkText,
  },
  printMetadata: {
    fontSize: typography.metadata,
    color: colors.secondaryText,
  },
};

export default SongPage;
