const mongoose = require('mongoose');

const imageGenResultSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    imgGenId: {
        type: String,
        required: true
    },
    imgGenURL: {
        type: String,
        required: true
    },
    imgGenPrompt: {
        type: String,
        required: true
    },
    saved: {
        type: Boolean,
        default: false
    },
});

const ImageGenResult = mongoose.model('ImageGenResult', imageGenResultSchema);
module.exports = ImageGenResult;