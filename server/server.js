const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const user = require('./routes/userRoute');
const cookieParser = require('cookie-parser')
const logger = require('./Utility/logger');
const morgan = require("morgan");


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

// Custom Morgan format to include response time, method, route, and status code
const customFormat =
  ":method :url :status :res[content-length] - :response-time ms";

// Stream Morgan logs into Winston
const stream = {
  write: (message) => logger.debug(message.trim()), // Log as debug
};
// Apply Morgan middleware
app.use(morgan(customFormat, { stream }));

// Start server only after successful DB connection
app.listen(port, () => {
    logger.info(`Server is running on http://localhost:${port}`);
    console.log(`Server is running on http://localhost:${port}`);
});