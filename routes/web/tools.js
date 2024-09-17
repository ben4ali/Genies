const express = require('express');
const router = express.Router();

const ensureAuthenticated = require('../../middleware/auth.js').ensureAuthenticated;

router.use(ensureAuthenticated);

router.get('/image', function(request, response){
    response.render("tools/image");
});

router.get('/language', function(request, response){
    response.render("tools/language");
});

router.get('/voice', function(request, response){
    response.render("tools/voice");
});

router.get('/music', function(request, response){
    response.render("tools/music");
});

router.get('/translate', function(request, response){
    response.render("tools/translate");
});

module.exports = router;