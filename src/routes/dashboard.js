const router = require ('express').Router();

function isAuthorized(req, res, next) {
    if(req.user) {
        console.log("User is very ssam@bbong");
        console.log(req.user);
        next();
    }
    else {
        console.log("user have no didi");
        res.redirect('/');
    }
}

router.get('/', isAuthorized, (req, res) => {
    res.render('dashboard');
});

router.get('/settings', isAuthorized,  (req, res) => {
    res.send(200);
});

module.exports = router