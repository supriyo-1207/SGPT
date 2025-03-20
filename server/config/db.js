const mongoose = require('mongoose');
const logger = require('../Utility/logger');
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.DB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        logger.info(`MongoDB Connected: ${conn.connection.host}`);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        logger.error('MongoDB Connection Error: ', error.message);
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;