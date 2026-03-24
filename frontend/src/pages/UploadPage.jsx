import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../utils/api';
import { colors, typography, spacing, borderRadius, components } from '../styles/designSystem';

const UploadPage = () => {
  const navigate = useNavigate();
  const { user, logout, isAdmin } = useAuth();
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [ocrLoading, setOcrLoading] = useState(false);
  const [ocrError, setOcrError] = useState('');

  // Form fields
  const [title, setTitle] = useState('');
  const [originalKey, setOriginalKey] = useState('C');
  const [language, setLanguage] = useState('Tagalog');
  const [category, setCategory] = useState('Praise');
  const [chords, setChords] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const KEYS = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B',
                'Db', 'Eb', 'Gb', 'Ab', 'Bb'];

  // Redirect non-admins
  if (!isAdmin()) {
    navigate('/');
    return null;
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setOcrError('');

      // Preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleOCR = async () => {
    if (!imageFile) {
      setOcrError('Please select an image first');
      return;
    }

    setOcrLoading(true);
    setOcrError('');

    const formData = new FormData();
    formData.append('file', imageFile);

    try {
      const response = await api.post('/ocr', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setChords(response.data.text);
    } catch (err) {
      setOcrError('OCR failed: ' + (err.response?.data?.detail || 'Unknown error'));
    } finally {
      setOcrLoading(false);
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
      const response = await api.post('/songs', {
        title: title.trim(),
        original_key: originalKey,
        language,
        category,
        chords: chords.trim(),
      });

      alert('Song added successfully!');
      navigate(`/songs/${response.data.id}`);
    } catch (err) {
      alert('Failed to add song: ' + (err.response?.data?.detail || 'Unknown error'));
      setSubmitting(false);
    }
  };

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
        <h1 style={styles.pageTitle}>Add New Song</h1>

        <div style={styles.twoColumn}>
          {/* Left Column: Image Upload & OCR */}
          <div style={styles.column}>
            <div style={styles.card}>
              <h2 style={styles.cardTitle}>1. Upload File (Optional)</h2>
              <p style={styles.cardDescription}>
                Upload image (JPG, PNG) or Word doc (.docx) to extract chords
              </p>

              <input
                type="file"
                accept="image/*,.docx,.doc"
                onChange={handleImageChange}
                style={styles.fileInput}
                id="imageUpload"
              />
              <label htmlFor="imageUpload" style={styles.fileLabel}>
                Choose Image
              </label>

              {imagePreview && (
                <div style={styles.imagePreview}>
                  <img src={imagePreview} alt="Preview" style={styles.previewImage} />
                </div>
              )}

              <button
                onClick={handleOCR}
                disabled={!imageFile || ocrLoading}
                style={{
                  ...styles.ocrButton,
                  ...((!imageFile || ocrLoading) ? styles.ocrButtonDisabled : {})
                }}
              >
                {ocrLoading ? 'Processing...' : '🔍 Extract Text (OCR)'}
              </button>

              {ocrError && <div style={styles.error}>{ocrError}</div>}
            </div>
          </div>

          {/* Right Column: Song Form */}
          <div style={styles.column}>
            <form onSubmit={handleSubmit} style={styles.card}>
              <h2 style={styles.cardTitle}>2. Song Details</h2>

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
                  placeholder="Paste or type chords here... (use OCR button on left to extract from image)"
                  required
                  rows={15}
                  style={styles.textarea}
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                style={{
                  ...styles.submitButton,
                  ...(submitting ? styles.submitButtonDisabled : {})
                }}
              >
                {submitting ? 'Adding Song...' : '✓ Add Song'}
              </button>
            </form>
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
  twoColumn: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: spacing.sectionGap,
  },
  column: {
    display: 'flex',
    flexDirection: 'column',
  },
  card: {
    ...components.card,
    padding: '30px',
    height: '100%',
  },
  cardTitle: {
    fontSize: typography.heading,
    color: colors.darkText,
    marginBottom: '10px',
    fontWeight: typography.weightMedium,
  },
  cardDescription: {
    fontSize: typography.metadata,
    color: colors.secondaryText,
    marginBottom: '20px',
  },
  fileInput: {
    display: 'none',
  },
  fileLabel: {
    display: 'inline-block',
    padding: spacing.buttonPaddingMedium,
    backgroundColor: 'transparent',
    color: colors.primaryAccent,
    border: `1px solid ${colors.primaryAccent}`,
    borderRadius: borderRadius.button,
    fontSize: typography.body,
    fontWeight: typography.weightMedium,
    cursor: 'pointer',
    textAlign: 'center',
    transition: 'all 0.2s ease',
  },
  imagePreview: {
    marginTop: '20px',
    marginBottom: '20px',
  },
  previewImage: {
    maxWidth: '100%',
    height: 'auto',
    borderRadius: borderRadius.card,
    border: `2px solid ${colors.border}`,
  },
  ocrButton: {
    width: '100%',
    ...components.buttonPrimary,
    padding: '14px',
    marginTop: '15px',
  },
  ocrButtonDisabled: {
    backgroundColor: colors.secondaryText,
    color: colors.background,
    cursor: 'not-allowed',
    opacity: 0.5,
  },
  error: {
    marginTop: '15px',
    padding: spacing.cardPadding,
    backgroundColor: colors.errorBg,
    color: colors.error,
    borderRadius: borderRadius.card,
    fontSize: typography.metadata,
    border: `1px solid ${colors.errorBorder}`,
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
    fontWeight: typography.weightMedium,
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
  submitButton: {
    width: '100%',
    ...components.buttonPrimary,
    padding: '14px',
    fontSize: typography.heading,
  },
  submitButtonDisabled: {
    backgroundColor: colors.secondaryText,
    color: colors.background,
    cursor: 'not-allowed',
    opacity: 0.5,
  },
};

export default UploadPage;
