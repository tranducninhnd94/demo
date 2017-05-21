var db = require('../models');

exports.signUp = function (req, res) {
    res.render('signup.html');
}

exports.register = function (req, res) {
    db.User.find({ where: { username: req.body.username } }).success(function (err, user) {
        if (!user) {
            db.User.create({ username: req.body.username, password: req.body.password }).error(function (err) {
                console.log(err);
            });
        } else {
            res.redirect('/register');
        }
    });
    res.redirect('/');
}