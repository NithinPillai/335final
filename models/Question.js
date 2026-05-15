const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    question: { type: String, required: true },
    correct_answer: { type: String, required: true },
    category: { type: String },
    difficulty: { type: String },
    dateSaved: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Question', questionSchema);
