const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    action: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
}); 

const Activity = mongoose.model('Activity', activitySchema);
module.exports = Activity;