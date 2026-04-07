const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  title: String,
  type: String, // radio, checkbox, text, textarea, dropdown, scale
  options: [String],
  required: Boolean
});

const surveySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: String,
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  questions: [questionSchema],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Survey', surveySchema);
