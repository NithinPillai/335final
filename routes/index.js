const express = require('express');
const router = express.Router();
const Question = require('../models/Question');

// Home page
router.get('/', (req, res) => {
    res.render('index');
});

// Saved questions page
router.get('/saved', async (req, res) => {
    try {
        const savedQuestions = await Question.find().sort({ dateSaved: -1 });
        res.render('saved', { questions: savedQuestions });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error retrieving saved questions');
    }
});

// Delete a saved question
router.post('/delete/:id', async (req, res) => {
    try {
        await Question.findByIdAndDelete(req.params.id);
        res.redirect('/saved');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error deleting question');
    }
});

// Clear all saved questions
router.post('/clear', async (req, res) => {
    try {
        await Question.deleteMany({});
        res.redirect('/saved');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error clearing questions');
    }
});

module.exports = router;
