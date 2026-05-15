const express = require('express');
const router = express.Router();
const axios = require('axios');
const Question = require('../models/Question');

// Route to fetch trivia from API
router.get('/fetch', async (req, res) => {
    try {
        const { amount, category, difficulty, type } = req.query;
        let url = `https://opentdb.com/api.php?amount=${amount || 10}`;
        if (category) url += `&category=${category}`;
        if (difficulty) url += `&difficulty=${difficulty}`;
        if (type) url += `&type=${type}`;

        const response = await axios.get(url);
        
        // Handle Open Trivia DB Response Codes
        const responseCode = response.data.response_code;
        
        if (responseCode === 5) {
            return res.status(429).send('<h2>Rate Limit Exceeded</h2><p>Please wait 5 seconds before trying again.</p><a href="/">Go Back</a>');
        } else if (responseCode !== 0 && responseCode !== undefined) {
            return res.status(400).send(`<h2>API Error</h2><p>The trivia service returned code ${responseCode}. Try different filters.</p><a href="/">Go Back</a>`);
        }

        const questions = response.data.results;
        res.render('trivia', { questions });
    } catch (error) {
        if (error.response && error.response.status === 429) {
            console.error('Rate limited by API');
            return res.status(429).send('<h2>Rate Limit Exceeded</h2><p>The trivia service is rate-limited. Please wait 5-10 seconds before trying again.</p><a href="/">Go Back</a>');
        }
        console.error('API Fetch Error:', error.message);
        res.status(500).send('<h2>Error</h2><p>Could not reach the trivia service. Please try again later.</p><a href="/">Go Back</a>');
    }
});

// Route to save a question to MongoDB
router.post('/save', async (req, res) => {
    try {
        const { question, correct_answer, category, difficulty } = req.body;
        const newQuestion = new Question({
            question,
            correct_answer,
            category,
            difficulty
        });
        await newQuestion.save();
        res.json({ success: true, message: 'Question saved to favorites!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error saving question' });
    }
});

module.exports = router;
