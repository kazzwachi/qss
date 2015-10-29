var express = require('express'),
    passport = require('passport'),
    Account = require('../models/account'),
    viewTools = require('../lib/viewTools'),
    router = express.Router();

router.route('/').get(function(req,res,next){
    var body={};
    
    //not been logged in
    if(!req.user){
        body.msg = "Please Login"
        res.render('index',body);
        return;
    }
    
    //logged in as user
    if(req.user.usertype === 'user'){
        res.redirect('/user');
        return;
    }
    //logged in as admin
    body.user = req.user;
    body.msg = 'Welcome ' + req.user.username;
    body.username = req.user.username;
    body = viewTools.addHeaderItems(req,body);
    res.render('index',body);
    return;
});

router.route('/login')
    .get(function(req,res){
        var body ={};
        body.msg = req.flash('error');
        res.render('login',body);
    })
    .post(
        passport.authenticate('local',{
            successRedirect:'/',
            failureRedirect:'/login',
            failureFlash:'Invalid [UserName] or [Password]',
            successFlash:'Welcome'
        }
    )
);

router.route('/logout')
    .get(function(req,res){
        req.session.destroy();
        req.logout();
        res.redirect('/');    
    });
module.exports = router;
