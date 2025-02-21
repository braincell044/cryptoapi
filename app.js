require('dotenv').config();
const config = require(`./config/config.${process.env.NODE_ENV || 'default'}.js`);

const mongoose = require ('mongoose')
const  express = require ('express')
const cors = require('cors');

const app = express()

//Allow requests from specific origin (your frontend)



app.use(cors({
  origin: ['https://cryptolite.vercel.app', 'http://localhost:3000'], // Allow both production and local dev
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type'],
  credentials: true
}));


const userRoute = require('./routes/users')

const authRoute = require('./routes/auth')
const auth = require('./middleware/auth'); // ✅ Correct relative path
const walletAddressRoute = require('./routes/wallet'); // ✅ Correct relative path


// mongoose.connect('mongodb://localhost/cryptoapiDB')
// .then(() =>console.log('Connected to MongoDB...'))
// .catch(err => console.log('Could not connect to MongoDB...', err))




// Connect to MongoDB Atlas
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB Connected'))
.catch(err => console.error('❌ MongoDB Connection Error:', err));

const path = require('path');

let configFilePath = `./config.${process.env.NODE_ENV || 'default'}.js`;

try {
  const config = require(configFilePath);
} catch (err) {
  console.error(`Could not load config file: ${configFilePath}. Falling back to default.`);
  const config = require('./config/default.json'); // Make sure you have this default file
}



app.get('/', (req, res) => res.send('Hello, MongoDB Atlas!'));

app.get('/', (req, res) => {
  res.send('Server is running!');
});




// middleware
app.use(express.json());

app.use('/api/user', userRoute)
app.use('/api/wallet', walletAddressRoute)
app.use('/api/auth', authRoute)

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong! Please try again later.');
});


app.use((req, res, next) => {
  const allowedOrigins = ['https://cryptolite.vercel.app', 'http://localhost:3000'];
  const origin = req.headers.origin;

  if (allowedOrigins.includes(origin)) {
      res.setHeader('Access-Control-Allow-Origin', origin);
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
      res.setHeader('Access-Control-Allow-Credentials', 'true');
  }

  if (req.method === 'OPTIONS') {
      return res.status(200).end();
  }

  next();
});



// const port = process.env.PORT || 4500

// app.listen(port, () => console.log (`listening on port ${port}`))