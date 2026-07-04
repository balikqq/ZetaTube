require('dotenv').config();
const express = require('express');
const session = require('express-session');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 6969;

// Middleware
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Render'da HTTPS var, ama local'de false
}));

// Router'lar
const authRoutes = require('./routes/auth');
const videoRoutes = require('./routes/videos');
const adminRoutes = require('./routes/admin');

app.use('/api/auth', authRoutes);
app.use('/api/videos', videoRoutes);
app.use('/admin', adminRoutes);

// Ana sayfa - giriş kontrolü yapıp yönlendir
app.get('/', (req, res) => {
  if (!req.session.user) return res.redirect('/login.html');
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Watch sayfası
app.get('/watch/:id', (req, res) => {
  if (!req.session.user) return res.redirect('/login.html');
  res.sendFile(path.join(__dirname, 'public', 'watch.html'));
});

app.listen(PORT, () => {
  console.log(`🔥 ZetaTube aktif, Alpha! Port: ${PORT}`);
});
