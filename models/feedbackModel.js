const mongoose = require('mongoose');


// const FeedbackSchema = new mongoose.Schema({
//     feedback: { type: String, required: true },
//     name: { type: String },
//     email: { type: String },
//     userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, 
//     createdAt: { type: Date, default: Date.now }
//   });

const FeedbackSchema = new mongoose.Schema({
  feedback: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',  
    required: true
  }
});

module.exports = mongoose.model('Feedback', FeedbackSchema);
  
  //const Feedback = mongoose.model('Feedback', FeedbackSchema);