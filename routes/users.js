var express = require('express'),
    async = require('async'),
    router = express.Router(),
    acl = require('../lib/acl'),
    viewTools = require('../lib/viewTools'),
    modelTools = require('../lib/modelTools'),
    Topic = require('../models/topic'),
    errorRedirect = '/user/errorMessage';
    
router.route('/')
  .get(function(req,res){
    var body = {};
        body = viewTools.addHeaderItems(req,body);
    res.render('user/top',body);
  });
  
router.route('/newQuery')
  .get(function(req,res){
    var body = {};
    body = viewTools.addHeaderItems(req,body);
    res.render('user/newQuery',body);
  })
  .post(function(req,res){
    async.waterfall(
      [
        //get the count of queris,in same groupcode
        function(callback){
          Topic.count({groupcode:req.user.groupcode,type:'query'},function(err,count){
            if(err){
              callback(err,null);
            }else{
              callback(null,count);
            }
          });
        },
        //get next threadnumnber
        function(count,callback){
          try{
            count++;
            var threadnumber = ('000'+count).slice(-4);
            callback(null,threadnumber);
          }catch(err){
            callback(err,null);
          }
        },
        //make query document using new threadnumber
        function(threadnumber,callback){
          try{
            var newTopic = modelTools.generatefromFormData(req,threadnumber);
            callback(null,newTopic);
          }catch(err){
            callback(err,null);
          }
        }
      ],

      //finally save new Topic
      function(err,newTopic){
        if(err){
          req.flash('error',err.messages);
          res.redirect(errorRedirect);
          return;
        }else{
          newTopic.save(function(err){
            if(err){
              req.flash('error',err.messages);
              res.redirect(errorRedirect);
              return;
            }else{
              res.redirect('/user/processEnd');
            }
          });
        }
      }
    );
  });
router.route('/editQuery')
  .get(function(req,res){
    var key = req.query.key,
        query;
    if(typeof key !== 'undefined' && key.length === 6){
      query ={
          type:'query',
          groupcode:key.substring(0,2),
          threadnumber:key.substring(2,6)
        };
    }else{
      req.flash('error','Invalid parameters.');
      res.rediret();
    }
    var body;
    Topic.findOne(query,function(err,topic){
      if(err){
        req.flash('error',err.messages);
        res.rediret(errorRedirect);
      }else{
        if(!topic){
          req.flash('error','Topic not found.');
          res.rediret();
        }else{
          body = topic;
          body.hasError=false;
        }
        body = viewTools.addHeaderItems(req,body);
        res.render('user/editQuery',body);
      }
    });
  })
  .post(function(req,res){
    var body = req.body;
    body.hasError = false;
    body = viewTools.addHeaderItems(req,body);

    res.render('user/editQuery',req.body);
  });
  
router.route('/processEnd')
  .get(function(req,res){
    var body = {};
    body.errmsg = req.flash('error');
    body.msg = req.flash('info');
    body = viewTools.addHeaderItems(req,body);
    res.render('user/endMessage',body);
});

router.route('/errorMessage')
.get(function(req,res){
    var body = {};
    body.errmsg = req.flash('error');
    body = viewTools.addHeaderItems(req,body);
    res.render('user/errMessage',body);
});


module.exports = router;
