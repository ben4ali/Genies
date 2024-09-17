const mongoose = require('mongoose');

const languageConversationSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    conversationId: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    saved: {
        type: Boolean,
        default: false
    },
});

const LanguageConversation = mongoose.model('LanguageConversation', languageConversationSchema);
module.exports = LanguageConversation;