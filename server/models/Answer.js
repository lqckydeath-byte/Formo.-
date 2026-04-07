const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema({
  surveyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Survey',
    required: true
  },
  respondentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  answers: [{
    questionId: String,
    questionTitle: String,
    answer: mongoose.Schema.Types.Mixed // может быть строка, массив, число
  }],
  submittedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Answer', answerSchema);
