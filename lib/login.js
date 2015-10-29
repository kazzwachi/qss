var acl = require('./acl'),
    login = function(req,res,next){
    if(req.user){
        if(req.session.orgurl){
            var redirectTo = req.session.orgurl;
            req.session.orgurl = null;
            res.redirect(redirectTo);
            return;
        }else{
            if(typeof req.session.userId === 'undefined'){
                req.session.userId = req.user.username;
                acl.addUserRoles(req.user.username,req.user.usertype);
            }
            next();
            return;
        }
        return;
    }
    if(req.url.lastIndexOf('/login',0) >= 0){
        next();
        return;
    }
    req.session.orgurl = req.url;
    res.redirect('/login');
};

module.exports = login;