var acl = require('acl');
acl = new acl(new acl.memoryBackend());

//var mongoose = require('mongoose');
//acl = new acl(new acl.mongodbBackend(mongoose.connection,'acl_'));

acl.allow([
    {
        roles:['admin'],
        allows:[
            {resources:'/admin/registerUser',permissions:'*'},
            {resources:'/admin/resetPassword',permissions:'*'},
            {resources:'/admin/modifyUser',permissions:'*'}
        ]
    }
]);


module.exports = acl;