const express = require('express');
const router = express.Router();
const User = require('../../models/user');
const LanguageConversation = require('../../models/languageConversation');
const Activity = require('../../models/activity');
//prompt count
router.post('/incrementPromptCount', async (req, res) => {
    try {
        const userId = req.body.userId;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        user.promptsNbr++;
        await user.save();

        res.status(200).json({ message: 'Prompt count incremented successfully' });
    } catch (error) {
        console.error('Error incrementing prompt count:', error);
        res.status(500).json({ error: 'Server error' });
    }
});
//img count
router.post('/incrementImageGenerated', async (req, res) => {
    try {
        const userId = req.body.userId;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        user.imgGenNbr++;
        await user.save();

        res.status(200).json({ message: 'Image generated count incremented successfully' });
    } catch (error) {
        console.error('Error incrementing image generated count:', error);
        res.status(500).json({ error: 'Server error' });
    }
});
//music count
router.post('/incrementMusicGenerated', async (req, res) => {
    try {
        const userId = req.body.userId;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        user.musicGenNbr++;
        await user.save();
        res.status(200).json({ message: 'Music generated count incremented successfully' });
    } catch (error) {
        console.error('Error incrementing music generated count:', error);
        res.status(500).json({ error: 'Server error' });
    }
});
//voice count
router.post('/incrementVoiceGenerated', async (req, res) => {
    try {
        const userId = req.body.userId;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        user.voiceGenNbr++;
        await user.save();
        res.status(200).json({ message: 'Voice generated count incremented successfully' });
    } catch (error) {
        console.error('Error incrementing voice generated count:', error);
        res.status(500).json({ error: 'Server error' });
    }
});
//save conversation
router.post('/saveConversation', async (req, res) => {
    try {
        const { userId, conversationId } = req.body;
        const conversation = await LanguageConversation.findOne({ userId, conversationId });
        if (!conversation) {
            return res.status(404).json({ error: 'Conversation not found' });
        }
        conversation.saved = true;
        await conversation.save();
        res.status(200).json({ message: 'Conversation saved successfully' });
    } catch (error) {
        console.error('Error saving conversation:', error);
        res.status(500).json({ error: 'Server error' });
    }
});
//unsave conversation
router.post('/unsaveConversation', async (req, res) => {
    try {
        const { userId, conversationId } = req.body;
        const conversation = await LanguageConversation.findOne({ userId, conversationId });
        if (!conversation) {
            return res.status(404).json({ error: 'Conversation not found' });
        }
        conversation.saved = false;
        await conversation.save();
        res.status(200).json({ message: 'Conversation unsaved successfully' });
    } catch (error) {
        console.error('Error unsaving conversation:', error);
        res.status(500).json({ error: 'Server error' });
    }
});
//Saved Conversation
router.get('/getSavedConversation', async (req, res) => {
    try {
        const { userId } = req.query;
        const conversations = await LanguageConversation.find({ userId, saved: true });
        res.status(200).json(conversations);
    } catch (error) {
        console.error('Error getting conversation:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

//create activity
router.post('/createActivity', async (req, res) => {
    try {
        const { userId, action } = req.body;
        const newActivity = new Activity({
            userId,
            action
        });
        await newActivity.save();
        res.status(201).json({ message: 'Activity created successfully' });
    } catch (error) {
        console.error('Error creating activity:', error);
        res.status(500).json({ error: 'Server error' });
    }
});
//get all activities
router.get('/getAllActivities', async (req, res) => {
    try {
        const { userId } = req.query;
        const activities = await Activity.find({ userId });
        activities.reverse();
        activities.splice(15);
        res.status(200).json(activities);
    } catch (error) {
        console.error('Error getting activities:', error);
        res.status(500).json({ error: 'Server error' });
    }
});


module.exports = router;