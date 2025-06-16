const express = require('express');
const feedbackModel = require('../models/feedbackModel');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');

// router.post('/', async (req, res) => {
//     try {
//       const { feedback, name, email, userId } = req.body;
  
//       const newFeedback = new Feedback({
//         feedback,
//         name,
//         email,
//         userId
//       });
  
//       await newFeedback.save();
//       res.status(201).json({ message: 'Feedback submitted successfully!' });
//     } catch (error) {
//       console.error('Error submitting feedback:', error);
//       res.status(500).json({ msg: 'Failed to submit feedback', error: error.message });
//     }
//   });

router.post('/', async (req, res) => {
  try {
    const { feedback, name, email, userId } = req.body;

    const newFeedback = new feedbackModel({ 
      feedback,
      name,
      email,
      userId
    });

    await newFeedback.save();
    res.status(201).json({ message: 'Feedback submitted successfully!' });
  } catch (error) {
    console.error('Error submitting feedback:', error);
    res.status(500).json({ msg: 'Failed to submit feedback', error: error.message });
  }
});


router.get('/get-feedbacks', authMiddleware, async (req, res) => {
  try {
      // Check if the user is an admin
      if (req.user.role !== 'admin') {
          return res.status(403).json({ message: 'Unauthorized' }); // Forbidden
      }

      // Retrieve all feedback from the database
      const allFeedback = await feedbackModel.find().populate('userId', 'name email'); 

      res.status(200).json(allFeedback);
  } catch (error) {
      console.error('Error getting all feedback:', error);
      res.status(500).json({ msg: 'Failed to get feedback', error: error.message });
  }
});
  
  module.exports = router;