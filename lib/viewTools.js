var viewTools = {
    addHeaderItems:function(req,body){
        if(typeof body === 'undefined'){
            body = {};
        }
        body.user = req.user;
        body.errmsg = req.flash('error');
        body.msg = req.flash('info');
        return body;
    }
};
module.exports = viewTools;
