// Placeholder generator. Replace with a call to OpenAI or a custom NLP pipeline.

const { v4: uuidv4 } = require('uuid');

async function createQuestionsFromText(text) {
  // Naive split: treat each sentence as a potential Q and create a 4-option MCQ by shuffling.
  const sentences = text.split(/[\.\n]+/).map(s => s.trim()).filter(Boolean);
  const questions = [];
  for (let i = 0; i < Math.min(10, sentences.length); i++) {
    const qText = sentences[i].slice(0, 200);
    const correct = (qText.length % 4) % 4; // deterministic pseudo
    const options = [
      qText + ' (A)',
      qText + ' (B)',
      qText + ' (C)',
      qText + ' (D)'
    ];
    questions.push({ id: uuidv4(), question: qText + '?', options, answer: correct });
  }
  // if not enough sentences, return some default filler
  if (questions.length === 0) {
    questions.push({ id: uuidv4(), question: 'Placeholder question: What is the capital of France?', options: ['Paris','London','Rome','Berlin'], answer: 0 });
  }
  return questions;
}

module.exports = { createQuestionsFromText };