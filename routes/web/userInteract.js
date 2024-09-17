const express = require('express');
const router = express.Router();
const multer = require('multer');
const crypto = require('crypto');
const path = require('path');

const ensureAuthenticated = require('../../middleware/auth.js').ensureAuthenticated;
router.use(ensureAuthenticated);

const User = require('../../models/user.js');

const storage = multer.diskStorage({
    destination: path.resolve(__dirname, '../../public/media/profilPictures/'),
    filename: function(req,file,cb){
        crypto.pseudoRandomBytes(16, function(err, raw){
            cb(null, raw.toString('hex') + Date.now() + path.extname(file.originalname));
        });
    }
});

const upload = multer({storage: storage});

router.post('/changePfp', upload.single('image') , async function(req, res){
    User.findById(req.user._id)
        .then(user => {
            user.pfpURL = req.file.filename;
            return user.save();
        })
        .then(() => {
            res.redirect('/dashboard');
        })
        .catch(err => {
            throw err;
        });
});

module.exports = router;