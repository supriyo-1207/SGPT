const SupportRequest = require("../models/contactModel");

exports.submitSupportRequest = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    const userId = req.user._id; // Assuming the user's ID is available in `req.user`

    // Create a new support request
    const newSupportRequest = new SupportRequest({
      userId, // Include the user's ID
      name,
      email,
      subject,
      message,
    });

    // Save the request to the database
    await newSupportRequest.save();

    res.status(201).json({
      success: true,
      message: "Support request submitted successfully!",
      data: newSupportRequest,
    });
  } catch (error) {
    console.error("Error submitting support request:", error);
    res.status(500).json({
      success: false,
      message: "Failed to submit support request. Please try again.",
    });
  }
};