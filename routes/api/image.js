const express = require('express');
const router = express.Router();
const base64 = require('base-64');
const https = require('https');
const FormData = require('form-data');
const { stabilityAiKey } = require('../../config/params');


router.post('/generateImage', (req, res) => {
    const { prompt, aspect_ratio: aspectRatio } = req.body;
    const apiUrl = 'https://api.stability.ai/v2beta/stable-image/generate/sd3';

    const form = new FormData();
    form.append('mode', 'text-to-image');
    form.append('prompt', prompt);
    form.append('aspect_ratio', aspectRatio);
    form.append('output_format', 'png');
    form.append('model', 'sd3');

    const options = {
        method: 'POST',
        headers: {
            ...form.getHeaders(),
            'Authorization': `Bearer ${stabilityAiKey}`,
        }
    };

    const request = https.request(apiUrl, options, response => {
        let data = [];
        response.on('data', chunk => {
            data.push(chunk);
        });
        response.on('end', () => {
            if (response.statusCode === 200) {
                const buffer = Buffer.concat(data);
                const base64EncodedImage = buffer.toString('base64');
                res.status(200).send(base64EncodedImage);
            } else {
                console.error(`Error response from API: ${response.statusCode} - ${response.statusMessage}`);
                console.error(`Response body: ${Buffer.concat(data).toString()}`);
                res.status(500).send('Error occurred while generating image.');
            }
        });
    });

    request.on('error', error => {
        console.error('Error with API request:', error);
        res.status(500).send('Server error');
    });

    form.pipe(request);
});
module.exports = router;