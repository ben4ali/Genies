const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('./models/user.js');

module.exports = function() {
    passport.serializeUser(function(user, done) {
        done(null, user._id);
    });

    passport.deserializeUser(function(id, done) {
        User.findById(id)
            .then(user => {
                done(null, user);
            })
            .catch(err => {
                done(err);
            });
    });

    passport.use('login', new LocalStrategy({
        usernameField: 'username',
        passwordField: 'password',
        passReqToCallback: true
    }, function(request, username, password, done) {
        User.findOne({ username: username })
            .then(user => {
                if (!user) {
                    return done(null, false, { message: 'No user has that username' });
                }
                return user.checkPassword(password)
                    .then(isMatch => {
                        if (isMatch) {
                            return done(null, user);
                        } else {
                            return done(null, false, { message: 'Invalid password' });
                        }
                    })
                    .catch(err => {
                        return done(err);
                    });
            })
            .catch(err => {
                return done(err);
            });
    }));
};
