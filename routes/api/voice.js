const express = require('express');
const router = express.Router();
const axios = require('axios');
const { openAIKey } = require('../../config/params');

router.post('/textvoice', async (req, res) => {
    const { text, voice } = req.body;
    try {
        const response = await axios.post('https://api.openai.com/v1/audio/speech', {
            model: 'tts-1',
            input: text,
            voice: voice,
        }, {
            headers: {
                'Authorization': `Bearer ${openAIKey}`,
                'Content-Type': 'application/json',
            },
            responseType: 'stream',
        });
        response.data.pipe(res);
    } catch (error) {
        console.error('Error generating voice:', error);
        res.status(500).json({ error: 'Failed to generate voice.' });
    }
});

module.exports = router;
