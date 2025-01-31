const express = require('express');
const chatRouter = require('./routes/chatRoutes');

const app = express();
const port = 3000;

app.use('/', chatRouter);

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});