const express = require('express');
const Answer = require('../models/Answer');

const router = express.Router();

// @POST /api/answers - отправить ответы на опрос
router.post('/', async (req, res) => {
  try {
    const { surveyId, respondentId, answers } = req.body;

    if (!surveyId || !answers) {
      return res.status(400).json({ error: 'surveyId и answers обязательны' });
    }

    const answer = new Answer({
      surveyId,
      respondentId: respondentId || null,
      answers
    });

    await answer.save();
    
    res.status(201).json({
      success: true,
      message: 'Ответы сохранены',
      data: answer
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @GET /api/answers/survey/:surveyId - получить все ответы на опрос
router.get('/survey/:surveyId', async (req, res) => {
  try {
    const answers = await Answer.find({ surveyId: req.params.surveyId })
      .populate('respondentId', 'firstName lastName email');
    
    res.json({
      success: true,
      totalResponses: answers.length,
      data: answers
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @GET /api/answers/:id - получить отдельный ответ
router.get('/:id', async (req, res) => {
  try {
    const answer = await Answer.findById(req.params.id)
      .populate('surveyId')
      .populate('respondentId', 'firstName lastName email');
    
    if (!answer) {
      return res.status(404).json({ error: 'Ответ не найден' });
    }

    res.json({
      success: true,
      data: answer
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @DELETE /api/answers/:id - удалить ответ
router.delete('/:id', async (req, res) => {
  try {
    const answer = await Answer.findByIdAndDelete(req.params.id);
    if (!answer) {
      return res.status(404).json({ error: 'Ответ не найден' });
    }

    res.json({
      success: true,
      message: 'Ответ удален'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
