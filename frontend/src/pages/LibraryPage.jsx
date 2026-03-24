import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../utils/api';
import { colors, typography, spacing, borderRadius, shadows, components } from '../styles/designSystem';

const LibraryPage = () => {
  const navigate = useNavigate();
  const { user, logout, isAdmin } = useAuth();
  const [songs, setSongs] = useState([]);
  const [filteredSongs, setFilteredSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [languageFilter, setLanguageFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Fetch songs on mount
  useEffect(() => {
    fetchSongs();
  }, []);

  // Apply filters whenever songs or filters change
  useEffect(() => {
    applyFilters();
  }, [songs, searchQuery, languageFilter, categoryFilter]);

  const fetchSongs = async () => {
    try {
      const response = await api.get('/songs');
      setSongs(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load songs');
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...songs];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(song =>
        song.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Language filter
    if (languageFilter !== 'all') {
      filtered = filtered.filter(song => song.language === languageFilter);
    }

    // Category filter
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(song => song.category === categoryFilter);
    }

    setFilteredSongs(filtered);
  };

  const handleDeleteSong = async (songId, songTitle) => {
    if (!window.confirm(`Delete "${songTitle}"? This cannot be undone.`)) {
      return;
    }

    try {
      await api.delete(`/songs/${songId}`);
      setSongs(songs.filter(song => song.id !== songId));
      alert('Song deleted successfully');
    } catch (err) {
      alert('Failed to delete song: ' + (err.response?.data?.detail || 'Unknown error'));
    }
  };

  // Group songs by language and category
  const groupSongs = () => {
    const groups = {
      'Tagalog-Praise': [],
      'Tagalog-Worship': [],
      'English-Praise': [],
      'English-Worship': [],
    };

    filteredSongs.forEach(song => {
      const key = `${song.language}-${song.category}`;
      if (groups[key]) {
        groups[key].push(song);
      }
    });

    return groups;
  };

  const groupedSongs = groupSongs();

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loading}>Loading songs...</div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <header style={styles.header} className="no-print">
        <div style={styles.headerLeft}>
          <h1 style={styles.appTitle}>✝ Chord Manager</h1>
        </div>
        <div style={styles.headerRight}>
          {isAdmin() && (
            <>
              <button onClick={() => navigate('/upload')} style={styles.addButton}>
                + Add Song
              </button>
              <button onClick={() => navigate('/admin')} style={styles.adminButton}>
                Admin
              </button>
            </>
          )}
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

      {/* Filters */}
      <div style={styles.filters} className="no-print">
        <input
          type="text"
          placeholder="Search songs..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={styles.searchInput}
        />
        <select
          value={languageFilter}
          onChange={(e) => setLanguageFilter(e.target.value)}
          style={styles.select}
        >
          <option value="all">All Languages</option>
          <option value="Tagalog">🇵🇭 Tagalog</option>
          <option value="English">🌐 English</option>
        </select>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          style={styles.select}
        >
          <option value="all">All Categories</option>
          <option value="Praise">Praise</option>
          <option value="Worship">Worship</option>
        </select>
      </div>

      {error && <div style={styles.error}>{error}</div>}

      {/* Song Groups */}
      <div style={styles.content}>
        {filteredSongs.length === 0 ? (
          <div style={styles.emptyState}>
            <p>No songs found.</p>
            {isAdmin() && <button onClick={() => navigate('/upload')} style={styles.addButton}>+ Add Song</button>}
          </div>
        ) : (
          <>
            {/* Tagalog Praise */}
            {groupedSongs['Tagalog-Praise'].length > 0 && (
              <SongGroup
                title="🇵🇭 Tagalog — Praise"
                songs={groupedSongs['Tagalog-Praise']}
                isAdmin={isAdmin()}
                onSongClick={(id) => navigate(`/songs/${id}`)}
                onEdit={(id) => navigate(`/songs/${id}/edit`)}
                onDelete={handleDeleteSong}
              />
            )}

            {/* Tagalog Worship */}
            {groupedSongs['Tagalog-Worship'].length > 0 && (
              <SongGroup
                title="🇵🇭 Tagalog — Worship"
                songs={groupedSongs['Tagalog-Worship']}
                isAdmin={isAdmin()}
                onSongClick={(id) => navigate(`/songs/${id}`)}
                onEdit={(id) => navigate(`/songs/${id}/edit`)}
                onDelete={handleDeleteSong}
              />
            )}

            {/* English Praise */}
            {groupedSongs['English-Praise'].length > 0 && (
              <SongGroup
                title="🌐 English — Praise"
                songs={groupedSongs['English-Praise']}
                isAdmin={isAdmin()}
                onSongClick={(id) => navigate(`/songs/${id}`)}
                onEdit={(id) => navigate(`/songs/${id}/edit`)}
                onDelete={handleDeleteSong}
              />
            )}

            {/* English Worship */}
            {groupedSongs['English-Worship'].length > 0 && (
              <SongGroup
                title="🌐 English — Worship"
                songs={groupedSongs['English-Worship']}
                isAdmin={isAdmin()}
                onSongClick={(id) => navigate(`/songs/${id}`)}
                onEdit={(id) => navigate(`/songs/${id}/edit`)}
                onDelete={handleDeleteSong}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

// SongGroup Component
const SongGroup = ({ title, songs, isAdmin, onSongClick, onEdit, onDelete }) => {
  const [hoveredRow, setHoveredRow] = React.useState(null);

  return (
    <div style={styles.group}>
      <h2 style={styles.groupTitle}>{title}</h2>
      <div style={styles.songList}>
        {songs.map(song => (
          <div
            key={song.id}
            style={{
              ...styles.songRow,
              ...(hoveredRow === song.id ? styles.songRowHover : {}),
            }}
            onClick={() => onSongClick(song.id)}
            onMouseEnter={() => setHoveredRow(song.id)}
            onMouseLeave={() => setHoveredRow(null)}
          >
            <div style={styles.songInfo}>
              <h3 style={styles.songTitle}>{song.title}</h3>
              <p style={styles.songMeta}>
                {song.language === 'Tagalog' ? '🇵🇭' : '🌐'} {song.language} · {song.category}
              </p>
            </div>
            <div style={styles.songRight}>
              <div style={styles.keyBadge}>Key: {song.original_key}</div>
              {isAdmin && (
                <div style={styles.songActions} onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => onEdit(song.id)}
                    style={styles.editButton}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(song.id, song.title)}
                    style={styles.deleteButton}
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
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
  appTitle: {
    fontSize: typography.appTitle,
    color: colors.darkText,
    margin: 0,
    fontWeight: typography.medium,
    letterSpacing: '-0.3px',
  },
  headerRight: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing.headerGap,
  },
  addButton: {
    ...components.buttonPrimary,
  },
  adminButton: {
    ...components.buttonSecondary,
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
  filters: {
    display: 'flex',
    gap: spacing.formGap,
    padding: `0 ${spacing.containerPadding}`,
    marginTop: spacing.sectionGap,
    marginBottom: spacing.sectionGap,
    flexWrap: 'wrap',
  },
  searchInput: {
    ...components.input,
    flex: 1,
    minWidth: '200px',
  },
  select: {
    ...components.input,
    minWidth: '150px',
  },
  content: {
    padding: `0 ${spacing.containerPadding} ${spacing.containerPadding}`,
  },
  error: {
    padding: spacing.cardPadding,
    margin: `0 ${spacing.containerPadding} ${spacing.sectionGap}`,
    backgroundColor: colors.errorBg,
    color: colors.error,
    borderRadius: borderRadius.card,
    border: `1px solid ${colors.errorBorder}`,
  },
  emptyState: {
    textAlign: 'center',
    padding: '60px 20px',
    color: colors.secondaryText,
  },
  group: {
    marginBottom: spacing.sectionGap,
  },
  groupTitle: {
    fontSize: typography.heading,
    fontWeight: typography.medium,
    color: colors.darkText,
    marginBottom: '16px',
    letterSpacing: '-0.3px',
  },
  songList: {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing.listGap,
  },
  songRow: {
    ...components.card,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    cursor: 'pointer',
  },
  songRowHover: {
    boxShadow: shadows.cardHover,
    borderColor: colors.borderDark,
  },
  songInfo: {
    flex: 1,
  },
  songTitle: {
    fontSize: typography.songTitle,
    fontWeight: typography.medium,
    color: colors.darkText,
    margin: '0 0 4px 0',
  },
  songMeta: {
    fontSize: typography.metadata,
    color: colors.secondaryText,
    margin: 0,
  },
  songRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  keyBadge: {
    ...components.keyBadge,
  },
  songActions: {
    display: 'flex',
    gap: '8px',
  },
  editButton: {
    padding: '6px 12px',
    backgroundColor: colors.cardBg,
    color: colors.darkText,
    border: `1px solid ${colors.borderDark}`,
    borderRadius: borderRadius.small,
    fontSize: typography.small,
    cursor: 'pointer',
    fontWeight: typography.medium,
    transition: 'all 0.2s ease',
  },
  deleteButton: {
    padding: '6px 12px',
    backgroundColor: colors.errorBg,
    color: colors.error,
    border: `1px solid ${colors.errorBorder}`,
    borderRadius: borderRadius.small,
    fontSize: typography.small,
    cursor: 'pointer',
    fontWeight: typography.medium,
    transition: 'all 0.2s ease',
  },
};

export default LibraryPage;
