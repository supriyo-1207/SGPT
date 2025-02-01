const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./db');
const chatRouter = require('./routes/chatRoutes');
const RegisterRouter = require('./routes/registerRoutes');
const LoginRouter = require('./routes/loginRoutes');


dotenv.config();
const app = express();
const port = process.env.PORT || 7000;

// MongoDB Connection
connectDB();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use('/', chatRouter);
app.use('/', RegisterRouter);
app.use('/', LoginRouter);


// Start server only after successful DB connection
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});