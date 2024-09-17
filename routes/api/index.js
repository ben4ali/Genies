const express = require('express');
const router = express.Router();


router.use('/user', require('./user')); 
router.use('/language', require('./openAi'));
router.use('/image', require('./image'));
router.use('/translate', require('./translate'));
router.use('/voice', require('./voice'));

//Add api routes here
module.exports = router;