exports.getChat = async (req, res) => {
    try {
        res.status(200).json({ message: 'Login successful' });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.postChat = (req, res) => {
    res.send('Chat route');
};