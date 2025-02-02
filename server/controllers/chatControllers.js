const User = require('../models/userModel');
exports.getChat = async (req, res) => {
    try {
        const user_id = req.user.id; 
        // console.log(user_id);
        const user_data = await User.findById(user_id).select('-password'); 
        if (!user_data) {
            return res.status(404).json({ message: 'User not found' });
        }
        // console.log(user_data);

        res.status(200).json({ message: 'Login successful' , user: user_data });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.postChat =async (req, res) => {
   try {
       const {message} = req.body;
       console.log(message);

        res.status(200).json({ message: 'Message sent successfully' });

   } catch (error) {
       res.status(500).json({ message: 'Internal server error' });
   }
};