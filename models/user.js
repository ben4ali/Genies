const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

const SALT_FACTOR = 10;

const userSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        unique: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    pfpURL: {
        type: String,
        default: "default.png"
    },
    promptsNbr: {
        type: Number,
        default: 0
    },
    imgGenNbr: {
        type: Number,
        default: 0
    },
    musicGenNbr: {
        type: Number,
        default: 0
    },
    voiceGenNbr: {
        type: Number,
        default: 0
    },
});

userSchema.pre("save",function(done){
    let user = this;
    if (!user.isModified("password")) {
        return done();
    }

    bcrypt.genSalt(SALT_FACTOR, function(error,salt){
        if (error) {
            return done(error);
        }
        bcrypt.hash(user.password, salt, function(error,hashedPassword){
            if (error) {
                return done(error);
            }
            user.password = hashedPassword;
            done();
        });
    })
})

userSchema.methods.checkPassword = function(guess) {
    return bcrypt.compare(guess, this.password);
}

const User = mongoose.model('User', userSchema);

module.exports = User;

