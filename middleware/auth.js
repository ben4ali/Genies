const ensureAuth = function ensureAuthenticated(req,res,next){
    if (req.isAuthenticated()){
        next();
    } else{
        req.flash('error','You must be logged in to access this page.');
        res.redirect('/auth');
    }
}

module.exports = {ensureAuthenticated: ensureAuth}