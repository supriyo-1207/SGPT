const express = require('express');
const cors = require('cors');
const chatRouter = require('./routes/chatRoutes');

const app = express();
const port = 3000;

app.use(cors()); // Add this line to enable CORS for all routes
app.use(express.json()); // Add this line to parse JSON request bodies
app.use('/', chatRouter);

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});