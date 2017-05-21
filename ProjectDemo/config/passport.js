var passport = require('passport')
, LocalStrategy = require('passport-local').Strategy
, db = require('../models');


passport.serializeUser(function (user, done){
    done(null, user);
});

passport.deserializeUser(function (user, done){
    db.User.find({where : {id : user.id}}).success(function (user){
        done(null, user);
    }).error(function (err){
        done(err, null);
    });
});

passport.use(new LocalStrategy(function (username, password, done){
    db.User.find({where : {username : username}}).success(function (user){
        passwd = user ? user.password : '';
        console.log('passwd  : ' + passwd);
        isMatch = db.User.validPassword(password, passwd,done, user);
        console.log('isMatch : ' + isMatch);
    })
}));