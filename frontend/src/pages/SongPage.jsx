import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../utils/api';

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
        original_key: song.original_key,
        target_key: newKey
      });
      setTransposedChords(response.data.transposed_chords);
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
  error: {
    textAlign: 'center',
    padding: '50px',
    fontSize: '18px',
    color: '#ff4444',
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
  songTitle: {
    fontSize: '36px',
    color: '#f0c040',
    marginBottom: '10px',
    textAlign: 'center',
    fontFamily: 'Georgia, serif',
  },
  metadata: {
    display: 'flex',
    justifyContent: 'center',
    gap: '20px',
    marginBottom: '30px',
    fontSize: '14px',
    color: '#aaa',
  },
  metadataItem: {
    padding: '5px 10px',
    backgroundColor: '#1a1f2e',
    borderRadius: '4px',
  },
  keySelector: {
    marginBottom: '30px',
    padding: '20px',
    backgroundColor: '#1a1f2e',
    borderRadius: '8px',
  },
  keySelectorLabel: {
    display: 'block',
    fontSize: '16px',
    color: '#f0c040',
    marginBottom: '15px',
    fontWeight: '600',
  },
  keyButtons: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '10px',
  },
  keyButton: {
    padding: '10px 16px',
    backgroundColor: '#2a2f3e',
    color: '#fff',
    border: '1px solid #444',
    borderRadius: '4px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    minWidth: '50px',
    transition: 'all 0.2s',
  },
  keyButtonActive: {
    backgroundColor: '#f0c040',
    color: '#0a0e1a',
    borderColor: '#f0c040',
  },
  transposingMessage: {
    marginTop: '15px',
    color: '#f0c040',
    fontSize: '14px',
  },
  actions: {
    display: 'flex',
    gap: '15px',
    marginBottom: '30px',
    justifyContent: 'center',
  },
  printButton: {
    padding: '12px 24px',
    backgroundColor: '#333',
    color: '#f0c040',
    border: '1px solid #f0c040',
    borderRadius: '4px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  pdfButton: {
    padding: '12px 24px',
    backgroundColor: '#f0c040',
    color: '#0a0e1a',
    border: 'none',
    borderRadius: '4px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  chordsContainer: {
    backgroundColor: '#1a1f2e',
    padding: '30px',
    borderRadius: '8px',
    marginBottom: '30px',
  },
  chordsText: {
    fontSize: '16px',
    lineHeight: '1.8',
    color: '#fff',
    fontFamily: 'Georgia, serif',
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
    fontFamily: 'Georgia, serif',
  },
  printMetadata: {
    fontSize: '14px',
    color: '#666',
  },
};

export default SongPage;
