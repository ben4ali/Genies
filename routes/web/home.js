const express = require('express');
const router = express.Router();
const passport = require('passport');
const uuid = require('uuid');
const User = require('../../models/user.js');

const ensureAuthenticated = require('../../middleware/auth.js').ensureAuthenticated;

router.get('/', function(request, response){
    response.render("index");
});

router.get('/auth', function(request, response){
    response.render("auth");
});

router.get('/dashboard', ensureAuthenticated, function(request, response){
    response.render("dashboard");
});

//post routes

router.post('/login', passport.authenticate('login', {
    successRedirect: '/dashboard',
    failureRedirect: '/auth',
    failureFlash: true
}));

router.get('/logout', function(request, response){
    request.logout(function(err) {
        if (err) {
            console.error(err);
            return next(err);
        }
        response.redirect('/');
    });
});


router.post('/register', async function(request, response, next) {
    const { username, email, password, confirmPassword } = request.body;

    try {
        if (!username || !email || !password || !confirmPassword) {
            request.flash('error', 'All fields are required');
            return response.redirect('/auth');
        }

        if (password !== confirmPassword) {
            request.flash('error', 'Passwords do not match');
            return response.redirect('/auth');
        }

        const userId = uuid.v4();

        const existingUser = await Promise.all([
            User.findOne({ userId: userId }),
            User.findOne({ username: username }),
            User.findOne({ email: email })
        ]);

        if (existingUser[0]) {
            request.flash('error', 'User with this userId already exists');
            return response.redirect('/auth');
        }

        if (existingUser[1]) {
            request.flash('error', 'User with this username already exists');
            return response.redirect('/auth');
        }

        if (existingUser[2]) {
            request.flash('error', 'User with this email already exists');
            return response.redirect('/auth');
        }

        // Create new user
        const newUser = new User({
            userId: userId,
            username: username,
            email: email,
            password: password
        });

        await newUser.save();

        // Authenticate user after registration
        passport.authenticate('login', {
            successRedirect: '/dashboard',
            failureRedirect: '/auth',
            failureFlash: true
        })(request, response, next);
    } catch (error) {
        console.error('Error registering user:', error);
        request.flash('error', 'Error registering user');
        response.redirect('/auth');
    }
});


module.exports = router;