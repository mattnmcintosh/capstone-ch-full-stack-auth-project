import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Card, CardContent, Container, Grid, Typography, Chip, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem, AppBar, Toolbar, Alert, LinearProgress } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import LogoutIcon from '@mui/icons-material/Logout';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import API, { getGames, createGame, updateGame, deleteGame, logoutUser } from '../services/api';

const statusColors = {
  Backlog: 'default',
  Playing: 'primary',
  Completed: 'success',
  Dropped: 'error',
};

export default function Dashboard() {
  const [games, setGames] = useState([]);
  const [genres, setGenres] = useState([]);

  // Filter & Sort states
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGenreFilter, setSelectedGenreFilter] = useState('All');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('All');
  const [sortBy, setSortBy] = useState('title_asc');
  
  // Modal & Form State
  const [openModal, setOpenModal] = useState(false);
  const [editingGameId, setEditingGameId] = useState(null);
  const [title, setTitle] = useState('');
  const [platform, setPlatform] = useState('');
  const [genreId, setGenreId] = useState('');
  const [status, setStatus] = useState('Backlog');
  const [rating, setRating] = useState('');
  const [hoursPlayed, setHoursPlayed] = useState('');
  const [notes, setNotes] = useState('');

  // Error state
  const [error, setError] = useState('');

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user')) || { username: 'Gamer' };

  const fetchData = async () => {
    try {
      const [gamesData, genresRes] = await Promise.all([
        getGames(),
        API.get('/genres')
      ]);
      setGames(gamesData);
      setGenres(genresRes.data);
    } catch (err) {
      setError('Failed to fetch dashboard data. Please sign in again.');
      if (err.response?.status === 401) {
        navigate('/login');
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, [navigate]);

  const handleLogout = () => {
    logoutUser();
    navigate('/login');
  };

  const handleOpenAddModal = () => {
    setEditingGameId(null);
    setTitle('');
    setPlatform('');
    setGenreId('');
    setStatus('Backlog');
    setRating('');
    setHoursPlayed('');
    setNotes('');
    setOpenModal(true);
  };

  const handleOpenEditModal = (game) => {
    setEditingGameId(game.id);
    setTitle(game.title);
    setPlatform(game.platform || '');
    setGenreId(game.genre_id || '');
    setStatus(game.status);
    setRating(game.rating || '');
    setHoursPlayed(game.hours_played || 0);
    setNotes(game.notes || '');
    setOpenModal(true);
  };

  const handleSubmitForm = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        title,
        platform,
        genre_id: genreId ? parseInt(genreId) : null,
        status,
        rating: rating ? parseInt(rating) : null,
        hours_played: hoursPlayed ? parseFloat(hoursPlayed) : 0.0,
        notes,
      };

      if (editingGameId) {
        await updateGame(editingGameId, payload);
      } else {
        await createGame(payload);
      }

      setOpenModal(false);
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save game entry.');
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteGame(id);
      fetchData();
    } catch (err) {
      setError('Failed to delete game entry.');
    }
  };

    const handleQuickStatusCycle = async (game) => {
    const statuses = ['Backlog', 'Playing', 'Completed', 'Dropped'];
    const currentIndex = statuses.indexOf(game.status);
    const nextStatus = statuses[(currentIndex + 1) % statuses.length];

    try {
      await updateGame(game.id, { status: nextStatus });
      fetchData(); // Refresh list immediately
    } catch (err) {
      setError('Failed to update game status.');
    }
  };

  // Filter games based on search, genre, and status
  const filteredGames = games.filter((game) => {
    const matchesGenre = selectedGenreFilter === 'All' || game.genre_name === selectedGenreFilter;
    const matchesStatus = selectedStatusFilter === 'All' || game.status === selectedStatusFilter;
    const matchesTitle = game.title.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesGenre && matchesStatus && matchesTitle;
  });

  // Sort the filtered games with tiebreaker support
  const sortedAndFilteredGames = [...filteredGames].sort((a, b) => {
    if (sortBy === 'title_asc') {
      return a.title.localeCompare(b.title);
    } else if (sortBy === 'hours_desc') {
      return (b.hours_played || 0) - (a.hours_played || 0);
    } else if (sortBy === 'rating_desc') {
      const ratingDiff = (b.rating || 0) - (a.rating || 0);
      if (ratingDiff !== 0) {
        return ratingDiff;
      }
      // Tiebreaker: Decreasing hours played
      return (b.hours_played || 0) - (a.hours_played || 0);
    }
    return 0;
  });

  const handleExportCSV = () => {
  if (games.length === 0) return;

  // Define CSV headers
  const headers = ["Title", "Platform", "Genre", "Status", "Rating", "Hours Played", "Notes"];
  
  // Map games to CSV row arrays
  const rows = games.map(game => [
    `"${(game.title || '').replace(/"/g, '""')}"`,
    `"${(game.platform || '').replace(/"/g, '""')}"`,
    `"${(game.genre_name || '').replace(/"/g, '""')}"`,
    `"${(game.status || '').replace(/"/g, '""')}"`,
    game.rating || '',
    game.hours_played || 0,
    `"${(game.notes || '').replace(/"/g, '""')}"`
  ]);

  // Combine headers and rows into a single CSV string
  const csvContent = "data:text/csv;charset=utf-8," + 
    [headers.join(","), ...rows.map(e => e.join(","))].join("\n");

  // Create a temporary anchor element to trigger the download
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "completionist_hub_library.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

  // Calculate Stats Summary & Completion Percentage
const totalHours = games.reduce((acc, curr) => acc + (curr.hours_played || 0), 0);
const completedCount = games.filter((g) => g.status === 'Completed').length;
const completionPercentage = games.length > 0 ? Math.round((completedCount / games.length) * 100) : 0;

  return (
    <Box sx={{ flexGrow: 1, minHeight: '100vh', backgroundColor: 'background.default', pb: 6 }}>
      {/* Top Navbar */}
      <AppBar position="static" sx={{ backgroundColor: 'background.paper', borderBottom: '1px solid #222' }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 700, color: 'primary.main' }}>
            Completionist Hub — {user.username}'s Backlog
          </Typography>
          <Button 
            variant="outlined" 
            color="inherit" 
            startIcon={<LogoutIcon />} 
            onClick={handleLogout}
            sx={{ borderColor: '#333', '&:hover': { borderColor: 'primary.main', backgroundColor: 'rgba(255,23,68,0.08)' } }}
          >
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

        {/* User Stats Summary Bar */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={4}>
            <Card sx={{ backgroundColor: 'background.paper', border: '1px solid #222' }}>
              <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <SportsEsportsIcon sx={{ color: 'primary.main', fontSize: 40 }} />
                <Box>
                  <Typography variant="body2" color="text.secondary">Total Tracked</Typography>
                  <Typography variant="h5" sx={{ fontWeight: 700 }}>{games.length} Games</Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Card sx={{ backgroundColor: 'background.paper', border: '1px solid #222' }}>
              <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <AccessTimeIcon sx={{ color: 'primary.main', fontSize: 40 }} />
                <Box>
                  <Typography variant="body2" color="text.secondary">Total Playtime</Typography>
                  <Typography variant="h5" sx={{ fontWeight: 700 }}>{totalHours.toFixed(1)} hrs</Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Card sx={{ backgroundColor: 'background.paper', border: '1px solid #222' }}>
              <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box>
                  <Typography variant="body2" color="text.secondary">Completed</Typography>
                  <Typography variant="h5" sx={{ fontWeight: 700 }}>{completedCount} Games</Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

            <Card sx={{ backgroundColor: 'background.paper', border: '1px solid #222', mb: 4, p: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                  Backlog Completion Progress
                </Typography>
                <Typography variant="body2" color="primary.main" sx={{ fontWeight: 700 }}>
                  {completionPercentage}% ({completedCount} of {games.length} completed)
                </Typography>
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={completionPercentage} 
                sx={{ height: 10, borderRadius: 5, backgroundColor: 'rgba(255,255,255,0.08)' }} 
              />
            </Card>

        {/* Header Controls & Filters */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            Your Games ({filteredGames.length} of {games.length})
          </Typography>

          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
            <TextField
                select
                label="Sort By"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                size="small"
                sx={{ minWidth: 160, backgroundColor: 'background.paper', borderRadius: 1 }}
              >
                <MenuItem value="title_asc">Title (A-Z)</MenuItem>
                <MenuItem value="hours_desc">Playtime (High to Low)</MenuItem>
                <MenuItem value="rating_desc">Rating (High to Low)</MenuItem>
              </TextField>
            {/* Title Search Filter */}
            <TextField
              label="Search by title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              size="small"
              sx={{ minWidth: 200, backgroundColor: 'background.paper', borderRadius: 1 }}
            />

            <TextField
              select
              label="Filter by Status"
              value={selectedStatusFilter}
              onChange={(e) => setSelectedStatusFilter(e.target.value)}
              size="small"
              sx={{ minWidth: 160, backgroundColor: 'background.paper', borderRadius: 1 }}
            >
              <MenuItem value="All">All Statuses</MenuItem>
              <MenuItem value="Backlog">Backlog</MenuItem>
              <MenuItem value="Playing">Playing</MenuItem>
              <MenuItem value="Completed">Completed</MenuItem>
              <MenuItem value="Dropped">Dropped</MenuItem>
            </TextField>

            <TextField
              select
              label="Filter by Genre"
              value={selectedGenreFilter}
              onChange={(e) => setSelectedGenreFilter(e.target.value)}
              size="small"
              sx={{ minWidth: 180, backgroundColor: 'background.paper', borderRadius: 1 }}
            >
              <MenuItem value="All">All Genres</MenuItem>
              {genres.map((g) => (
                <MenuItem key={g.id} value={g.name}>{g.name}</MenuItem>
              ))}
            </TextField>

            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleOpenAddModal}
              sx={{ backgroundColor: 'primary.main', '&:hover': { backgroundColor: 'secondary.main' }, height: 40 }}
            >
              Add Game
            </Button>
            <Button
              variant="outlined"
              onClick={handleExportCSV}
              sx={{ 
                borderColor: '#333', 
                color: 'text.secondary',
                height: 40,
                '&:hover': { borderColor: 'primary.main', color: 'primary.main', backgroundColor: 'rgba(118,255,3,0.08)' } 
              }}
            >
              Export CSV
            </Button>
          </Box>
        </Box>

        {/* Games Grid Layout */}
        <Grid container spacing={3}>
          {sortedAndFilteredGames.map((game) => (
            <Grid item xs={12} sm={6} md={4} key={game.id}>
              <Card sx={{ backgroundColor: 'background.paper', height: '100%', display: 'flex', flexDirection: 'column', position: 'relative' }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                    <Typography variant="h6" component="h2" sx={{ fontWeight: 600, pr: 7 }}>
                      {game.title}
                    </Typography>
                    <Box sx={{ position: 'absolute', top: 8, right: 8, display: 'flex', gap: 0.5 }}>
                      <IconButton size="small" color="primary" onClick={() => handleOpenEditModal(game)}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton size="small" color="error" onClick={() => handleDelete(game.id)}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </Box>

                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Platform: <strong>{game.platform || 'N/A'}</strong>
                  </Typography>

                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Genre: <strong>{game.genre_name}</strong>
                  </Typography>

                  <Box sx={{ mt: 2, mb: 2, display: 'flex', gap: 1, alignItems: 'center', flexWrap: 'wrap' }}>
                    <Chip 
                        label={game.status} 
                        color={statusColors[game.status] || 'default'} 
                        size="small" 
                        onClick={() => handleQuickStatusCycle(game)}
                        sx={{ cursor: 'pointer', '&:hover': { opacity: 0.8 } }}
                        title="Click to cycle status"
                      />
                      {game.rating && (
                        <Chip 
                          label={`Rating: ${game.rating}/5`} 
                          variant="outlined" 
                          size="small" 
                          sx={{ borderColor: '#333' }}
                        />
                    )}
                  </Box>

                  <Typography variant="body2" color="text.secondary">
                    Hours Played: {game.hours_played || 0} hrs
                  </Typography>
                  {game.notes && (
                    <Typography variant="body2" sx={{ mt: 1.5, fontStyle: 'italic', color: 'text.secondary', backgroundColor: 'rgba(255,255,255,0.03)', p: 1, borderRadius: 1 }}>
                      "{game.notes}"
                    </Typography>
                  )}  
                </CardContent>
              </Card>
            </Grid>
          ))}
          {filteredGames.length === 0 && (
            <Grid item xs={12}>
              <Typography align="center" color="text.secondary" sx={{ py: 4 }}>
                No games match this filter criteria.
              </Typography>
            </Grid>
          )}
        </Grid>
      </Container>

      {/* Add / Edit Game Modal */}
      <Dialog open={openModal} onClose={() => setOpenModal(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 700, color: 'primary.main' }}>
          {editingGameId ? 'Edit Game Entry' : 'Add New Game'}
        </DialogTitle>
        <Box component="form" onSubmit={handleSubmitForm}>
          <DialogContent>
            <TextField
              margin="dense"
              label="Game Title"
              fullWidth
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="dense"
              label="Platform (e.g. PC, PS5, Switch)"
              fullWidth
              value={platform}
              onChange={(e) => setPlatform(e.target.value)}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="dense"
              select
              label="Genre"
              fullWidth
              value={genreId}
              onChange={(e) => setGenreId(e.target.value)}
              sx={{ mb: 2 }}
            >
              <MenuItem value=""><em>None</em></MenuItem>
              {genres.map((g) => (
                <MenuItem key={g.id} value={g.id}>{g.name}</MenuItem>
              ))}
            </TextField>
            <TextField
              margin="dense"
              select
              label="Status"
              fullWidth
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              sx={{ mb: 2 }}
            >
              <MenuItem value="Backlog">Backlog</MenuItem>
              <MenuItem value="Playing">Playing</MenuItem>
              <MenuItem value="Completed">Completed</MenuItem>
              <MenuItem value="Dropped">Dropped</MenuItem>
            </TextField>
            <TextField
              margin="dense"
              label="Rating (1-5)"
              type="number"
              fullWidth
              inputProps={{ min: 1, max: 5 }}
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="dense"
              label="Hours Played"
              type="number"
              fullWidth
              inputProps={{ step: 0.5, min: 0 }}
              value={hoursPlayed}
              onChange={(e) => setHoursPlayed(e.target.value)}
            />
            <TextField
              margin="dense"
              label="Personal Notes / Mini-Review"
              multiline
              rows={2}
              fullWidth
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              sx={{ mt: 2 }}
            />
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={() => setOpenModal(false)} color="inherit">Cancel</Button>
            <Button type="submit" variant="contained" sx={{ backgroundColor: 'primary.main', '&:hover': { backgroundColor: 'secondary.main' } }}>
              {editingGameId ? 'Save Changes' : 'Add to Library'}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </Box>
  );
}