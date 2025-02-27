import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

import dotenv from 'dotenv';
dotenv.config();


const app = express();

// Allow requests from specific origins
app.use(cors({
  origin: ['http://localhost:3000', 'https://cryptolite.vercel.app'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.options('*', cors()); 

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

import authRoute from './routes/auth.js';
import walletAddressRoute from './routes/wallet.js';
import depositRoutes from './routes/deposits.js';
import userEmail from './routes/user.js';
import adminRoutes from './routes/admin.js';
import { authenticateAdmin } from './middleware/auth.js';
// import emailRoute from './routes/emailRoute.js'
import userRoute from './routes/users.js'

app.use('/api', adminRoutes);
app.use('/api/user', userEmail);
app.use('/api/wallet', walletAddressRoute);
app.use('/api/auth', authRoute);
app.use('/api/deposit', depositRoutes);
app.use('/api/user', userRoute)
// app.use('/api', emailRoute)




app.get('/api/deposit/admin/deposit', authenticateAdmin, (req, res) => {
  res.json({ message: 'Authorized access' });
});

// Root Route
app.get('/', (req, res) => res.send('Server is running!'));

// Start Server
app.listen(port, () => console.log(`🚀 Server listening on port ${port}`));
