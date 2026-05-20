require('dotenv').config();   // must be first — loads server/.env

const express    = require('express');
const cors       = require('cors');
const bodyParser = require('body-parser');

const connectDB = require('./config/db');
const authRoutes        = require('./routes/authRoutes');
const walletRoutes      = require('./routes/walletRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const contactRoutes     = require('./routes/contactRoutes');

const app  = express();
const PORT = process.env.PORT || 5000;

// ── Middleware ────────────────────────────────────────────────
app.use(cors());
app.use(bodyParser.json());

// ── Routes ───────────────────────────────────────────────────
app.use('/api/auth',         authRoutes);
app.use('/api/wallet',       walletRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/contacts',     contactRoutes);

// Health check
app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));

// ── Boot: connect DB first, then listen ──────────────────────
(async () => {
  await connectDB();           // exits process on failure
  app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
})();
