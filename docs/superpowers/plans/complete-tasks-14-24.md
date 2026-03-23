# Chord Manager - Remaining Tasks (14-24)

## Continuation of 2026-03-23-chord-manager.md

### Task 14: Song View Page

**Files:**
- Create: `/c/Users/Sarah/Downloads/chord-app/frontend/src/pages/SongPage.jsx`

- [ ] **Step 1: Create SongPage.jsx with key selector and transposition**

```javascript
cd /c/Users/Sarah/Downloads/chord-app/frontend
cat > src/pages/SongPage.jsx << 'ENDFILE'
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../utils/api';

const ALL_KEYS = ['C', 'C#', 'Db', 'D', 'D#', 'Eb', 'E', 'F', 'F#', 'Gb', 'G', 'G#', 'Ab', 'A', 'A#', 'Bb', 'B'];

const SongPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();

  const [song, setSong] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [selectedKey, setSelectedKey] = useState(null);
  const [displayedChords, setDisplayedChords] = useState('');
  const [transposing, setTransposing] = useState(false);

  useEffect(() => {
    fetchSong();
  }, [id]);

  const fetchSong = async () => {
    try {
      const response = await api.get(`/songs/${id}`);
      setSong(response.data);
      setSelectedKey(response.data.original_key);
      setDisplayedChords(response.data.chords);
      setLoading(false);
    } catch (err) {
      setError('Failed to load song');
      setLoading(false);
    }
  };

  const handleKeyChange = async (newKey) => {
    if (!song) return;

    setSelectedKey(newKey);

    if (newKey === song.original_key) {
      // Reset to original
      setDisplayedChords(song.chords);
      return;
    }

    // Transpose
    setTransposing(true);
    try {
      const response = await api.post('/transpose', {
        chords: song.chords,
        from_key: song.original_key,
        to_key: newKey
      });
      setDisplayedChords(response.data.transposed);
    } catch (err) {
      alert('Transposition failed: ' + (err.response?.data?.detail || 'Unknown error'));
      setSelectedKey(song.original_key);
      setDisplayedChords(song.chords);
    } finally {
      setTransposing(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = async () => {
    try {
      const url = selectedKey === song.original_key
        ? `/songs/${id}/pdf`
        : `/songs/${id}/pdf?transposed_key=${selectedKey}`;

      const response = await api.get(url, {
        responseType: 'blob'
      });

      const blob = new Blob([response.data], { type: 'application/pdf' });
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `${song.title}-${selectedKey}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(downloadUrl);
    } catch (err) {
      alert('PDF download failed: ' + (err.response?.data?.detail || 'Unknown error'));
    }
  };

  if (loading) {
    return <div style={styles.container}><div style={styles.loading}>Loading song...</div></div>;
  }

  if (error || !song) {
    return (
      <div style={styles.container}>
        <div style={styles.error}>{error || 'Song not found'}</div>
        <button onClick={() => navigate('/')} style={styles.backButton}>← Back to Library</button>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Header - hidden when printing */}
      <div className="no-print" style={styles.header}>
        <button onClick={() => navigate('/')} style={styles.backButton}>← Back</button>
        <div style={styles.actions}>
          <button onClick={handlePrint} style={styles.printButton}>🖨 Print</button>
          <button onClick={handleDownloadPDF} style={styles.pdfButton}>⬇ PDF</button>
          {isAdmin() && (
            <button onClick={() => navigate(`/songs/${id}/edit`)} style={styles.editButton}>Edit Song</button>
          )}
        </div>
      </div>

      {/* Song Info */}
      <div style={styles.songInfo}>
        <h1 style={styles.title}>{song.title}</h1>
        <div style={styles.badges}>
          <span style={styles.badge}>{song.language === 'Tagalog' ? '🇵🇭' : '🌐'} {song.language}</span>
          <span style={styles.badge}>{song.category}</span>
        </div>
      </div>

      {/* Key Selector - hidden when printing */}
      <div className="no-print" style={styles.keySelector}>
        <div style={styles.keySelectorHeader}>
          <span style={styles.originalKeyLabel}>Original Key: {song.original_key}</span>
          {transposing && <span style={styles.transposingLabel}>Transposing...</span>}
        </div>
        <div style={styles.keyGrid}>
          {ALL_KEYS.map(key => (
            <button
              key={key}
              onClick={() => handleKeyChange(key)}
              style={{
                ...styles.keyButton,
                ...(key === selectedKey ? styles.keyButtonActive : {}),
              }}
              disabled={transposing}
            >
              {key}
              {key === song.original_key && <span style={styles.originalDot}>●</span>}
            </button>
          ))}
        </div>
      </div>

      {/* Current key display for print */}
      <div className="print-only" style={styles.printKeyInfo}>
        Key: {selectedKey}{selectedKey !== song.original_key && ` (transposed from ${song.original_key})`}
      </div>

      {/* Chords Display */}
      <div style={styles.chordsContainer}>
        <pre style={styles.chords}>{displayedChords}</pre>
      </div>

      {/* Uploader info - hidden when printing */}
      {song.uploaded_by && (
        <div className="no-print" style={styles.footer}>
          <p style={styles.uploaderInfo}>
            Uploaded by {song.uploaded_by.name} on {new Date(song.created_at).toLocaleDateString()}
          </p>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#0a0e1a',
    color: '#ffffff',
    padding: '20px',
    maxWidth: '900px',
    margin: '0 auto',
  },
  loading: {
    textAlign: 'center',
    padding: '50px',
    color: '#aaa',
  },
  error: {
    padding: '20px',
    backgroundColor: '#ff4444',
    color: '#fff',
    borderRadius: '4px',
    marginBottom: '20px',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '30px',
  },
  backButton: {
    padding: '10px 20px',
    backgroundColor: '#444',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
  },
  actions: {
    display: 'flex',
    gap: '10px',
  },
  printButton: {
    padding: '10px 20px',
    backgroundColor: '#f0c040',
    color: '#0a0e1a',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
  },
  pdfButton: {
    padding: '10px 20px',
    backgroundColor: '#f0c040',
    color: '#0a0e1a',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
  },
  editButton: {
    padding: 
