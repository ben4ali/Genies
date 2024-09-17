const express = require('express');
const router = express.Router();

//TODO :: add in error and info


router.use(function(req,res,next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash('error');
    res.locals.info = req.flash('info');
    next();
});

router.use('/', require('./home'));
router.use('/tools', require('./tools'));
router.use('/profil', require('./userInteract'));
module.exports = router;