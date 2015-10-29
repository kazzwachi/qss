var Topic = require('../models/topic');
var modelTools = {
    generatefromFormData:function(req,threadnumber){
        var groupcode = req.user.groupcode,
            subject   = req.body.subject,
            content   = req.body.content,
            sequence  = 0,
            documentKey,
            topic;

        topic = new Topic({
            type : 'query',
            groupcode : groupcode,
            threadnumber : threadnumber,
            sequence : sequence,
            subject : subject,
            content : content,
            username : req.user.username
        });
        return topic;
    }
};
module.exports = modelTools;
