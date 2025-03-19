const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const user = require('./routes/userRoute');
const cookieParser = require('cookie-parser')


dotenv.config();
const app = express();
const port = process.env.PORT || 7000;


// MongoDB Connection
connectDB();

// Middlewares
app.use(cors({
    origin: 'http://localhost:5173',  // Your frontend URL
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true // Allow credentials to be sent
}));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/', user);

// Start server only after successful DB connection
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});