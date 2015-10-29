var express = require('express'),
    passport = require('passport'),
    Account = require('../models/account'),
    router = express.Router(),
    acl = require('../lib/acl'),
    viewTools = require('../lib/viewTools');

router.route('/registerUser')
.get(acl.middleware(),function(req,res){
    var body = {
        username :'',
        password :'',
        mail     :'',
        fullname :'',
        usertype :'',
        groupcode:''
    };
    body = viewTools.addHeaderItems(req,body);
    res.render('admin/registerUser',body);
})
.post(acl.middleware(),function(req, res) {
    var username  = req.body.username,
        password  = req.body.password,
        mail      = req.body.mail,
        fullname  = req.body.fullname,
        usertype  = req.body.usertype,
        groupcode = req.body.groupcode,
        cPassword = req.body.confirm_password;
    if(password !== cPassword){
        req.flash('error','password is not match to confirm password.');
        res.redirect('/admin/registerUser');
        return;
    }
    var newAccount = new Account({
        username  : username,
        mail      : mail,
        fullname  : fullname,
        usertype  : usertype,
        groupcode : groupcode
    });
    Account.register(newAccount,password,function(err, account) {
        if (err) {
            req.flash('error',err.name + ":" +err.message);
            res.redirect('/admin/registerUser');
            return;
        }else{
            req.flash('info','New User Registered.');
            res.redirect('/admin/processEnd');
            return;
        }
    });
});

router.route('/resetPassword')
.get(acl.middleware(),function(req,res){
    var body={},
        username = req.query.username;
    Account.findByUsername(username,function(err,user){
        if(err){
            body = {
                username:'',
                msg:'',
                errmsg:err.message,
                hasError:true
            };
        }else{
            if(!user){
                body = {
                    username:'',
                    msg:'',
                    errmsg:'user not found',
                    hasError:true
                };
            }else{
                body = {
                    username:username,
                    msg:'',
                    errmsg:'',
                    hasError:false
                };
            }
        }
        body = viewTools.addHeaderItems(req,body);
        res.render('admin/resetPassword',body);
    });
})
.post(acl.middleware(),function(req,res){
    var username = req.query.username,
        username_ = req.body.username,
        errorRedirect = '/admin/resetPassword?username='+username;
    if(username !== username_){
        req.flash('error','Invalid Request Prams');
        res.redirect(errorRedirect);
        return;
    }
    if(req.body.password !== req.body.confirm_password){
        req.flash('error','password is not match to confirm password.');
        res.redirect(errorRedirect);
        return;
    }    
    Account.findByUsername(req.body.username,function(err,user){
        if(err){
            req.flash('error',err.message);
            res.redirect(errorRedirect);
            return;
        }else{
            user.setPassword(req.body.password,function(err,user){
                if(err){
                    req.flash('error',err.message);
                    res.redirect(errorRedirect);
                    return;
                }
                user.save(function(err){
                    if(err){
                        req.flash('error',err.message);
                        res.redirect(errorRedirect);
                        return;
                    }else{
                        console.log('success');
                        req.flash('info','Password has reset');
                        res.redirect('/admin/processEnd');
                        return;
                    }
                });
            });
        }
    });
});
router.route('/modifyUser')
.get(acl.middleware(),function(req,res){
    Account.findByUsername(req.query.username,
    function(err,user){
        var body={};
        if(err){
            body = {
                username:'',
                mail:'',
                fullname:'',
                usertype:'',
                groupcode:'',
                errmsg:err.message,
                hasError:true
            };
        }else{
            if(!user){
                body = {
                    username:'',
                    mail:'',
                    fullname:'',
                    usertype:'',
                    groupcode:'',
                    errmsg:'User Not Found',
                    hasError:true
                };
            }else{
                body = {
                    username:user.username,
                    mail:user.mail,
                    fullname:user.fullname,
                    usertype:user.usertype,
                    groupcode:user.groupcode,
                    errmsg:'',
                    hasError:false
                };
            }
        }
        body = viewTools.addHeaderItems(req,body);
        res.render('admin/modifyUser',body);
    });
})
.post(acl.middleware(),function(req,res){
    var username  = req.query.username,
        errorRedirect = '/admin/modifyUser?username='+username;
    Account.findByUsername(username,function(err,user){
        if(err){
            req.flash('error',err.message);
            res.redirect(errorRedirect);
            return;
        }else{
            if(!user){
                req.flash('error','UserName Not Found');
                res.redirect(errorRedirect);
                return;
            }else{
                user.mail      = req.body.mail;
                user.fullname  = req.body.fullname;
                user.usertype  = req.body.usertype;
                user.groupcode = req.body.groupcode;
                user.save(function(err,user){
                    if(err){
                        req.flash('error','Save Failed');
                        res.redirect(errorRedirect);
                        return;
                    }else{
                        req.flash('info','User Info Modified');
                        res.redirect('/admin/processEnd');
                        return;
                    }
                });
            }
        }
    });
});
router.route('/processEnd')
.get(function(req,res){
    var body = {};
    body.errmsg = req.flash('error');
    body.msg = req.flash('info');
    body = viewTools.addHeaderItems(req,body);
    res.render('admin/endMessage',body);
});
module.exports = router;