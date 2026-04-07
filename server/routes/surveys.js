const express = require('express');
const Survey = require('../models/Survey');
const Answer = require('../models/Answer');

const router = express.Router();

// @GET /api/surveys - получить все опросы
router.get('/', async (req, res) => {
  try {
    const surveys = await Survey.find().populate('createdBy', 'firstName lastName email');
    res.json({
      success: true,
      data: surveys
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @GET /api/surveys/:id - получить опрос по ID
router.get('/:id', async (req, res) => {
  try {
    const survey = await Survey.findById(req.params.id).populate('createdBy', 'firstName lastName email');
    if (!survey) {
      return res.status(404).json({ error: 'Опрос не найден' });
    }
    res.json({
      success: true,
      data: survey
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @POST /api/surveys - создать новый опрос
router.post('/', async (req, res) => {
  try {
    const { title, description, questions, userId } = req.body;

    if (!title || !userId) {
      return res.status(400).json({ error: 'Название и userId обязательны' });
    }

    // Проверяем что userId это валидный ObjectId
    const mongoose = require('mongoose');
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: 'Неверный формат userId' });
    }

    const survey = new Survey({
      title,
      description,
      questions: questions || [],
      createdBy: userId
    });

    await survey.save();
    await survey.populate('createdBy', 'firstName lastName email');

    res.status(201).json({
      success: true,
      message: 'Опрос создан',
      data: survey
    });
  } catch (error) {
    console.error('Error creating survey:', error);
    res.status(500).json({ error: error.message });
  }
});

// @PUT /api/surveys/:id - обновить опрос
router.put('/:id', async (req, res) => {
  try {
    const { title, description, questions } = req.body;

    let survey = await Survey.findById(req.params.id);
    if (!survey) {
      return res.status(404).json({ error: 'Опрос не найден' });
    }

    if (title) survey.title = title;
    if (description) survey.description = description;
    if (questions) survey.questions = questions;
    survey.updatedAt = Date.now();

    await survey.save();
    await survey.populate('createdBy', 'firstName lastName email');

    res.json({
      success: true,
      message: 'Опрос обновлен',
      data: survey
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @DELETE /api/surveys/:id - удалить опрос
router.delete('/:id', async (req, res) => {
  try {
    const survey = await Survey.findByIdAndDelete(req.params.id);
    if (!survey) {
      return res.status(404).json({ error: 'Опрос не найден' });
    }
    res.json({
      success: true,
      message: 'Опрос удален'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
