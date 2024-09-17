const express = require('express');
const router = express.Router();
const https = require('https');
const { v4: uuidv4 } = require('uuid');
const { openAIKey } = require('../../config/params');
const LanguageConversation = require('../../models/languageConversation');
const LanguageChat = require('../../models/languageChat');

const model = "gpt-3.5-turbo-instruct";
const temperature = 0.7;
const max_tokens = 250;
const top_p = 1.0;
const frequency_penalty = 0.0;
const presence_penalty = 0.0;
const n = 1;

const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${openAIKey}`,
};

const url = 'https://api.openai.com/v1/completions';

router.post('/getResponse', (req, res) => {
    const { prompt } = req.body;
    
    const body = {
        model: model,
        prompt: prompt,
        temperature: temperature,
        max_tokens: max_tokens,
        top_p: top_p,
        frequency_penalty: frequency_penalty,
        presence_penalty: presence_penalty,
        n: n,
    };
    
    const bodyString = JSON.stringify(body);
    
    const options = {
        method: 'POST',
        headers: headers,
    };
    
    const request = https.request(url, options, response => {
        let data = '';
        
        response.on('data', chunk => {
            data += chunk;
        });
        
        response.on('end', () => {
            try {
                const jsonResponse = JSON.parse(data);
                res.status(200).json(jsonResponse);
            } catch (error) {
                console.error('Error parsing AI response:', error);
                res.status(500).json({ error: 'Server error' });
            }
        });
    });
    
    request.on('error', error => {
        console.error('Error with API request:', error);
        res.status(500).json({ error: 'Server error' });
    });
    
    request.write(bodyString);
    request.end();
});
//Endpoint to ask chatGpt to make a conversation title base on the prompt
router.post('/getConversationTitle', (req, res) => {
    const { prompt } = req.body;
    const body = {
        model: model,
        prompt: "Give me a title based on the following user prompt (it can't be more than 4 words) : "+prompt,
        temperature: temperature,
        max_tokens: max_tokens,
        top_p: top_p,
        frequency_penalty: frequency_penalty,
        presence_penalty: presence_penalty,
        n: n,
    };
    const bodyString = JSON.stringify(body);
    const options = {
        method: 'POST',
        headers: headers,
    };
    const request = https.request(url, options, response => {
        let data = '';
        response.on('data', chunk => {
            data += chunk;
        });
        response.on('end', () => {
            try {
                const jsonResponse = JSON.parse(data);
                res.status(200).json(jsonResponse);
            } catch (error) {
                console.error('Error parsing AI response:', error);
                res.status(500).json({ error: 'Server error' });
            }
        });
    });
    request.on('error', error => {
        console.error('Error with API request:', error);
        res.status(500).json({ error: 'Server error' });
    });
    request.write(bodyString);
    request.end();
});

//Create a new conversation
router.post('/createConversation', async (req, res) => {
    try {
        const { userId, title, saved } = req.body;
        const conversationId = uuidv4();

        const newConversation = new LanguageConversation({
            userId,
            conversationId,
            title,
            saved
        });

        await newConversation.save();
        res.status(201).json({ message: 'Conversation created successfully', conversationId });
    } catch (error) {
        console.error('Error creating conversation:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Endpoint to add a chat to a conversation
router.post('/addChat', async (req, res) => {
    try {
        const {conversationId, message } = req.body;
        const newChat = new LanguageChat({
            conversationId,
            message
        });
        await newChat.save();
        res.status(201).json({ message: 'Chat added successfully' });
    } catch (error) {
        console.error('Error adding chat:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Endpoint to get conversation by userId
router.get('/getConversation', async (req, res) => {
    try {
        const { userId } = req.query;
        const conversations = await LanguageConversation.find({ userId });
        res.status(200).json(conversations);
    } catch (error) {
        console.error('Error getting conversation:', error);
        res.status(500).json({ error: 'Server error' });
    }
});
// Endpoint to get chat by conversationId
router.get('/getConversationId', async (req, res) => {
    try {
        const { conversationId } = req.query;
        const chats = await LanguageConversation.find({ conversationId });
        res.status(200).json(chats);
    } catch (error) {
        console.error('Error getting conversation:', error);
        res.status(500).json({ error: 'Server error' });
    }
});
// endpoint to get all chats of a conversation by conversationId
router.get('/getAllChats', async (req, res) => {
    try {
        const { conversationId } = req.query;
        const chats = await LanguageChat.find({ conversationId });
        res.status(200).json(chats);
    } catch (error) {
        console.error('Error getting conversation:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

router.delete('/deleteConversation', async (req, res) => {
    try {
        const { conversationId } = req.query; 
        if (!conversationId) {
            return res.status(400).json({ error: 'conversationId is required' });
        }
        await LanguageConversation.deleteOne({ conversationId });
        await LanguageChat.deleteMany({ conversationId });

        res.status(200).json({ message: 'Conversation deleted successfully' });
    } catch (error) {
        console.error('Error deleting conversation:', error);
        res.status(500).json({ error: 'Server error' });
    }
});
module.exports = router;