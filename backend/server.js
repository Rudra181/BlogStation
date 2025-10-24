const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const postRoutes = require('./routes/postRoutes');
const { errorHandler } = require('./middleware/errorMiddleware');

dotenv.config();

const PORT = process.env.PORT || 5000;

const app = express();

// connect to MongoDB
connectDB();

// middlewares
app.use(cors());
app.use(express.json()); // parse JSON bodies

// routes
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);

// health check
app.get('/', (req, res) => res.json({ message: 'API is running' }));

// centralized error handler
app.use(errorHandler);

// start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
