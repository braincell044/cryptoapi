const mongoose = require ('mongoose')
const  express = require ('express')
const cors = require('cors');

const app = express()

//Allow requests from specific origin (your frontend)

app.use(cors({ origin: 'http://localhost:3000' }));

const userRoute = require('./routes/users')

const authRoute = require('./routes/auth')
const auth = require('./middleware/auth'); // ✅ Correct relative path
const walletAddressRoute = require('./routes/wallet'); // ✅ Correct relative path


mongoose.connect('mongodb://localhost/cryptoapiDB')
.then(() =>console.log('Connected to MongoDB...'))
.catch(err => console.log('Could not connect to MongoDB...', err))


// middleware
app.use(express.json());

app.use('/api/user', userRoute)
app.use('/api/wallet', walletAddressRoute)
app.use('/api/auth', authRoute)

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong! Please try again later.');
});



const port = process.env.PORT || 4500

app.listen(port, () => console.log (`listening on port ${port}`))