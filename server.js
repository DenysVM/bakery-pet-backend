const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const orderRoutes = require('./routes/orderRoutes'); 
const productRoutes = require('./routes/productRoutes'); 

dotenv.config();
connectDB();

const app = express();

app.use(express.json());

const allowedOrigins = [
  'http://localhost:3000', 
  'https://denysvm.github.io/bakery-pet',
  'https://denysvm.github.io',  
  'https://bakery-pet-backend.onrender.com',
  'http://172.20.10.6:3000',
  'http://172.20.10.6:5000'  
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true,
}));

app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/products', productRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
