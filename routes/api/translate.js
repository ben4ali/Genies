const express = require('express');
const router = express.Router();
const https = require('https');
const { deepLAPIKey } = require('../../config/params');


router.post('/translateText', (req, res) => {
    const { text, target_lang } = req.body;

    const apiUrl = 'https://api-free.deepl.com/v2/translate';
    const url = new URL(apiUrl);

    const requestBody = JSON.stringify({
        text: [text],
        target_lang: target_lang
    });

    const options = {
        hostname: url.hostname,
        path: url.pathname,
        method: 'POST',
        headers: {
            'Authorization': `DeepL-Auth-Key ${deepLAPIKey}`,
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(requestBody)
        }
    };
    const request = https.request(options, response => {
        let data = '';
        response.on('data', chunk => {
            data += chunk;
        });
        response.on('end', () => {
            try {
                const responseData = JSON.parse(data);
                res.status(200).json(responseData);
            } catch (error) {
                console.error('Error parsing DeepL API response:', error);
                res.status(500).json({ error: 'Server error' });
            }
        });
    });
    request.on('error', error => {
        console.error('Error with DeepL API request:', error);
        res.status(500).json({ error: 'Server error' });
    });
    request.write(requestBody);
    request.end();
});
module.exports = router;