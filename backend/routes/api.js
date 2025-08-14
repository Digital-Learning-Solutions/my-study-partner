const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const generator = require('../controllers/generator');

// simple static question bank
const sampleQuestions = [
  { id: 'q1', question: 'What color is the sky on a clear day?', options: ['Blue','Green','Red','Black'], answer: 0 },
  { id: 'q2', question: 'What does HTML stand for?', options: ['HyperText Markup Language','HighText Markup','Hyperlink Markup','Home Tool Markup'], answer: 0 },
  { id: 'q3', question: 'What is 2 + 2?', options: ['3','4','5','22'], answer: 1 }
];

// GET sample questions (solo quick play)
router.get('/questions/sample', (req, res) => {
  res.json({ success: true, questions: sampleQuestions });
});

// POST upload notes -> generate questions (placeholder)
router.post('/upload-notes', upload.single('file'), async (req, res) => {
  try {
    // file available at req.file.path (in production delete after use)
    const text = req.body.text || 'Provided notes text';
    // generator.createQuestionsFromText should return an array of { question, options, answerIndex }
    const questions = await generator.createQuestionsFromText(text);
    res.json({ success: true, questions });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Generation failed', error: err.message });
  }
});

module.exports = router;