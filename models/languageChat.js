const mongoose = require('mongoose');

const languageChatSchema = new mongoose.Schema({
    conversationId: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
});

const LanguageChat = mongoose.model('LanguageChat', languageChatSchema);
module.exports = LanguageChat;