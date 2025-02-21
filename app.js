
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Allow requests from specific origins
app.use(cors({
  origin: ['https://cryptolite.vercel.app', 'http://localhost:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type'],
  credentials: true
}));

// Environment Variables
const mongoURI = process.env.MONGO_URI;
const jwtPrivateKey = process.env.JWT_SECRET;
const port = process.env.PORT || 4500;

// Check if required environment variables are set
if (!mongoURI || !jwtPrivateKey) {
  console.error("❌ ERROR: Missing required environment variables.");
  process.exit(1);
}

// Connect to MongoDB
mongoose.connect(mongoURI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.error('❌ MongoDB Connection Error:', err));

// Middleware
app.use(express.json());

// Routes
const userRoute = require('./routes/users');
const authRoute = require('./routes/auth');
const walletAddressRoute = require('./routes/wallet');

app.use('/api/user', userRoute);
app.use('/api/wallet', walletAddressRoute);
app.use('/api/auth', authRoute);

// Root Route
app.get('/', (req, res) => res.send('Server is running!'));

// Start Server
app.listen(port, () => console.log(`🚀 Server listening on port ${port}`));

// Debugging Logs
// console.log(`✅ Running in ${process.env.NODE_ENV} mode`);
// console.log(`🔍 Loaded Config from .env: { mongoURI: "${mongoURI}", jwtPrivateKey: "${jwtPrivateKey}" }`);
