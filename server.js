const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

const app = express();

// config file
dotenv.config({ path: './config/config.env' });

// middlewares
app.use(express.json({ extended: false }));

// connect to db
connectDB();

app.get('/', (req, res) => res.send('Welcome to DevConnector API.'));

// use routes
app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/profile', require('./routes/api/profile'));
app.use('/api/posts', require('./routes/api/posts'));

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server connected on port ${port}`));
